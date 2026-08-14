using TestPlatform.Service.Common;
using TestPlatform.Service.DTOs;

namespace TestPlatform.Service.Services;

public interface IAiService
{
    Task<ApiResponse<ExplainAnswerResponseDto>> ExplainAnswerAsync(ExplainAnswerInputDto dto);
    Task<ApiResponse<List<AiGeneratedQuestionDto>>> GenerateTestQuestionsAsync(GenerateTestInputDto dto);
    Task<ApiResponse<AiChatResponseDto>> AskAiAssistantAsync(AiChatInputDto dto);
}

public class AiService : IAiService
{
    public async Task<ApiResponse<ExplainAnswerResponseDto>> ExplainAnswerAsync(ExplainAnswerInputDto dto)
    {
        await Task.Delay(200); // Simulate AI reasoning pipeline

        if (dto.IsCorrect)
        {
            return ApiResponse<ExplainAnswerResponseDto>.Ok(new ExplainAnswerResponseDto
            {
                Explanation = $"Ofarin! Savol: \"{dto.QuestionText}\" bo'yicha tanlagan javobingiz (\"{dto.SelectedOptionText}\") to'liq to'g'ri.",
                Concept = "Siz ushbu mavzu bo'yicha nazariy va amaliy tushunchani to'g'ri egallagansiz.",
                Tip = "Ushbu bilimni mustahkamlash uchun amaliy loyihada qo'llab ko'ring."
            });
        }

        string explanation = $"Siz tanlagan javob: \"{dto.SelectedOptionText}\". Lekin to'g'ri javob: \"{dto.CorrectOptionText}\" edi. ";
        
        string concept = "Asosiy tushuncha: " + dto.QuestionText switch
        {
            var q when q.Contains("Singleton") || q.Contains("Scoped") =>
                "ASP.NET Core DI konteynerida Singleton dastur bo'yicha 1 ta instance, Scoped har bir HTTP request uchun 1 ta instance, Transient esa har bir chaqiruv uchun yangi instance yaratadi.",
            var q when q.Contains("AsNoTracking") =>
                "EF Core AsNoTracking() so'rovi Change Tracker'ni ishga tushirmaydi, natijada faqat o'qish so'rovlari (read-only) uchun xotira sarfi va tezlik 2-3 barobargacha yaxshilanadi.",
            var q when q.Contains("var") =>
                "C# tilida 'var' kalit so'zi o'zgaruvchining turini kompilyatsiya vaqtida (compile-time) aniqlaydi. U dinamik tur emas, o'zgaruvchi turi aniqlangach uni boshqa turga o'zgartirib bo'lmaydi.",
            _ => "To'g'ri javob ushbu mavzuning asosiy standarti va eng optimal amaliyoti (Best Practice) hisoblanadi."
        };

        string tip = "Maslahat: " + dto.QuestionText switch
        {
            var q when q.Contains("Singleton") => "Scoped servicelarni Singleton service ichida inject qilishdan ehtiyot bo'ling (Captive Dependency xatosi)!",
            var q when q.Contains("AsNoTracking") => "Ma'lumotni faqat ekranga chiqarishda har doim AsNoTracking() qo'llang.",
            _ => "Mavzuga oid rasmiy hujjatlarni va amaliy misollarni qayta ko'rib chiqish tavsiya etiladi."
        };

        var response = new ExplainAnswerResponseDto
        {
            Explanation = explanation,
            Concept = concept,
            Tip = tip
        };

        return ApiResponse<ExplainAnswerResponseDto>.Ok(response, "AI tushuntirish tahlili tayyor bo'ldi");
    }

