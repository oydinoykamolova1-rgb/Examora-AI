using TestPlatform.Domain.Common;

namespace TestPlatform.Domain.Entities;

public class Question : Auditable
{
    public int TestId { get; set; }
    public Test? Test { get; set; }

    public string Text { get; set; } = string.Empty;
    public decimal Points { get; set; } = 10.0m;

    public ICollection<Option> Options { get; set; } = new List<Option>();
}
