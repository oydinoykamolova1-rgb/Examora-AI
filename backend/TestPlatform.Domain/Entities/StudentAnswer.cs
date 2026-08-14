using TestPlatform.Domain.Common;

namespace TestPlatform.Domain.Entities;

public class StudentAnswer : Auditable
{
    public int SubmissionId { get; set; }
    public Submission? Submission { get; set; }

    public int QuestionId { get; set; }
    public Question? Question { get; set; }

    public int SelectedOptionId { get; set; }
    public Option? SelectedOption { get; set; }
}
