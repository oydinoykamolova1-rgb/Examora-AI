using TestPlatform.Domain.Common;

namespace TestPlatform.Domain.Entities;

public class Subject : Auditable
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "BookOpen";

    public ICollection<Test> Tests { get; set; } = new List<Test>();
}
