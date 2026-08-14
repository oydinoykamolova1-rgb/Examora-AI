using Microsoft.EntityFrameworkCore;
using TestPlatform.Data.Repositories;
using TestPlatform.Domain.Entities;
using TestPlatform.Service.Common;
using TestPlatform.Service.DTOs;

namespace TestPlatform.Service.Services;

public interface IQuestionService
{
    Task<ApiResponse<QuestionDto>> CreateAsync(int testId, CreateQuestionDto dto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}

public class QuestionService : IQuestionService
{
    private readonly IRepository<Question> _questionRepository;
    private readonly IRepository<Test> _testRepository;

    public QuestionService(IRepository<Question> questionRepository, IRepository<Test> testRepository)
    {
        _questionRepository = questionRepository;
        _testRepository = testRepository;
    }

    public async Task<ApiResponse<QuestionDto>> CreateAsync(int testId, CreateQuestionDto dto)
    {
        var test = await _testRepository.GetByIdAsync(testId);
        if (test == null)
            return ApiResponse<QuestionDto>.Fail("Test topilmadi", 404);

        var question = new Question
        {
            TestId = testId,
            Text = dto.Text,
            Points = dto.Points,
            Options = dto.Options.Select(o => new Option
            {
                Text = o.Text,
                IsCorrect = o.IsCorrect
            }).ToList()
        };

        await _questionRepository.AddAsync(question);
        await _questionRepository.SaveChangesAsync();

        var result = new QuestionDto
        {
            Id = question.Id,
            TestId = question.TestId,
            Text = question.Text,
            Points = question.Points,
            Options = question.Options.Select(o => new OptionDto
            {
                Id = o.Id,
                QuestionId = o.QuestionId,
                Text = o.Text,
                IsCorrect = o.IsCorrect
            }).ToList()
        };

        return ApiResponse<QuestionDto>.Ok(result, "Savol muvaffaqiyatli qo'shildi");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var question = await _questionRepository.GetByIdAsync(id);
        if (question == null)
            return ApiResponse<bool>.Fail("Savol topilmadi", 404);

        _questionRepository.Delete(question);
        await _questionRepository.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Savol o'chirildi");
    }
}
