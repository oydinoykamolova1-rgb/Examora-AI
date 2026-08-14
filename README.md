# 🍃 Examora AI — Smart Exam, Anti-Cheat Proctoring & 3D Certificate Platform

[![NET 10](https://img.shields.io/badge/ASP.NET%20Core-10.0-purple.svg)](https://dotnet.microsoft.com/)
[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Render Deploy](https://img.shields.io/badge/Render-Deploy%20Ready-success.svg)](https://render.com/)

**Examora AI** — ASP.NET Core 10 Monolith Web API va React 19 + TypeScript + Vite + TailwindCSS v4 negizida yaratilgan zamonaviy online imtihon, anti-cheat nazorati hamda 3D metall/shisha sertifikatlash platformasi.

---

## ✨ Asosiy Imkoniyatlar (Features)

- 🔒 **Role-Based Access Control (RBAC)**: Ustoz (Teacher) va O'quvchi (Student) rollari uchun alohida xavfsiz interfeys.
- 🤖 **AI Test Generator**: Ustozlar 1-click orqali istalgan mavzu bo'yicha sun'iy intellekt tomonidan yaratilgan savollar va to'g'ri javob kalitlarini testga qo'sha oladilar.
- 🛡️ **Smart Anti-Cheat Proctoring**: Imtihon vaqtida brauzer tabini o'zgartirishni aniqlovchi 3 bosqichli ogohlantirish va avto-topshirish tizimi.
- 🗺️ **Question Palette Grid**: Imtihonda barcha savollar xaritasi (Ishlangan / Ishlanmagan / Belgilangan) bo'yicha tezkor navigatsiya.
- 📜 **Rasmiy 3D Sertifikat & PDF Eksport**: Imtihondan o'tganlarga `EXAMORA-2026-XXXXXX` unikal ID raqamli 3D metall/shisha sertifikat hamda bosib chiqarish (Print/PDF) imkoniyati.
- 💡 **AI Explanation ("Spek")**: Test yakunida har bir xato yoki to'g'ri javob bo'yicha AI tushuntirishi va maslahati.
- 🤖 **Examora AI Assistant Widget**: Ekran burchagidagi floating intellektual o'quv murabbiyi.
- 📊 **Ustoz Analitikasi**: Natijalar jadvali, o'rtacha ball, o'zlashtirish % va Excel (CSV) yuklab olish.

---

## 🛠️ Texnologik Stak

### Backend:
- **Framework**: C# ASP.NET Core Web API (.NET 10 / .NET 9)
- **Architecture**: Monolith Clean Layered Architecture (`Domain`, `Data`, `Service`, `WebApi`)
- **ORM & DB**: Entity Framework Core (SQLite / PostgreSQL dual database support)
- **Auth & Security**: JWT Bearer Token, Claims-based authorization, Password Hashing
- **Documentation**: OpenAPI & Scalar Interactive API Docs (`/scalar/v1`)

### Frontend:
- **Core**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS v4, Vanilla Glassmorphism CSS
- **Icons & FX**: Lucide React, Canvas Confetti
- **State & i18n**: React Context API, Multi-language support (Uzbek, English, Russian, Spanish, German, French, Turkish)

---

## 🚀 Mahalliydan Ishga Tushirish (Local Setup)

### Backend:
```bash
cd backend
dotnet restore
dotnet run --project TestPlatform.WebApi/TestPlatform.WebApi.csproj
```
*(Backend API va Scalar Hujjatlar: `http://localhost:5000/scalar/v1`)*

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend UI: `http://localhost:3000`)*

---

## ☁️ Render.com ga Deploy Qilish

Loyihada `render.yaml` va `backend/Dockerfile` tayyorlangan. 
Batafsil ma'lumot uchun **[RENDER_DEPLOY_GUIDE.md](RENDER_DEPLOY_GUIDE.md)** faylini ko'ring.

---

## 📝 Dastur Muallifi
**Kamolova Oydinoy** — ASP.NET Core & React Vite Fullstack Developer  
**GitHub Repository**: [https://github.com/oydinoykamolova1-rgb/Examora-AI.git](https://github.com/oydinoykamolova1-rgb/Examora-AI.git)
