# AI Essay Preparedness Grader - Quick Start Guide

## 🚀 Memulai dengan Cepat

### **1. Start Development Server**

```bash
npm run dev
```

Buka http://localhost:3000 di browser Anda.

### **2. Test Flow**

#### **Dengan Akun Demo:**

1. Klik tombol "Mulai Gratis" atau langsung ke http://localhost:3000/auth
2. Di halaman login, klik "Gunakan akun demo"
3. Email dan password akan terisi otomatis: `demo@prodiplan.id` / `demo123`
4. Klik "Masuk"

#### **Dengan Akun Baru:**

1. Di halaman login, klik tab "Daftar"
2. Isi form registrasi dengan data Anda
3. Klik "Daftar Sekarang"

### **3. Setelah Login**

✅ Anda akan otomatis diarahkan ke `/dashboard` (halaman landing)

**Di dashboard:**

- 👋 Greeting dengan nama Anda
- 📘 Informasi tentang test
- 🎯 Tombol besar "Mulai Test Sekarang"

### **4. Mulai Test**

1. Klik tombol "Mulai Test Sekarang"
2. Baca instruksi di halaman intro
3. Klik "Mulai Test Sekarang" untuk memulai
4. Jawab 5 pertanyaan essay (waktu: 15 menit)
5. Klik "Selesai & Analisis" setelah selesai
6. Tunggu halaman loading (2 detik simulasi)
7. Lihat hasil analisis di halaman result

## 📍 Halaman-Halaman Utama

| Halaman        | URL                    | Deskripsi                  |
| -------------- | ---------------------- | -------------------------- |
| Homepage       | `/`                    | Landing page utama         |
| Login/Register | `/auth`                | Halaman autentikasi        |
| Dashboard      | `/dashboard`           | Landing page setelah login |
| Essay Grader   | `/essay-grader`        | Halaman test essay         |
| Result         | `/essay-grader/result` | Halaman hasil analisis     |

## 🔑 Fitur Utama

### **Dashboard**

- ✨ Greeting personalisasi dengan nama user
- 📊 Statistik dan informasi tentang platform
- 🎯 Tombol CTA untuk mulai test
- 📚 Penjelasan cara kerja platform

### **Essay Grader Test**

- ⏱️ Timer 15 menit dengan countdown
- 📝 5 pertanyaan essay yang mendalam
- 💡 Tips untuk setiap pertanyaan
- 🔄 Navigasi back/next antar pertanyaan
- 📊 Progress bar dan question indicators
- 💾 Auto-save jawaban

### **Result Page**

- 🎯 Overall score (0-100)
- 📈 Readiness level (Siap/Cukup Siap/Perlu Persiapan)
- ✅ Kekuatan (4 poin)
- ⚠️ Area untuk ditingkatkan (3 poin)
- 💡 Rekomendasi aksi terstruktur (5 poin)
- 📥 Download laporan

## 🎨 UI/UX Highlights

- ✨ Smooth animations dengan Framer Motion
- 🎭 Gradient backgrounds dan color schemes
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible buttons dan forms
- 🌙 Light theme dengan gradients
- 🚀 Fast loading dengan optimized components

## 🔐 Authentication

### **Flow:**

```
Belum Login → /auth page
    ↓
Login/Register
    ↓
Token saved → Redirect ke /dashboard
    ↓
Protected routes accessible
```

### **Demo Credentials:**

```
Email: demo@prodiplan.id
Password: demo123
```

## 📋 Struktur Pertanyaan Essay

Setiap pertanyaan dirancang untuk menggali:

1. **Motivasi & Minat** - Mengapa memilih jurusan ini?
2. **Self-Assessment** - Kekuatan & kelemahan
3. **Preparedness** - Langkah persiapan konkret
4. **Realistic Expectations** - Ekspektasi realistis
5. **Career Planning** - Visi jangka panjang

## 🛠️ Developer Notes

### **File Struktur:**

```
src/app/
├── dashboard/
│   └── page.tsx          # Dashboard landing page
├── essay-grader/
│   ├── page.tsx          # Essay grader main page
│   └── result/
│       └── page.tsx      # Result page
├── auth/
│   └── page.tsx          # Auth page (existing)
├── page.tsx              # Homepage
├── layout.tsx            # Root layout
├── providers.tsx         # Root providers
└── globals.css           # Global styles

src/
├── middleware.ts         # Route protection
└── components/
    ├── providers/
    │   └── auth-provider.tsx
    └── ...
```

### **Key Technologies:**

- Next.js 16 (Turbopack)
- React 19 RC
- Framer Motion
- TailwindCSS
- TypeScript
- React Hook Form (for existing forms)

### **Protected Routes:**

- `/dashboard/*` - Require authentication
- `/essay-grader/*` - Require authentication
- `/auth` - Redirect ke dashboard jika sudah login

## 🐛 Troubleshooting

### **Port sudah terpakai:**

```bash
# Kill process pada port 3000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess) | Stop-Process -Force

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### **Module not found:**

```bash
npm install
# atau
pnpm install
```

### **Clear cache:**

```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📞 Support

Jika menemukan masalah atau bug, silakan hubungi tim development.

---

**Happy Coding!** 🚀
