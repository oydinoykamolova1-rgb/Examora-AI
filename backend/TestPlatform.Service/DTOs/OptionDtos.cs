namespace TestPlatform.Service.DTOs;

// Admin View: Includes IsCorrect for creating and managing test keys
public class OptionDto
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

// Student View: STRICTLY EXCLUDES IsCorrect for security and prevention of client-side inspection/cheating
public class StudentOptionDto
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string Text { get; set; } = string.Empty;
    // NOTE: IsCorrect is intentionally missing!
}

public class CreateOptionDto
{
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}
