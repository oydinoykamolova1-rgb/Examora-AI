using Microsoft.EntityFrameworkCore;
using TestPlatform.Data.Repositories;
using TestPlatform.Domain.Entities;
using TestPlatform.Service.Common;
using TestPlatform.Service.DTOs;
using TestPlatform.Service.Helpers;

namespace TestPlatform.Service.Services;

public interface ISubmissionService
{
    Task<ApiResponse<SubmissionResultDto>> StartTestAsync(StartTestInputDto dto);
    Task<ApiResponse<SubmissionResultDto>> SubmitTestAsync(SubmitTestInputDto dto);
    Task<ApiResponse<SubmissionResultDto>> GetResultAsync(int submissionId);
    Task<ApiResponse<List<SubmissionResultDto>>> GetAllSubmissionsAsync();
}

public class SubmissionService : ISubmissionService
{
    private readonly IRepository<Submission> _submissionRepository;
    private readonly IRepository<Test> _testRepository;
    private readonly IRepository<Student> _studentRepository;
    private readonly IScoreCalculator _scoreCalculator;

    public SubmissionService(
        IRepository<Submission> submissionRepository,
        IRepository<Test> testRepository,
        IRepository<Student> studentRepository,
        IScoreCalculator scoreCalculator)
    {
        _submissionRepository = submissionRepository;
        _testRepository = testRepository;
        _studentRepository = studentRepository;
        _scoreCalculator = scoreCalculator;
    }

    public async Task<ApiResponse<SubmissionResultDto>> StartTestAsync(StartTestInputDto dto)
    {
        var test = await _testRepository.GetByIdAsync(dto.TestId);
        if (test == null)
            return ApiResponse<SubmissionResultDto>.Fail("Test topilmadi", 404);

        var submission = new Submission
        {
            StudentId = dto.StudentId,
            TestId = dto.TestId,
            StartedAt = DateTime.UtcNow,
            Score = 0,
            TotalPossibleScore = test.TotalScore,
            IsPassed = false
        };

        await _submissionRepository.AddAsync(submission);
        await _submissionRepository.SaveChangesAsync();

        var result = new SubmissionResultDto
        {
            SubmissionId = submission.Id,
            StudentId = dto.StudentId,
            StudentName = "Talaba",
            TestId = test.Id,
            TestTitle = test.Title,
            PassScore = test.PassScore,
            TotalPossibleScore = test.TotalScore,
            StartedAt = submission.StartedAt
        };

        return ApiResponse<SubmissionResultDto>.Ok(result, "Test boshlandi");
    }

    public async Task<ApiResponse<SubmissionResultDto>> SubmitTestAsync(SubmitTestInputDto dto)
    {
        var submission = await _submissionRepository.GetAll()
            .Include(s => s.Student)
            .Include(s => s.Test)
                .ThenInclude(t => t!.Questions)
                    .ThenInclude(q => q.Options)
            .Include(s => s.StudentAnswers)
            .FirstOrDefaultAsync(s => s.Id == dto.SubmissionId);

        if (submission == null)
            return ApiResponse<SubmissionResultDto>.Fail("Ushbu urinish (submission) topilmadi", 404);

        if (submission.CompletedAt.HasValue)
            return ApiResponse<SubmissionResultDto>.Fail("Ushbu test allaqachon topshirilgan", 400);

        if (submission.Test == null)
            return ApiResponse<SubmissionResultDto>.Fail("Test ma'lumoti topilmadi", 404);

        // Grade using ScoreCalculator
        var (score, totalPossible, isPassed, details) = _scoreCalculator.CalculateScore(submission.Test, dto.Answers);

        submission.CompletedAt = DateTime.UtcNow;
        submission.Score = score;
        submission.TotalPossibleScore = totalPossible;
        submission.IsPassed = isPassed;

        // Clear existing answers if any and insert new student answers
        submission.StudentAnswers.Clear();
        foreach (var ans in dto.Answers)
        {
            submission.StudentAnswers.Add(new StudentAnswer
            {
                SubmissionId = submission.Id,
                QuestionId = ans.QuestionId,
                SelectedOptionId = ans.SelectedOptionId
            });
        }

        _submissionRepository.Update(submission);
        await _submissionRepository.SaveChangesAsync();

        int timeTaken = (int)(submission.CompletedAt.Value - submission.StartedAt).TotalSeconds;
        double timeTakenMinutes = Math.Round(timeTaken / 60.0, 1);
        decimal percentage = totalPossible > 0 ? Math.Round((score / totalPossible) * 100, 1) : 0;
        
        int correctCount = details.Count(d => d.IsCorrect);
        decimal accuracyPercentage = details.Count > 0 ? Math.Round(((decimal)correctCount / details.Count) * 100, 1) : 0;

        string knowledgeLevel = percentage switch
        {
            >= 90 => "Ekspert (Level C2)",
            >= 75 => "Yuqori (Level C1)",
            >= 60 => "O'rta (Level B2)",
            _ => "Boshlang'ich (Level A2)"
        };

        var resultDto = new SubmissionResultDto
        {
            SubmissionId = submission.Id,
            StudentId = submission.StudentId,
            StudentName = submission.Student?.FullName ?? "Talaba",
            TestId = submission.TestId,
            TestTitle = submission.Test?.Title ?? "",
            Score = score,
            TotalPossibleScore = totalPossible,
            Percentage = percentage,
            AccuracyPercentage = accuracyPercentage,
            KnowledgeLevel = knowledgeLevel,
            PassScore = submission.Test?.PassScore ?? 60.0m,
            IsPassed = isPassed,
            StartedAt = submission.StartedAt,
            CompletedAt = submission.CompletedAt,
            TimeTakenSeconds = timeTaken,
            TimeTakenMinutes = timeTakenMinutes,
            DetailedAnswers = details
        };

        return ApiResponse<SubmissionResultDto>.Ok(resultDto, "Test natijangiz muvaffaqiyatli hisoblandi");
    }