    public async Task<ApiResponse<List<AiGeneratedQuestionDto>>> GenerateTestQuestionsAsync(GenerateTestInputDto dto)
    {
        await Task.Delay(300);

        string topic = string.IsNullOrWhiteSpace(dto.Topic) ? "Dasturlash" : dto.Topic.Trim();
        var questions = new List<AiGeneratedQuestionDto>();

        if (topic.Contains("React", StringComparison.OrdinalIgnoreCase) || topic.Contains("Frontend", StringComparison.OrdinalIgnoreCase))
        {
            questions = new List<AiGeneratedQuestionDto>
            {
                new()
                {
                    Text = "React'da 'useCallback' hook'ining asosiy maqsadi nima?",
                    Points = 25,
                    Options = new()
                    {
                        new() { Text = "Funktsiya qayta yaratilishining oldini olib, me'moriy unumdorlikni oshirish", IsCorrect = true },
                        new() { Text = "Forma ma'lumotlarini bazaga saqlash", IsCorrect = false },
                        new() { Text = "DOM elementlarini to'g'ridan-to'g me'moriy o'chirish", IsCorrect = false },
                        new() { Text = "API ga avtomatik HTTP POST so'rovi yuborish", IsCorrect = false }
                    }
                },
                new()
                {
                    Text = "React State o'zgarganda komponentda nima sodir bo'ladi?",
                    Points = 25,
                    Options = new()
                    {
                        new() { Text = "Komponent qayta renderlanadi (Re-render)", IsCorrect = true },
                        new() { Text = "Butun brauzer sahifasi qayta yuklanadi (Page Refresh)", IsCorrect = false },
                        new() { Text = "Barcha local storage ma'lumotlari o'chib ketadi", IsCorrect = false },
                        new() { Text = "State avtomatik ravishda o'zining avvalgi qiymatiga qaytadi", IsCorrect = false }
                    }
                },
                new()
                {
                    Text = "Virtual DOM ning an'anaviy Real DOM ga nisbatan afzalligi nimada?",
                    Points = 25,
                    Options = new()
                    {
                        new() { Text = "Faqat o'zgargan qismlarni Diffing algoritmi orqali minimum darajada o'zgartiradi", IsCorrect = true },
                        new() { Text = "Ma'lumotlar bazasiga to'g'ridan-to'g'ri ulanadi", IsCorrect = false },
                        new() { Text = "Faqat CSS stillarini tezroq yuklaydi", IsCorrect = false },
                        new() { Text = "JavaScript fayllarini avtomatik kompress qiladi", IsCorrect = false }
                    }
                }
            };
        }
        else if (topic.Contains("SQL", StringComparison.OrdinalIgnoreCase) || topic.Contains("PostgreSQL", StringComparison.OrdinalIgnoreCase) || topic.Contains("Database", StringComparison.OrdinalIgnoreCase))
        {
            questions = new List<AiGeneratedQuestionDto>
            {
                new()
                {
                    Text = "SQL'da 'INNER JOIN' va 'LEFT JOIN' o'rtasidagi asosiy farq nima?",
                    Points = 25,
                    Options = new()
                    {
                        new() { Text = "LEFT JOIN chap jadvaldagi barcha qatorlarni mos kelishidan qat'i nazar qaytaradi", IsCorrect = true },
                        new() { Text = "INNER JOIN faqat o'ng jadvaldagi ma'lumotlarni qaytaradi", IsCorrect = false },
                        new() { Text = "Ikkala JOIN bir xil ishlaydi, hech qanday farqi yo'q", IsCorrect = false },
                        new() { Text = "LEFT JOIN faqat indekslangan ustunlar uchun ishlaydi", IsCorrect = false }
                    }
                },
                new()
                {
                    Text = "Bazada Index (Indeks) yaratishning asosiy foydasi va kamchiligi nima?",
                    Points = 25,
                    Options = new()
                    {
                        new() { Text = "SELECT so'rovlarini tezlashtiradi, lekin INSERT/UPDATE operatsiyalarini biroz sekinlashtirishi mumkin", IsCorrect = true },
                        new() { Text = "Baza hajmini 10 barobarga kichraytiradi", IsCorrect = false },
                        new() { Text = "Parollarni avtomatik shifrlaydi", IsCorrect = false },
                        new() { Text = "Jadvallar orasidagi Foreign Key bog'liqligini o'chiradi", IsCorrect = false }
                    }
                }
            };
        }
        else
        {
            // Generic C# / Architecture Questions Generated by AI
            questions = new List<AiGeneratedQuestionDto>
            {
                new()
                {
                    Text = $"[{topic}] bo'yicha: Kodni toza va decoupled (ajratilgan) uslubda yozish uchun qaysi tamoyil ishlatiladi?",
                    Points = 25,
                    Options = new()
                    {
                        new() { Text = "SOLID tamoyillari va Dependency Inversion", IsCorrect = true },
                        new() { Text = "Barcha kodni bitta katta faylga yozish", IsCorrect = false },
                        new() { Text = "Har bir metodda static o'zgaruvchilardan foydalanish", IsCorrect = false },
                        new() { Text = "Exception'larni silent try-catch bilan yutib yuborish", IsCorrect = false }
                    }
                },
                new()
                {
                    Text = $"[{topic}] bo'yicha: Async/Await (Asinxron dasturlash) qaysi turdagi operatsiyalarda eng samarali?",
                    Points = 25,
                    Options = new()
                    {
                        new() { Text = "I/O bound operatsiyalar (Fayl o'qish, Network API, DB so'rovlari)", IsCorrect = true },
                        new() { Text = "Faqat 2 ta sonni qo'shish kabi arifmetik amallarda", IsCorrect = false },
                        new() { Text = "Faqat HTML fayllarni render qilishda", IsCorrect = false },
                        new() { Text = "Hech qachon asinxron kod ishlatish tavsiya etilmaydi", IsCorrect = false }
                    }
                },
                new()
                {
                    Text = $"[{topic}] bo'yicha: Monolit va Microservice arxitekturasining asosiy farqi nimada?",
                    Points = 25,
                    Options = new()
                    {
                        new() { Text = "Monolit bitta yaxlit kod bazasi bo me'morchiligi, Microservice esa mustaqil kichik servislar to'plami", IsCorrect = true },
                        new() { Text = "Microservice faqat mobil ilovalar uchun ishlatiladi", IsCorrect = false },
                        new() { Text = "Monolit ma'lumotlar bazasidan foydalanmaydi", IsCorrect = false },
                        new() { Text = "Ikkala arxitektura tamoyili ham faqat frontend uchun tegishli", IsCorrect = false }
                    }
                }
            };
        }

        return ApiResponse<List<AiGeneratedQuestionDto>>.Ok(questions, $"\"{topic}\" bo'yicha AI test savollari muvaffaqiyatli yaratildi");
    }

