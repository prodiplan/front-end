# 🔐 Demo Mode - Login Tanpa Backend

## ✅ Login Sekarang Bisa Digunakan!

Aplikasi sekarang sudah support **demo mode** yang memungkinkan Anda login dan test semua fitur **tanpa perlu backend**.

---

## 🚀 Cara Login

### Opsi 1: Gunakan Akun Demo (Recommended)

```
Email:    demo@prodiplan.id
Password: demo123
```

**Steps:**

1. Buka http://localhost:3000
2. Klik "Mulai Gratis"
3. Masukkan email & password di atas
4. Klik "Masuk"
5. ✅ Berhasil! Akan redirect ke `/dashboard`

---

### Opsi 2: Student Account (Verified)

```
Email:    student@prodiplan.id
Password: student123
```

**Profile:**

- Nama: Budi Santoso
- Asal Sekolah: SMAN 2 Bandung
- Jurusan Pilihan: Teknik Informatika

---

### Opsi 3: Test Account (Kedokteran)

```
Email:    test@prodiplan.id
Password: test123
```

**Profile:**

- Nama: Siti Nur Azizah
- Asal Sekolah: SMAN 3 Surabaya
- Jurusan Pilihan: Kedokteran

---

### Opsi 4: Buat Akun Sendiri (Demo Registration)

```
1. Di halaman login, klik tab "Daftar"
2. Isi form dengan data apapun:
   - Nama Lengkap: (apapun, misal "Saya")
   - Email: (apapun, misal "saya@gmail.com")
   - Password: (minimal 6 karakter)
   - Tanggal Lahir: (apapun)
   - Asal Sekolah: (apapun)
   - Jurusan Pilihan: (apapun)
3. Klik "Daftar Sekarang"
4. ✅ Berhasil! Akan redirect ke `/dashboard`
```

---

## 🎯 Full Flow Test

```
1. ✅ Login dengan demo@prodiplan.id / demo123
2. ✅ Akan redirect ke /dashboard
3. ✅ Lihat greeting "Selamat datang, Demo!"
4. ✅ Klik "Mulai Test Sekarang"
5. ✅ Baca instruksi di intro screen
6. ✅ Klik "Mulai Test Sekarang" lagi
7. ✅ Jawab 5 pertanyaan essay
8. ✅ Timer countdown 15 menit (test dengan menurutkan waktu)
9. ✅ Klik "Selesai & Analisis"
10. ✅ Loading screen akan muncul
11. ✅ Redirect ke /essay-grader/result
12. ✅ Lihat hasil analisis dengan mock data
```

---

## 📱 Demo Data

### User Demo (Sudah Ada)

```
Email:        demo@prodiplan.id
Password:     demo123
Full Name:    Demo User
Birth Date:   2005-01-15
School:       SMAN 1 Jakarta
Major:        Computer Science
Phone:        +62812345678
Email Verify: ✅ Yes
Created:      2024-01-15T10:30:00Z
```

### User Student (Sudah Ada)

```
Email:        student@prodiplan.id
Password:     student123
Full Name:    Budi Santoso
Birth Date:   2006-05-20
School:       SMAN 2 Bandung
Major:        Teknik Informatika
Phone:        +62812345679
Email Verify: ✅ Yes
Created:      2024-01-16T09:15:00Z
```

### User Test (Sudah Ada)

```
Email:        test@prodiplan.id
Password:     test123
Full Name:    Siti Nur Azizah
Birth Date:   2005-08-10
School:       SMAN 3 Surabaya
Major:        Kedokteran
Phone:        +62812345680
Email Verify: ✅ Yes
Created:      2024-01-17T14:45:00Z
```

### Analysis Result (Mock Data)

```javascript
Overall Score:        82
Readiness Level:      "Siap"
Strengths:            4 items
Weaknesses:           3 items
Recommendations:      5 items
```

---

## 🔧 Cara Kerja Demo Mode

### Apa yang Terjadi?

**Sebelumnya** (dengan backend):

```
Login Form → API Call → Backend Validation → Database → Token → Redirect
```

**Sekarang** (demo mode):

```
Login Form → Local Check (DEMO_USERS) → Generate Fake Token → Store in Cookie → Redirect
```

### Code Implementation

Di file `src/components/providers/auth-provider.tsx`:

```typescript
// Demo users untuk testing tanpa backend
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "demo@prodiplan.id": {
    password: "demo123",
    user: {
      id: "user-demo-001",
      email: "demo@prodiplan.id",
      full_name: "Demo User",
      // ... data lainnya
    },
  },
};

// Di login function
if (USE_DEMO_MODE) {
  // Check against local demo users
  const demoUser = DEMO_USERS[email];
  if (!demoUser || demoUser.password !== password) {
    throw new Error("Email atau password salah");
  }
  // Login berhasil dengan fake token
}
```

---

## ✨ Demo Mode Features

### ✅ Sudah Berjalan

