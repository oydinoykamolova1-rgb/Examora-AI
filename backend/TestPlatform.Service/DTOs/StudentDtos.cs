namespace TestPlatform.Service.DTOs;

public class StudentDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string GroupNumber { get; set; } = string.Empty;
    public int SubmissionsCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateStudentDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string GroupNumber { get; set; } = string.Empty;
}
