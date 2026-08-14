using TestPlatform.Domain.Common;

namespace TestPlatform.Domain.Entities;

public class User : Auditable
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "O'quvchi"; // "Ustoz" or "O'quvchi"
    public string GroupNumber { get; set; } = string.Empty;

    // Ustoz tomonidan baholash va davomat statusi
    public bool IsPresent { get; set; } = true; // Bor / Yo'q
    public string TeacherGradeNote { get; set; } = "Yaxshi"; // Ustoz izohi/bahosi
}
