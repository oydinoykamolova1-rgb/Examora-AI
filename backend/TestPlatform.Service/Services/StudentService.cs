using Microsoft.EntityFrameworkCore;
using TestPlatform.Data.Repositories;
using TestPlatform.Domain.Entities;
using TestPlatform.Service.Common;
using TestPlatform.Service.DTOs;

namespace TestPlatform.Service.Services;

public interface IStudentService
{
    Task<ApiResponse<List<StudentDto>>> GetAllAsync();
    Task<ApiResponse<StudentDto>> GetByIdAsync(int id);
    Task<ApiResponse<StudentDto>> RegisterAsync(CreateStudentDto dto);
}

public class StudentService : IStudentService
{
    private readonly IRepository<Student> _studentRepository;

    public StudentService(IRepository<Student> studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<ApiResponse<List<StudentDto>>> GetAllAsync()
    {
        var students = await _studentRepository.GetAll()
            .Include(s => s.Submissions)
            .Select(s => new StudentDto
            {
                Id = s.Id,
                FullName = s.FullName,
                Email = s.Email,
                GroupNumber = s.GroupNumber,
                SubmissionsCount = s.Submissions.Count(sub => !sub.IsDeleted),
                CreatedAt = s.CreatedAt
            })
            .ToListAsync();

        return ApiResponse<List<StudentDto>>.Ok(students);
    }

    public async Task<ApiResponse<StudentDto>> GetByIdAsync(int id)
    {
        var student = await _studentRepository.GetAll()
            .Include(s => s.Submissions)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
            return ApiResponse<StudentDto>.Fail("Talaba topilmadi", 404);

        var dto = new StudentDto
        {
            Id = student.Id,
            FullName = student.FullName,
            Email = student.Email,
            GroupNumber = student.GroupNumber,
            SubmissionsCount = student.Submissions.Count(sub => !sub.IsDeleted),
            CreatedAt = student.CreatedAt
        };

        return ApiResponse<StudentDto>.Ok(dto);
    }

    public async Task<ApiResponse<StudentDto>> RegisterAsync(CreateStudentDto dto)
    {
        var existing = await _studentRepository.GetAll()
            .FirstOrDefaultAsync(s => s.Email.ToLower() == dto.Email.ToLower());

        if (existing != null)
        {
            return ApiResponse<StudentDto>.Ok(new StudentDto
            {
                Id = existing.Id,
                FullName = existing.FullName,
                Email = existing.Email,
                GroupNumber = existing.GroupNumber,
                CreatedAt = existing.CreatedAt
            }, "Mavjud talaba profilingizga kirildi");
        }

        var student = new Student
        {
            FullName = dto.FullName,
            Email = dto.Email,
            GroupNumber = dto.GroupNumber
        };

        await _studentRepository.AddAsync(student);
        await _studentRepository.SaveChangesAsync();

        var result = new StudentDto
        {
            Id = student.Id,
            FullName = student.FullName,
            Email = student.Email,
            GroupNumber = student.GroupNumber,
            SubmissionsCount = 0,
            CreatedAt = student.CreatedAt
        };

        return ApiResponse<StudentDto>.Ok(result, "Talaba muvaffaqiyatli ro'yxatdan o'tdi");
    }
}
