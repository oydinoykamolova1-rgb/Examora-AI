using Microsoft.EntityFrameworkCore;
using TestPlatform.Data.DbContexts;
using TestPlatform.Domain.Entities;

namespace TestPlatform.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        // Seed Default Teacher and Student Users if none exist
        if (!await context.Users.AnyAsync())
        {
            var defaultTeacher = new User
            {
                FullName = "Kamolova Oydinoy (Ustoz)",
                Email = "teacher@testplatform.uz",
                PasswordHash = HashPassword("123456"),
                Role = "Ustoz",
                GroupNumber = "Kafedra"
            };

            var defaultStudent = new User
            {
                FullName = "Ali Valiyev",
                Email = "student@testplatform.uz",
                PasswordHash = HashPassword("123456"),
                Role = "O'quvchi",
                GroupNumber = "FN-2026",
                IsPresent = true,
                TeacherGradeNote = "A'lochilar ro'yxatida"
            };

            await context.Users.AddRangeAsync(defaultTeacher, defaultStudent);
            await context.SaveChangesAsync();
        }

        if (await context.Subjects.AnyAsync())
        {
            return; // Subjects already seeded
        }

        // Seed Sample Subjects
        var dotnetSubject = new Subject
        {
            Name = "C# & .NET Core Ecosystem",
            Description = "ASP.NET Core Web API, EF Core, Dependency Injection va Monolit Arxitektura asoslari",
            Icon = "Code"
        };

        var dbSubject = new Subject
        {
            Name = "PostgreSQL & Database Design",
            Description = "Relatsion ma'lumotlar bazasi, SQL so'rovlar va Indekslash",
            Icon = "Database"
        };

        var algoSubject = new Subject
        {
            Name = "Ma'lumotlar Tuzilmalari va Algoritmlar",
            Description = "Algoritmik fikrlash, O(N) murakkablik va optimizatsiya",
            Icon = "Cpu"
        };

        await context.Subjects.AddRangeAsync(dotnetSubject, dbSubject, algoSubject);
        await context.SaveChangesAsync();

        // Seed Test 1: C# .NET Fundamentals
        var test1 = new Test
        {
            SubjectId = dotnetSubject.Id,
            Title = "ASP.NET Core & EF Core Asoslari",
            Description = "C# Web API va EF Core repository tamoyillari bo'yicha 100 ballik test",
            DurationMinutes = 20,
            PassScore = 60.0m,
            TotalScore = 100.0m
        };

        // Seed Test 2: Database Design & SQL
        var test2 = new Test
        {
            SubjectId = dbSubject.Id,
            Title = "PostgreSQL & Relatsion SQL So'rovlar",
            Description = "SQL Joins, Indekslash va Baza Optimizatsiyasi bo'yicha imtihon testi",
            DurationMinutes = 25,
            PassScore = 60.0m,
            TotalScore = 100.0m
        };

        // Seed Test 3: Algorithms & Data Structures
        var test3 = new Test
        {
            SubjectId = algoSubject.Id,
            Title = "Algoritmik Murakkablik va Ma'lumotlar Tuzilmasi",
            Description = "Big-O tahlili, Hash-Jadvallar va Dasturlash algoritmlari sinovi",
            DurationMinutes = 30,
            PassScore = 60.0m,
            TotalScore = 100.0m
        };

        await context.Tests.AddRangeAsync(test1, test2, test3);
        await context.SaveChangesAsync();

        // Seed Questions & Options for Test 1 (C# .NET)
        var q1 = new Question
        {
            TestId = test1.Id,
            Text = "ASP.NET Core'da Singleton va Scoped service'lar orasidagi asosiy farq nima?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "Singleton har bir HTTP so'rov uchun yangi yaratiladi", IsCorrect = false },
                new Option { Text = "Scoped faqat bitta HTTP so'rov scope'ida bitta nusxada mavjud bo'ladi", IsCorrect = true },
                new Option { Text = "Transient faqat dastur yopilganda o'chiriladi", IsCorrect = false },
                new Option { Text = "Ular orasida hech qanday farq yo'q", IsCorrect = false }
            }
        };

        var q2 = new Question
        {
            TestId = test1.Id,
            Text = "EF Core'da 'AsNoTracking()' metodi nega ishlatiladi?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "Faqat o'qish (read-only) so'rovlarida xotira va unumdorlikni oshirish uchun", IsCorrect = true },
                new Option { Text = "Ma'lumotlar bazasiga o'zgartirishlarni darhol saqlash uchun", IsCorrect = false },
                new Option { Text = "Jadvaldagi barcha ma'lumotlarni o'chirib tashlash uchun", IsCorrect = false },
                new Option { Text = "Tranzaksiyani bekor qilish uchun", IsCorrect = false }
            }
        };

        var q3 = new Question
        {
            TestId = test1.Id,
            Text = "Nega Student DTO ob'ektida 'IsCorrect' maydoni bo'lmasligi kerak?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "Dastur hajmini kichraytirish uchun", IsCorrect = false },
                new Option { Text = "Talaba DevTools orqali to'g'ri javobni ko'rib olmasligi (alday olmasligi) uchun", IsCorrect = true },
                new Option { Text = "C# tilingiz xatoga yo'l qo'ymasligi uchun", IsCorrect = false },
                new Option { Text = "EF Core buni qo'llab-quvvatlamagani uchun", IsCorrect = false }
            }
        };

        var q4 = new Question
        {
            TestId = test1.Id,
            Text = "DbContext ob'ektining xizmat ko'rsatish davri (lifetime) odatda qanday belgilanishi tavsiya etiladi?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "Singleton", IsCorrect = false },
                new Option { Text = "Transient", IsCorrect = false },
                new Option { Text = "Scoped", IsCorrect = true },
                new Option { Text = "Static", IsCorrect = false }
            }
        };

        // Seed Questions & Options for Test 2 (PostgreSQL)
        var q2_1 = new Question
        {
            TestId = test2.Id,
            Text = "SQL so'rovida 'INNER JOIN' va 'LEFT JOIN' ning asosiy farqi nima?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "LEFT JOIN chap jadvaldagi barcha qatorlarni moslik bo'lmasa ham qaytaradi", IsCorrect = true },
                new Option { Text = "INNER JOIN faqat chap jadvalni o'qiydi", IsCorrect = false },
                new Option { Text = "Hech qanday farq yo'q", IsCorrect = false },
                new Option { Text = "LEFT JOIN faqat indeksli ustunlar uchun ishlaydi", IsCorrect = false }
            }
        };

        var q2_2 = new Question
        {
            TestId = test2.Id,
            Text = "Bazada B-Tree Indeks (Index) yaratishning asosiy foydasi nima?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "SELECT qidiruv so'rovlarini bir necha barobarga tezlashtiradi", IsCorrect = true },
                new Option { Text = "Ma'lumotlar hajmini 5 barobarga qisqartiradi", IsCorrect = false },
                new Option { Text = "Parollarni shifrlaydi", IsCorrect = false },
                new Option { Text = "INSERT operatsiyalarini tezlashtiradi", IsCorrect = false }
            }
        };

        var q2_3 = new Question
        {
            TestId = test2.Id,
            Text = "Tranzaksiyaning ACID tamoyilidagi 'Atomicity' (Atomlik) nimani anglatadi?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "Tranzaksiyadagi barcha amallar ya to'liq bajariladi, ya umuman bajarilmaydi (Rollback)", IsCorrect = true },
                new Option { Text = "Baza faqat bitta foydalanuvchiga xizmat ko'rsatadi", IsCorrect = false },
                new Option { Text = "Ma'lumotlar faqat matn ko'rinishida saqlanadi", IsCorrect = false },
                new Option { Text = "Faqat bir martalik kalit so'z ishlatiladi", IsCorrect = false }
            }
        };

        var q2_4 = new Question
        {
            TestId = test2.Id,
            Text = "Relatsion ma'lumotlar bazasida 3NF (Uchinchi Normal Forma) ning maqsadi nima?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "Ma'lumotlar takrorlanishini (redundancy) va tranzitiv bog'liqlikni yo'qotish", IsCorrect = true },
                new Option { Text = "Jadval ustunlari sonini ko'paytirish", IsCorrect = false },
                new Option { Text = "So'rov vaqtini oshirish", IsCorrect = false },
                new Option { Text = "Faqat string turlarini saqlash", IsCorrect = false }
            }
        };

        // Seed Questions & Options for Test 3 (Algorithms)
        var q3_1 = new Question
        {
            TestId = test3.Id,
            Text = "Binary Search (Ikkilik qidiruv) algoritmining vaqt murakkabligi (Time Complexity) qancha?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "O(N)", IsCorrect = false },
                new Option { Text = "O(log N)", IsCorrect = true },
                new Option { Text = "O(N^2)", IsCorrect = false },
                new Option { Text = "O(1)", IsCorrect = false }
            }
        };

        var q3_2 = new Question
        {
            TestId = test3.Id,
            Text = "Hash Table (Xash-Jadval) ma'lumotlar tuzilmasida elementni izlashning o'rtacha vaqt murakkabligi nimaga teng?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "O(1)", IsCorrect = true },
                new Option { Text = "O(N)", IsCorrect = false },
                new Option { Text = "O(N log N)", IsCorrect = false },
                new Option { Text = "O(2^N)", IsCorrect = false }
            }
        };

        var q3_3 = new Question
        {
            TestId = test3.Id,
            Text = "Stack (Stek) tuzilmasi qaysi prinsip asosida ishlaydi?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "FIFO (First In First Out)", IsCorrect = false },
                new Option { Text = "LIFO (Last In First Out)", IsCorrect = true },
                new Option { Text = "Random Access", IsCorrect = false },
                new Option { Text = "Round Robin", IsCorrect = false }
            }
        };

        var q3_4 = new Question
        {
            TestId = test3.Id,
            Text = "Quick Sort algoritmining eng yomon holatdagi (Worst-case) vaqt murakkabligi qanday?",
            Points = 25.0m,
            Options = new List<Option>
            {
                new Option { Text = "O(N log N)", IsCorrect = false },
                new Option { Text = "O(N^2)", IsCorrect = true },
                new Option { Text = "O(1)", IsCorrect = false },
                new Option { Text = "O(N!)", IsCorrect = false }
            }
        };

        await context.Questions.AddRangeAsync(
            q1, q2, q3, q4,
            q2_1, q2_2, q2_3, q2_4,
            q3_1, q3_2, q3_3, q3_4
        );

        // Seed Sample Student
        var sampleStudent = new Student
        {
            FullName = "Ali Valiyev",
            Email = "student@testplatform.uz",
            GroupNumber = "FN-2026"
        };
        await context.Students.AddAsync(sampleStudent);

        await context.SaveChangesAsync();
    }

    public static string HashPassword(string password)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}
