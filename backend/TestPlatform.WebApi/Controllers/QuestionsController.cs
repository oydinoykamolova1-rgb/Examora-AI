using Microsoft.AspNetCore.Mvc;
using TestPlatform.Service.DTOs;
using TestPlatform.Service.Services;

namespace TestPlatform.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly IQuestionService _questionService;

    public QuestionsController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpPost("test/{testId:int}")]
    public async Task<IActionResult> Create(int testId, [FromBody] CreateQuestionDto dto)
    {
        var result = await _questionService.CreateAsync(testId, dto);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _questionService.DeleteAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