    public async Task<ApiResponse<SubmissionResultDto>> GetResultAsync(int submissionId)
    {
        var submission = await _submissionRepository.GetAll()
            .Include(s => s.Student)
            .Include(s => s.Test)
                .ThenInclude(t => t!.Questions)
                    .ThenInclude(q => q.Options)
            .Include(s => s.StudentAnswers)
            .FirstOrDefaultAsync(s => s.Id == submissionId);

        if (submission == null)
            return ApiResponse<SubmissionResultDto>.Fail("Natija topilmadi", 404);

        var submittedAnswers = submission.StudentAnswers.Select(sa => new StudentAnswerInputDto
        {
            QuestionId = sa.QuestionId,
            SelectedOptionId = sa.SelectedOptionId
        }).ToList();

        var (score, totalPossible, isPassed, details) = _scoreCalculator.CalculateScore(submission.Test!, submittedAnswers);

        int timeTaken = submission.CompletedAt.HasValue 
            ? (int)(submission.CompletedAt.Value - submission.StartedAt).TotalSeconds 
            : 0;

        double timeTakenMinutes = Math.Round(timeTaken / 60.0, 1);
        decimal percentage = totalPossible > 0 ? Math.Round((submission.Score / totalPossible) * 100, 1) : 0;
        int correctCount = details.Count(d => d.IsCorrect);
        decimal accuracyPercentage = details.Count > 0 ? Math.Round(((decimal)correctCount / details.Count) * 100, 1) : 0;

        string knowledgeLevel = percentage switch
        {
            >= 90 => "Ekspert (Level C2)",
            >= 75 => "Yuqori (Level C1)",
            >= 60 => "O'rta (Level B2)",
            _ => "Boshlang'ich (Level A2)"
        };

        var dto = new SubmissionResultDto
        {
            SubmissionId = submission.Id,
            StudentId = submission.StudentId,
            StudentName = submission.Student?.FullName ?? "",
            TestId = submission.TestId,
            TestTitle = submission.Test?.Title ?? "",
            Score = submission.Score,
            TotalPossibleScore = submission.TotalPossibleScore,
            Percentage = percentage,
            AccuracyPercentage = accuracyPercentage,
            KnowledgeLevel = knowledgeLevel,
            PassScore = submission.Test?.PassScore ?? 60.0m,
            IsPassed = submission.IsPassed,
            StartedAt = submission.StartedAt,
            CompletedAt = submission.CompletedAt,
            TimeTakenSeconds = timeTaken,
            TimeTakenMinutes = timeTakenMinutes,
            DetailedAnswers = details
        };

        return ApiResponse<SubmissionResultDto>.Ok(dto);
    }

    public async Task<ApiResponse<List<SubmissionResultDto>>> GetAllSubmissionsAsync()
    {
        var submissions = await _submissionRepository.GetAll()
            .Include(s => s.Student)
            .Include(s => s.Test)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        var result = submissions.Select(s => {
            decimal perc = s.TotalPossibleScore > 0 ? Math.Round((s.Score / s.TotalPossibleScore) * 100, 1) : 0;
            int timeSec = s.CompletedAt.HasValue ? (int)(s.CompletedAt.Value - s.StartedAt).TotalSeconds : 0;

            return new SubmissionResultDto
            {
                SubmissionId = s.Id,
                StudentId = s.StudentId,
                StudentName = s.Student?.FullName ?? "Talaba",
                TestId = s.TestId,
                TestTitle = s.Test?.Title ?? "",
                Score = s.Score,
                TotalPossibleScore = s.TotalPossibleScore,
                Percentage = perc,
                AccuracyPercentage = perc,
                KnowledgeLevel = perc switch
                {
                    >= 90 => "Ekspert (Level C2)",
                    >= 75 => "Yuqori (Level C1)",
                    >= 60 => "O'rta (Level B2)",
                    _ => "Boshlang'ich (Level A2)"
                },
                PassScore = s.Test?.PassScore ?? 60.0m,
                IsPassed = s.IsPassed,
                StartedAt = s.StartedAt,
                CompletedAt = s.CompletedAt,
                TimeTakenSeconds = timeSec,
                TimeTakenMinutes = Math.Round(timeSec / 60.0, 1)
            };
        }).ToList();

        return ApiResponse<List<SubmissionResultDto>>.Ok(result);
    }
}
