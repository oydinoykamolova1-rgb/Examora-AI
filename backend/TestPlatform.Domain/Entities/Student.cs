using TestPlatform.Domain.Common;

namespace TestPlatform.Domain.Entities;

public class Student : Auditable
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string GroupNumber { get; set; } = string.Empty;

    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
