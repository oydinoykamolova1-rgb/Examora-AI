using Microsoft.AspNetCore.Mvc;
using TestPlatform.Service.DTOs;
using TestPlatform.Service.Services;

namespace TestPlatform.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;

    public AiController(IAiService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("explain")]
    public async Task<IActionResult> ExplainAnswer([FromBody] ExplainAnswerInputDto dto)
    {
        var result = await _aiService.ExplainAnswerAsync(dto);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("generate-test")]
    public async Task<IActionResult> GenerateTest([FromBody] GenerateTestInputDto dto)
    {
        var result = await _aiService.GenerateTestQuestionsAsync(dto);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("chat")]
    public async Task<IActionResult> AskAi([FromBody] AiChatInputDto dto)
    {
        var result = await _aiService.AskAiAssistantAsync(dto);
        return StatusCode(result.StatusCode, result);
    }
}
