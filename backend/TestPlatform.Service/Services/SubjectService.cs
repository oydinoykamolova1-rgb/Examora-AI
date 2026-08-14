using Microsoft.EntityFrameworkCore;
using TestPlatform.Data.Repositories;
using TestPlatform.Domain.Entities;
using TestPlatform.Service.Common;
using TestPlatform.Service.DTOs;

namespace TestPlatform.Service.Services;

public interface ISubjectService
{
    Task<ApiResponse<List<SubjectDto>>> GetAllAsync();
    Task<ApiResponse<SubjectDto>> GetByIdAsync(int id);
    Task<ApiResponse<SubjectDto>> CreateAsync(CreateSubjectDto dto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}

public class SubjectService : ISubjectService
{
    private readonly IRepository<Subject> _subjectRepository;

    public SubjectService(IRepository<Subject> subjectRepository)
    {
        _subjectRepository = subjectRepository;
    }

    public async Task<ApiResponse<List<SubjectDto>>> GetAllAsync()
    {
        var subjects = await _subjectRepository.GetAll()
            .Include(s => s.Tests)
            .Select(s => new SubjectDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Icon = s.Icon,
                TestCount = s.Tests.Count(t => !t.IsDeleted),
                CreatedAt = s.CreatedAt
            })
            .ToListAsync();

        return ApiResponse<List<SubjectDto>>.Ok(subjects);
    }

    public async Task<ApiResponse<SubjectDto>> GetByIdAsync(int id)
    {
        var subject = await _subjectRepository.GetAll()
            .Include(s => s.Tests)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (subject == null)
            return ApiResponse<SubjectDto>.Fail("Fan topilmadi", 404);

        var dto = new SubjectDto
        {
            Id = subject.Id,
            Name = subject.Name,
            Description = subject.Description,
            Icon = subject.Icon,
            TestCount = subject.Tests.Count(t => !t.IsDeleted),
            CreatedAt = subject.CreatedAt
        };

        return ApiResponse<SubjectDto>.Ok(dto);
    }

    public async Task<ApiResponse<SubjectDto>> CreateAsync(CreateSubjectDto dto)
    {
        var subject = new Subject
        {
            Name = dto.Name,
            Description = dto.Description,
            Icon = string.IsNullOrWhiteSpace(dto.Icon) ? "BookOpen" : dto.Icon
        };

        await _subjectRepository.AddAsync(subject);
        await _subjectRepository.SaveChangesAsync();

        var result = new SubjectDto
        {
            Id = subject.Id,
            Name = subject.Name,
            Description = subject.Description,
            Icon = subject.Icon,
            TestCount = 0,
            CreatedAt = subject.CreatedAt
        };

        return ApiResponse<SubjectDto>.Ok(result, "Fan muvaffaqiyatli yaratildi");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var subject = await _subjectRepository.GetByIdAsync(id);
        if (subject == null)
            return ApiResponse<bool>.Fail("Fan topilmadi", 404);

        _subjectRepository.Delete(subject);
        await _subjectRepository.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Fan o'chirildi");
    }
}
