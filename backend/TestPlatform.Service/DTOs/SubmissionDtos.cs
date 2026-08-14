namespace TestPlatform.Service.DTOs;

public class StartTestInputDto
{
    public int StudentId { get; set; }
    public int TestId { get; set; }
}

public class StudentAnswerInputDto
{
    public int QuestionId { get; set; }
    public int SelectedOptionId { get; set; }
}

public class SubmitTestInputDto
{
    public int SubmissionId { get; set; }
    public List<StudentAnswerInputDto> Answers { get; set; } = new();
}

public class DetailedAnswerDto
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public decimal Points { get; set; }
    public int SelectedOptionId { get; set; }
    public string SelectedOptionText { get; set; } = string.Empty;
    public int CorrectOptionId { get; set; }
    public string CorrectOptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

public class SubmissionResultDto
{
    public int SubmissionId { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public int TestId { get; set; }
    public string TestTitle { get; set; } = string.Empty;
    public decimal Score { get; set; }
    public decimal TotalPossibleScore { get; set; }
    public decimal Percentage { get; set; }
    public decimal AccuracyPercentage { get; set; }
    public string KnowledgeLevel { get; set; } = "Boshlang'ich";
    public decimal PassScore { get; set; }
    public bool IsPassed { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int TimeTakenSeconds { get; set; }
    public double TimeTakenMinutes { get; set; }
    public List<DetailedAnswerDto> DetailedAnswers { get; set; } = new();
}
