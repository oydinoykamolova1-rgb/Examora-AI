using TestPlatform.Domain.Common;

namespace TestPlatform.Domain.Entities;

public class Submission : Auditable
{
    public int StudentId { get; set; }
    public Student? Student { get; set; }

    public int TestId { get; set; }
    public Test? Test { get; set; }

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public decimal Score { get; set; } = 0.0m;
    public decimal TotalPossibleScore { get; set; } = 0.0m;
    public bool IsPassed { get; set; } = false;

    public ICollection<StudentAnswer> StudentAnswers { get; set; } = new List<StudentAnswer>();
}
