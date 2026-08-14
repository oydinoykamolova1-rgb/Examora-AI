using Microsoft.AspNetCore.Mvc;
using TestPlatform.Service.DTOs;
using TestPlatform.Service.Services;

namespace TestPlatform.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var result = await _authService.GetAllUsersAsync();
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("users/status")]
    public async Task<IActionResult> UpdateUserStatus([FromBody] UpdateUserStatusDto dto)
    {
        var result = await _authService.UpdateUserStatusAsync(dto);
        return StatusCode(result.StatusCode, result);
    }
}
