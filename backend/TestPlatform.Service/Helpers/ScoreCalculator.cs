using TestPlatform.Domain.Entities;
using TestPlatform.Service.DTOs;

namespace TestPlatform.Service.Helpers;

public interface IScoreCalculator
{
    (decimal score, decimal totalPossibleScore, bool isPassed, List<DetailedAnswerDto> details) CalculateScore(
        Test test,
        List<StudentAnswerInputDto> submittedAnswers);
}

public class ScoreCalculator : IScoreCalculator
{
    /// <summary>
    /// Imtihon ballarini hisoblash biznes logikasi.
    /// Har bir savol bo'yicha talaba tanlagan variantni (SelectedOptionId) 
    /// to'g'ri variant (IsCorrect == true) bilan solishtiradi.
    /// </summary>
    public (decimal score, decimal totalPossibleScore, bool isPassed, List<DetailedAnswerDto> details) CalculateScore(
        Test test,
        List<StudentAnswerInputDto> submittedAnswers)
    {
        decimal earnedScore = 0.0m;
        decimal totalPossibleScore = 0.0m;
        var details = new List<DetailedAnswerDto>();

        // Map submitted answers dictionary for quick O(1) lookup
        var answerMap = submittedAnswers
            .GroupBy(a => a.QuestionId)
            .ToDictionary(g => g.Key, g => g.First().SelectedOptionId);

        foreach (var question in test.Questions)
        {
            totalPossibleScore += question.Points;

            var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
            int selectedOptionId = answerMap.TryGetValue(question.Id, out var optId) ? optId : 0;
            var selectedOption = question.Options.FirstOrDefault(o => o.Id == selectedOptionId);

            bool isCorrect = (correctOption != null && selectedOptionId == correctOption.Id);

            if (isCorrect)
            {
                earnedScore += question.Points;
            }

            details.Add(new DetailedAnswerDto
            {
                QuestionId = question.Id,
                QuestionText = question.Text,
                Points = isCorrect ? question.Points : 0.0m,
                SelectedOptionId = selectedOptionId,
                SelectedOptionText = selectedOption?.Text ?? "Javob berilmadi",
                CorrectOptionId = correctOption?.Id ?? 0,
                CorrectOptionText = correctOption?.Text ?? "Noma'lum",
                IsCorrect = isCorrect
            });
        }

        bool isPassed = earnedScore >= test.PassScore;

        return (earnedScore, totalPossibleScore, isPassed, details);
    }
}