- Login dengan demo user
- Registration dengan data apapun
- Token management dengan cookies
- Automatic redirect ke dashboard
- Protected routes validation
- Session persistence

### ❌ Yang Perlu Backend (Phase 2)

- Simpan data registrasi ke database
- Real password hashing & security
- Actual user profile storage
- Real analysis dari AI
- Actual test history tracking
- Real PDF generation

---

## 🔄 Transition ke Backend

Ketika sudah ada backend, cukup:

1. Set environment variable:

```bash
NEXT_PUBLIC_API_URL=https://api.prodiplan.id
```

2. Auth provider akan otomatis switch dari demo mode ke real API
3. Tidak perlu ubah kode aplikasi!

---

## 💡 Testing Scenarios

### Scenario 1: Test Full Flow

```
1. Login: demo@prodiplan.id / demo123
2. Lihat dashboard
3. Mulai test
4. Jawab semua pertanyaan
5. Lihat hasil
```

### Scenario 2: Test Registration

```
1. Klik "Daftar"
2. Isi form lengkap
3. Klik "Daftar Sekarang"
4. Check redirect & greeting
```

### Scenario 3: Test Wrong Password

```
1. Login: demo@prodiplan.id / wrongpassword
2. Harusnya error toast muncul
3. Tetap di halaman login
```

### Scenario 4: Test Logout & Re-login

```
1. Login ke dashboard
2. Logout (jika ada button)
3. Should redirect ke home/auth
4. Login lagi, harusnya berhasil
```

---

## 🔐 Security Notes

**Demo Mode ⚠️**

- Token hanya di-generate untuk demo
- Tidak ada actual security implementation
- Cocok untuk testing & development ONLY
- **JANGAN** gunakan di production!

**Production** ✅

- Pastikan backend ada
- Proper password hashing (bcrypt)
- JWT token signing
- Refresh token rotation
- HTTPS only cookies

---

## 📝 Environment Configuration

### Development (Demo Mode)

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
# (atau kosong untuk auto-detect demo mode)
```

### Production

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.prodiplan.id
```

---

## 🎯 Menambah Demo User Baru

Jika ingin menambah akun demo lain, edit file `src/components/providers/auth-provider.tsx`:

```typescript
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "demo@prodiplan.id": {
    password: "demo123",
    user: {
      /* ... */
    },
  },
  // Tambah di sini
  "test@prodiplan.id": {
    password: "test123",
    user: {
      id: "user-test-001",
      email: "test@prodiplan.id",
      full_name: "Test User",
      birth_date: "2006-05-20",
      school_origin: "SMA Negeri 1",
      dream_major: "Kedokteran",
      avatar_url: "",
      phone_number: "",
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
};
```

---

## 🧪 Troubleshooting Demo Mode

### Login tidak bisa dengan demo account

**Solution:**

- Pastikan email: `demo@prodiplan.id`
- Pastikan password: `demo123`
- Clear browser cookies
- Refresh page

### Redirect tidak ke dashboard

**Solution:**

- Check middleware di `src/middleware.ts`
- Check token di browser cookies
- Open browser console untuk error message

### Data hilang setelah refresh

**Solution:**

- Normal untuk demo mode (data hanya di memory)
- Token ada di cookies tapi user di-reset
- Akan di-persist dengan backend di phase 2

### Registration berhasil tapi tidak bisa login kembali

**Solution:**

- Demo registration menyimpan data di localStorage saja
- Clear cookies jika ada masalah
- Use demo account yang sudah ada: `demo@prodiplan.id / demo123`

---

## 🚀 Quick Start

**Untuk testing tanpa backend:**

```bash
# 1. Install dependencies (jika belum)
npm install

# 2. Start dev server
npm run dev

# 3. Buka http://localhost:3000

# 4. Login dengan:
# Email: demo@prodiplan.id
# Password: demo123

# 5. Selesai! ✅
```

---

## 📊 Demo Mode vs Real Backend

| Feature     | Demo Mode        | Real Backend  |
| ----------- | ---------------- | ------------- |
| Login       | ✅ Local check   | ✅ API call   |
| Register    | ✅ Local storage | ✅ Database   |
| Token       | ✅ Fake token    | ✅ JWT token  |
| Persistence | ⚠️ Cookies only  | ✅ Database   |
| Analysis    | ✅ Mock data     | ✅ Real AI    |
| History     | ❌               | ✅            |
| Security    | ⚠️ Demo only     | ✅ Production |

---

## ✅ Checklist Setup

- [x] Demo mode implemented
- [x] Demo user configured
- [x] Registration working
- [x] Token management working
- [x] Cookie storage working
- [x] Redirect working
- [x] Error handling working
- [ ] Backend API ready (Phase 2)
- [ ] Real authentication ready (Phase 2)

---

**Ready to test?** Buka http://localhost:3000 dan login dengan:

```
Email: demo@prodiplan.id
Password: demo123
```

Selamat mencoba! 🎉

---

**Last Updated**: November 1, 2025  
**Status**: Demo Mode Ready ✅
