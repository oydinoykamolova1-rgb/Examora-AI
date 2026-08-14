namespace TestPlatform.Service.DTOs;

public class ExplainAnswerInputDto
{
    public string QuestionText { get; set; } = string.Empty;
    public string SelectedOptionText { get; set; } = string.Empty;
    public string CorrectOptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

public class ExplainAnswerResponseDto
{
    public string Explanation { get; set; } = string.Empty;
    public string Concept { get; set; } = string.Empty;
    public string Tip { get; set; } = string.Empty;
}

public class GenerateTestInputDto
{
    public string Topic { get; set; } = string.Empty;
    public int QuestionCount { get; set; } = 3;
}

public class AiGeneratedQuestionDto
{
    public string Text { get; set; } = string.Empty;
    public decimal Points { get; set; } = 25;
    public List<AiGeneratedOptionDto> Options { get; set; } = new();
}

public class AiGeneratedOptionDto
{
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

public class AiChatInputDto
{
    public string Prompt { get; set; } = string.Empty;
    public string? Role { get; set; }
}

public class AiChatResponseDto
{
    public string Answer { get; set; } = string.Empty;
    public string Suggestion { get; set; } = string.Empty;
}
