using Microsoft.AspNetCore.Mvc;
using TestPlatform.Service.DTOs;
using TestPlatform.Service.Services;

namespace TestPlatform.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _studentService.GetAllAsync();
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _studentService.GetByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateStudentDto dto)
    {
        var result = await _studentService.RegisterAsync(dto);
        return StatusCode(result.StatusCode, result);
    }
}
