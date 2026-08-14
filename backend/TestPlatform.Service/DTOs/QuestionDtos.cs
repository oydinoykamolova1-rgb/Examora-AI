namespace TestPlatform.Service.DTOs;

public class QuestionDto
{
    public int Id { get; set; }
    public int TestId { get; set; }
    public string Text { get; set; } = string.Empty;
    public decimal Points { get; set; }
    public List<OptionDto> Options { get; set; } = new();
}

public class StudentQuestionDto
{
    public int Id { get; set; }
    public int TestId { get; set; }
    public string Text { get; set; } = string.Empty;
    public decimal Points { get; set; }
    public List<StudentOptionDto> Options { get; set; } = new();
}

public class CreateQuestionDto
{
    public string Text { get; set; } = string.Empty;
    public decimal Points { get; set; } = 10.0m;
    public List<CreateOptionDto> Options { get; set; } = new();
}
