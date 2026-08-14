using Microsoft.EntityFrameworkCore;
using TestPlatform.Domain.Entities;

namespace TestPlatform.Data.DbContexts;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Test> Tests => Set<Test>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Option> Options => Set<Option>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<StudentAnswer> StudentAnswers => Set<StudentAnswer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global Query Filter for Soft Delete
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Subject>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Test>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Question>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Option>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Student>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Submission>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<StudentAnswer>().HasQueryFilter(e => !e.IsDeleted);

        // Decimal Precision
        modelBuilder.Entity<Test>().Property(t => t.PassScore).HasPrecision(18, 2);
        modelBuilder.Entity<Test>().Property(t => t.TotalScore).HasPrecision(18, 2);
        modelBuilder.Entity<Question>().Property(q => q.Points).HasPrecision(18, 2);
        modelBuilder.Entity<Submission>().Property(s => s.Score).HasPrecision(18, 2);
        modelBuilder.Entity<Submission>().Property(s => s.TotalPossibleScore).HasPrecision(18, 2);

        // Relationships
        modelBuilder.Entity<Test>()
            .HasOne(t => t.Subject)
            .WithMany(s => s.Tests)
            .HasForeignKey(t => t.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Question>()
            .HasOne(q => q.Test)
            .WithMany(t => t.Questions)
            .HasForeignKey(q => q.TestId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Option>()
            .HasOne(o => o.Question)
            .WithMany(q => q.Options)
            .HasForeignKey(o => o.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Submission>()
            .HasOne(s => s.Student)
            .WithMany(st => st.Submissions)
            .HasForeignKey(s => s.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Submission>()
            .HasOne(s => s.Test)
            .WithMany(t => t.Submissions)
            .HasForeignKey(s => s.TestId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<StudentAnswer>()
            .HasOne(sa => sa.Submission)
            .WithMany(s => s.StudentAnswers)
            .HasForeignKey(sa => sa.SubmissionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
