using Microsoft.AspNetCore.Mvc;
using TestPlatform.Service.DTOs;
using TestPlatform.Service.Services;

namespace TestPlatform.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestsController : ControllerBase
{
    private readonly ITestService _testService;

    public TestsController(ITestService testService)
    {
        _testService = testService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? subjectId)
    {
        var result = await _testService.GetAllAsync(subjectId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _testService.GetByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    // Secure Student Endpoint: Excludes IsCorrect from options!
    [HttpGet("{id:int}/student")]
    public async Task<IActionResult> GetForStudent(int id)
    {
        var result = await _testService.GetForStudentAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTestDto dto)
    {
        var result = await _testService.CreateAsync(dto);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _testService.DeleteAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
