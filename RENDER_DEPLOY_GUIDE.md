# 🚀 Examora AI — Render.com Deploy qilish Yo'riqnomasi

Ushbu qo'llanma orqali siz **Examora AI** platformangizni (Backend va Frontend) **Render.com** bepul bulutli serveriga muvaffaqiyatli yuklaysiz.

---

## 1-Usul: Blueprint (`render.yaml`) Orqali 1-Click Deploy (Eng Oson Yo'l) 🌟

1. **Kodingizni GitHub ga joylang**:
   - `d:\test pltf` papkasini GitHub reponizga push qiling (`git add .`, `git commit -m "Render ready"`, `git push`).
2. **Render.com ga kiring**:
   - [https://dashboard.render.com](https://dashboard.render.com) ga kiring va GitHub akkauntingiz bilan kiring.
3. **New Blueprint Instance tugmasini bosing**:
   - Dashboard'da **New +** -> **Blueprint**-ni tanlang.
   - GitHub reponizni tanlang.
   - Render avtomatik ravishda `render.yaml` faylini o'qiydi va **Backend Web Service** hamda **Frontend Static Site**ni sozlaydi!
4. **Apply bosing**:
   - 2-3 daqiqada platformangiz live bo'ladi.

---

## 2-Usul: Qo'lda (Manual) Dashboard Orqali Deploy Qilish

### 🅰️ Backend (ASP.NET Core Web API):
1. Dashboard -> **New +** -> **Web Service** ni tanlang.
2. Repository'ingizni ulang.
3. Sozlamalar:
   - **Name**: `examora-ai-backend`
   - **Region**: Singapore
   - **Language / Environment**: `Docker`
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `Dockerfile`
4. **Environment Variables**:
   - `ASPNETCORE_ENVIRONMENT`: `Production`
   - `DatabaseProvider`: `SQLite`
5. **Create Web Service** tugmasini bosing. Render taqdim etgan URL'ni saqlab oling (masalan: `https://examora-ai-backend.onrender.com`).

---

### 🅱️ Frontend (React Vite):
1. Dashboard -> **New +** -> **Static Site** ni tanlang.
2. Repository'ingizni ulang.
3. Sozlamalar:
   - **Name**: `examora-ai-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://examora-ai-backend.onrender.com/api` *(O'zingizning backend URL manzilingiz)*
5. **Redirects/Rewrites**:
   - `/*` -> `/index.html` (Rewrite status 200)
6. **Create Static Site** tugmasini bosing!

---

## ✅ Tayyor!
Frontend domeningiz ochiladi (masalan: `https://examora-ai-frontend.onrender.com`) va u Backend API bilan avtomatik bog'lanadi.
