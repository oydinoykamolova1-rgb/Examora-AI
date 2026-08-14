using Microsoft.AspNetCore.Mvc;
using TestPlatform.Service.DTOs;
using TestPlatform.Service.Services;

namespace TestPlatform.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubjectsController : ControllerBase
{
    private readonly ISubjectService _subjectService;

    public SubjectsController(ISubjectService subjectService)
    {
        _subjectService = subjectService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _subjectService.GetAllAsync();
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _subjectService.GetByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSubjectDto dto)
    {
        var result = await _subjectService.CreateAsync(dto);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _subjectService.DeleteAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
