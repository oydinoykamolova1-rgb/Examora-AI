using Microsoft.EntityFrameworkCore;
using TestPlatform.Data.Repositories;
using TestPlatform.Domain.Entities;
using TestPlatform.Service.Common;
using TestPlatform.Service.DTOs;

namespace TestPlatform.Service.Services;

public interface ITestService
{
    Task<ApiResponse<List<TestDto>>> GetAllAsync(int? subjectId = null);
    Task<ApiResponse<TestDto>> GetByIdAsync(int id);
    Task<ApiResponse<StudentTestDetailDto>> GetForStudentAsync(int id);
    Task<ApiResponse<TestDto>> CreateAsync(CreateTestDto dto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}

public class TestService : ITestService
{
    private readonly IRepository<Test> _testRepository;
    private readonly IRepository<Subject> _subjectRepository;

    public TestService(IRepository<Test> testRepository, IRepository<Subject> subjectRepository)
    {
        _testRepository = testRepository;
        _subjectRepository = subjectRepository;
    }

    public async Task<ApiResponse<List<TestDto>>> GetAllAsync(int? subjectId = null)
    {
        var query = _testRepository.GetAll().Include(t => t.Subject).Include(t => t.Questions).AsQueryable();

        if (subjectId.HasValue && subjectId.Value > 0)
        {
            query = query.Where(t => t.SubjectId == subjectId.Value);
        }

        var tests = await query.Select(t => new TestDto
        {
            Id = t.Id,
            SubjectId = t.SubjectId,
            SubjectName = t.Subject != null ? t.Subject.Name : "Noma'lum fan",
            Title = t.Title,
            Description = t.Description,
            DurationMinutes = t.DurationMinutes,
            PassScore = t.PassScore,
            TotalScore = t.TotalScore,
            QuestionCount = t.Questions.Count(q => !q.IsDeleted),
            CreatedAt = t.CreatedAt
        }).ToListAsync();

        return ApiResponse<List<TestDto>>.Ok(tests);
    }

    public async Task<ApiResponse<TestDto>> GetByIdAsync(int id)
    {
        var test = await _testRepository.GetAll()
            .Include(t => t.Subject)
            .Include(t => t.Questions)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (test == null)
            return ApiResponse<TestDto>.Fail("Test topilmadi", 404);

        var dto = new TestDto
        {
            Id = test.Id,
            SubjectId = test.SubjectId,
            SubjectName = test.Subject?.Name ?? "",
            Title = test.Title,
            Description = test.Description,
            DurationMinutes = test.DurationMinutes,
            PassScore = test.PassScore,
            TotalScore = test.TotalScore,
            QuestionCount = test.Questions.Count(q => !q.IsDeleted),
            CreatedAt = test.CreatedAt
        };

        return ApiResponse<TestDto>.Ok(dto);
    }

    public async Task<ApiResponse<StudentTestDetailDto>> GetForStudentAsync(int id)
    {
        var test = await _testRepository.GetAll()
            .Include(t => t.Subject)
            .Include(t => t.Questions)
                .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (test == null)
            return ApiResponse<StudentTestDetailDto>.Fail("Test topilmadi", 404);

        // Map to Student Test Detail without IsCorrect!
        var studentDto = new StudentTestDetailDto
        {
            Id = test.Id,
            SubjectId = test.SubjectId,
            SubjectName = test.Subject?.Name ?? "",
            Title = test.Title,
            Description = test.Description,
            DurationMinutes = test.DurationMinutes,
            PassScore = test.PassScore,
            TotalScore = test.TotalScore,
            Questions = test.Questions.Where(q => !q.IsDeleted).Select(q => new StudentQuestionDto
            {
                Id = q.Id,
                TestId = q.TestId,
                Text = q.Text,
                Points = q.Points,
                Options = q.Options.Where(o => !o.IsDeleted).Select(o => new StudentOptionDto
                {
                    Id = o.Id,
                    QuestionId = o.QuestionId,
                    Text = o.Text
                    // IsCorrect is NOT populated here for security!
                }).ToList()
            }).ToList()
        };

        return ApiResponse<StudentTestDetailDto>.Ok(studentDto);
    }

    public async Task<ApiResponse<TestDto>> CreateAsync(CreateTestDto dto)
    {
        var subject = await _subjectRepository.GetByIdAsync(dto.SubjectId);
        if (subject == null)
            return ApiResponse<TestDto>.Fail("Kiritilgan fan topilmadi", 404);

        var test = new Test
        {
            SubjectId = dto.SubjectId,
            Title = dto.Title,
            Description = dto.Description,
            DurationMinutes = dto.DurationMinutes,
            PassScore = dto.PassScore,
            TotalScore = dto.TotalScore
        };

        if (dto.Questions != null && dto.Questions.Any())
        {
            foreach (var qDto in dto.Questions)
            {
                var question = new Question
                {
                    Text = qDto.Text,
                    Points = qDto.Points,
                    Options = qDto.Options.Select(o => new Option
                    {
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                };
                test.Questions.Add(question);
            }
        }

        await _testRepository.AddAsync(test);
        await _testRepository.SaveChangesAsync();

        var resultDto = new TestDto
        {
            Id = test.Id,
            SubjectId = test.SubjectId,
            SubjectName = subject.Name,
            Title = test.Title,
            Description = test.Description,
            DurationMinutes = test.DurationMinutes,
            PassScore = test.PassScore,
            TotalScore = test.TotalScore,
            QuestionCount = test.Questions.Count,
            CreatedAt = test.CreatedAt
        };

        return ApiResponse<TestDto>.Ok(resultDto, "Test muvaffaqiyatli yaratildi");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var test = await _testRepository.GetByIdAsync(id);
        if (test == null)
            return ApiResponse<bool>.Fail("Test topilmadi", 404);

        _testRepository.Delete(test);
        await _testRepository.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Test o'chirildi");
    }
}
