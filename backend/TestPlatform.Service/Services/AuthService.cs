using Microsoft.EntityFrameworkCore;
using TestPlatform.Data.DbContexts;
using TestPlatform.Data.Repositories;
using TestPlatform.Domain.Entities;
using TestPlatform.Service.Common;
using TestPlatform.Service.DTOs;
using TestPlatform.Service.Helpers;

namespace TestPlatform.Service.Services;

public interface IAuthService
{
    Task<ApiResponse<UserDto>> RegisterAsync(RegisterDto dto);
    Task<ApiResponse<UserDto>> LoginAsync(LoginDto dto);
    Task<ApiResponse<List<UserDto>>> GetAllUsersAsync();
    Task<ApiResponse<UserDto>> UpdateUserStatusAsync(UpdateUserStatusDto dto);
}

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;

    public AuthService(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<ApiResponse<UserDto>> RegisterAsync(RegisterDto dto)
    {
        var existing = await _userRepository.GetAll()
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

        if (existing != null)
        {
            return ApiResponse<UserDto>.Fail("Ushbu email bilan ro'yxatdan o'tilgan. Iltimos, Tizimga Kiring.", 400);
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = PasswordHasher.HashPassword(dto.Password),
            Role = string.IsNullOrWhiteSpace(dto.Role) ? "O'quvchi" : dto.Role,
            GroupNumber = dto.GroupNumber,
            IsPresent = true,
            TeacherGradeNote = "Yangi ro'yxatdan o'tdi"
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var result = new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            GroupNumber = user.GroupNumber,
            IsPresent = user.IsPresent,
            TeacherGradeNote = user.TeacherGradeNote,
            Token = JwtTokenGenerator.GenerateToken(user)
        };

        return ApiResponse<UserDto>.Ok(result, "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi");
    }

    public async Task<ApiResponse<UserDto>> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetAll()
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

        if (user == null)
        {
            return ApiResponse<UserDto>.Fail("Bunday email manzili topilmadi", 404);
        }

        bool isPasswordValid = PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            return ApiResponse<UserDto>.Fail("Parol noto'g'ri kiritildi", 400);
        }

        var result = new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            GroupNumber = user.GroupNumber,
            IsPresent = user.IsPresent,
            TeacherGradeNote = user.TeacherGradeNote,
            Token = JwtTokenGenerator.GenerateToken(user)
        };

        return ApiResponse<UserDto>.Ok(result, $"Hush kelibsiz, {user.FullName}!");
    }

    public async Task<ApiResponse<List<UserDto>>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAll().Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role,
            GroupNumber = u.GroupNumber,
            IsPresent = u.IsPresent,
            TeacherGradeNote = u.TeacherGradeNote
        }).ToListAsync();

        return ApiResponse<List<UserDto>>.Ok(users);
    }

    public async Task<ApiResponse<UserDto>> UpdateUserStatusAsync(UpdateUserStatusDto dto)
    {
        var user = await _userRepository.GetByIdAsync(dto.UserId);
        if (user == null)
            return ApiResponse<UserDto>.Fail("Foydalanuvchi topilmadi", 404);

        user.IsPresent = dto.IsPresent;
        user.TeacherGradeNote = dto.TeacherGradeNote;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        var result = new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            GroupNumber = user.GroupNumber,
            IsPresent = user.IsPresent,
            TeacherGradeNote = user.TeacherGradeNote
        };

        return ApiResponse<UserDto>.Ok(result, "O'quvchi davomati va bahosi yangilandi");
    }
}
