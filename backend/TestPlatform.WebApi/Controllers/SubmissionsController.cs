using Microsoft.AspNetCore.Mvc;
using TestPlatform.Service.DTOs;
using TestPlatform.Service.Services;

namespace TestPlatform.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubmissionsController : ControllerBase
{
    private readonly ISubmissionService _submissionService;

    public SubmissionsController(ISubmissionService submissionService)
    {
        _submissionService = submissionService;
    }

    [HttpPost("start")]
    public async Task<IActionResult> StartTest([FromBody] StartTestInputDto dto)
    {
        var result = await _submissionService.StartTestAsync(dto);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitTest([FromBody] SubmitTestInputDto dto)
    {
        var result = await _submissionService.SubmitTestAsync(dto);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id:int}/result")]
    public async Task<IActionResult> GetResult(int id)
    {
        var result = await _submissionService.GetResultAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _submissionService.GetAllSubmissionsAsync();
        return StatusCode(result.StatusCode, result);
    }
}