    public async Task<ApiResponse<AiChatResponseDto>> AskAiAssistantAsync(AiChatInputDto dto)
    {
        await Task.Delay(250);

        string prompt = dto.Prompt.ToLower().Trim();
        string answer;
        string suggestion;

        if (prompt.Contains("salom") || prompt.Contains("assalomu alaykum"))
        {
            answer = "Assalomu alaykum! Men Test Platformaning AI O'quv Assistentiman 🤖. Bugun qaysi fan yoki test bo'yicha savolingiz bor?";
            suggestion = "Savollaringizni bemalol berishingiz mumkin: masalan, C#, React, PostgreSQL yoki imtihon taktikasi bo'yicha!";
        }
        else if (prompt.Contains("c#") || prompt.Contains(".net") || prompt.Contains("dotnet"))
        {
            answer = "C# va .NET Core bo'yicha asosiy maslahatim: LINQ so'rovlari, EF Core optimallashtirish va Dependency Injection tamoyillarini chuqur o'rganing. Imtihonda ushbu mavzulardan ko'p savollar tushadi!";
            suggestion = "Masalan: 'DbContext Lifetime turlari haqida aytib ber' deb so'rang.";
        }
        else if (prompt.Contains("sertifikat") || prompt.Contains("ball") || prompt.Contains("baho"))
        {
            answer = "Imtihonda 60 ball va undan yuqori to'plagan barcha o'quvchilar **Rasmiy 3D Sertifikat** va CEFR darajasi (B2, C1, C2) bilan taqdirlanadi! Sertifikatni chop etishingiz ham mumkin.";
            suggestion = "Test sahifasiga o'tib bilimingizni sinab ko'ring!";
        }
        else if (prompt.Contains("anti-cheat") || prompt.Contains("ko'chirish") || prompt.Contains("vaqt"))
        {
            answer = "Tizimimizda **Anti-Cheat Monitoring** mavjud! Imtihon paytida brauzer tabini o'zgartirsangiz 3 marta ogohlantirish beriladi, 3-ogohlantirishda test avtomatik topshiriladi.";
            suggestion = "Imtihon topshirayotganda diqqatingizni faqat testga qarating!";
        }
        else
        {
            answer = $"\"{dto.Prompt}\" bo'yicha savolingiz qiziqarli! Dasturlash va bilim olishda doimiy amaliyot eng muhim omildir. Testlarni yechib, AI Tushuntirishi tugmasidan foydalanib xatolaringiz ustida ishlang.";
            suggestion = "Ustoz paneli orqali yangi testlar va savollar qo'shishingiz ham mumkin!";
        }

        return ApiResponse<AiChatResponseDto>.Ok(new AiChatResponseDto
        {
            Answer = answer,
            Suggestion = suggestion
        });
    }
}
