namespace TestPlatform.Service.DTOs;

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "O'quvchi"; // "Ustoz" or "O'quvchi"
    public string GroupNumber { get; set; } = string.Empty;
}

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "O'quvchi";
    public string GroupNumber { get; set; } = string.Empty;
    public bool IsPresent { get; set; }
    public string TeacherGradeNote { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}

public class UpdateUserStatusDto
{
    public int UserId { get; set; }
    public bool IsPresent { get; set; }
    public string TeacherGradeNote { get; set; } = string.Empty;
}
