namespace TestPlatform.Service.DTOs;

public class SubjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "BookOpen";
    public int TestCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateSubjectDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "BookOpen";
}
