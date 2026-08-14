namespace TestPlatform.Service.DTOs;

public class TestDto
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal PassScore { get; set; }
    public decimal TotalScore { get; set; }
    public int QuestionCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class StudentTestDetailDto
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal PassScore { get; set; }
    public decimal TotalScore { get; set; }
    public List<StudentQuestionDto> Questions { get; set; } = new();
}

public class CreateTestDto
{
    public int SubjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; } = 30;
    public decimal PassScore { get; set; } = 60.0m;
    public decimal TotalScore { get; set; } = 100.0m;
    public List<CreateQuestionDto> Questions { get; set; } = new();
}
