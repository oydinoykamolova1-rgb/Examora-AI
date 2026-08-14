using TestPlatform.Domain.Common;

namespace TestPlatform.Domain.Entities;

public class Option : Auditable
{
    public int QuestionId { get; set; }
    public Question? Question { get; set; }

    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; } = false;
}
