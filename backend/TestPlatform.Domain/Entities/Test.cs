using TestPlatform.Domain.Common;

namespace TestPlatform.Domain.Entities;

public class Test : Auditable
{
    public int SubjectId { get; set; }
    public Subject? Subject { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; } = 30;
    public decimal PassScore { get; set; } = 60.0m;
    public decimal TotalScore { get; set; } = 100.0m;

    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
