# 🚀 ProdiPlan - Panduan Implementasi Fitur API

## ✅ Fitur yang Telah Diimplementasikan

Berdasarkan API documentation (`api-documentation-fe (2).md`), semua fitur telah diimplementasikan dan siap digunakan.

---

## 📋 Daftar Fitur yang Tersedia

### 1. 🔐 Autentikasi (Authentication)

#### ✓ Register

- **Endpoint**: `POST /v1/auth/register`
- **File**: `src/lib/services/auth.ts`
- **Halaman**: `src/app/auth/page.tsx`
- **Cara Menggunakan**:
  - Buka halaman `/auth`
  - Klik tab "Daftar"
  - Isi semua field yang diperlukan
  - Klik "Daftar Sekarang"

#### ✓ Login

- **Endpoint**: `POST /v1/auth/login`
- **File**: `src/lib/services/auth.ts`
- **Halaman**: `src/app/auth/page.tsx`
- **Cara Menggunakan**:
  - Buka halaman `/auth`
  - Masukkan email dan password
  - Klik "Login"

#### ✓ Forgot Password

- **Endpoint**: `POST /v1/auth/forgot-password`
- **File**: `src/lib/services/auth.ts`
- **Halaman**: `src/app/auth/forgot-password/page.tsx`
- **Cara Menggunakan**:
  - Buka halaman `/auth`
  - Klik link "Lupa password?"
  - Masukkan email Anda
  - Klik "Kirim Link Reset Password"
  - Cek email untuk link reset

#### ✓ Reset Password

- **Endpoint**: `POST /v1/auth/reset-password`
- **File**: `src/lib/services/auth.ts`
- **Halaman**: `src/app/auth/reset-password/page.tsx`
- **Cara Menggunakan**:
  - Klik link dari email reset password
  - Masukkan password baru (minimal 8 karakter dengan huruf besar, kecil, dan angka)
  - Konfirmasi password
  - Klik "Reset Password"

#### ✓ Get Current User

- **Endpoint**: `GET /v1/auth/me`
- **File**: `src/lib/services/auth.ts`
- **Digunakan di**: `src/components/providers/auth-provider.tsx`
- **Otomatis**: Dipanggil saat aplikasi dimuat untuk mendapatkan data user

#### ✓ Update Profile

- **Endpoint**: `PATCH /v1/auth/profile`
- **File**: `src/lib/services/auth.ts`
- **Halaman**: `src/components/profile/ProfileSettings.tsx`
- **Cara Menggunakan**:
  - Buka halaman `/profile/enhanced`
  - Klik tab "Pengaturan"
  - Klik "Edit Profil"
  - Ubah field yang ingin diupdate (nama, telepon, jurusan impian)
  - Klik "Simpan"

#### ✓ Delete Account

- **Endpoint**: `DELETE /v1/auth/user`
- **File**: `src/lib/services/auth.ts`
- **Halaman**: `src/components/profile/ProfileSettings.tsx`
- **Cara Menggunakan**:
  - Buka halaman `/profile/enhanced`
  - Klik tab "Pengaturan"
  - Scroll ke "Zona Bahaya"
  - Klik "Hapus Akun"
  - Masukkan password untuk konfirmasi
  - Klik "Hapus Akun"

#### ✓ Logout

- **Endpoint**: `POST /v1/auth/logout`
- **File**: `src/lib/services/auth.ts`
- **Digunakan di**: `src/components/providers/auth-provider.tsx`
- **Cara Menggunakan**:
  - Klik tombol "Logout" di header/profile

---

### 2. 📝 Grading Sessions

#### ✓ Create Session

- **Endpoint**: `POST /v1/grading-sessions`
- **File**: `src/lib/services/grading.ts`
- **Halaman**: `src/app/essay-grader/page.tsx`
- **Cara Menggunakan**:
  - Buka halaman `/essay-grader`
  - Pilih jurusan target
  - Opsional: Set max_questions dan durasi
  - Session otomatis dibuat dengan pertanyaan pertama

#### ✓ List Sessions

- **Endpoint**: `GET /v1/grading-sessions`
- **File**: `src/lib/services/grading.ts`
- **Halaman**: `src/components/profile/SessionHistory.tsx`
- **Cara Menggunakan**:
  - Buka halaman `/profile/enhanced`
  - Klik tab "Riwayat"
  - Filter berdasarkan status (Semua/Berlangsung/Selesai/Kedaluwarsa)

#### ✓ Get Session Details

- **Endpoint**: `GET /v1/grading-sessions/:session_id`
- **File**: `src/lib/services/grading.ts`
- **Digunakan di**: `src/hooks/useGradingSession.ts`
- **Otomatis**: Dipanggil saat melihat detail session

#### ✓ Send Message (Answer)

- **Endpoint**: `POST /v1/grading-sessions/:session_id/messages`
- **File**: `src/lib/services/grading.ts`
- **Halaman**: `src/app/essay-grader/page.tsx`
- **Cara Menggunakan**:
  - Saat di halaman essay grader
  - Ketik jawaban Anda
  - Klik "Submit Answer"
  - AI akan menganalisis dan memberikan pertanyaan berikutnya

#### ✓ Get Chat History

- **Endpoint**: `GET /v1/grading-sessions/:session_id/messages`
- **File**: `src/lib/services/grading.ts`
- **Digunakan di**: `src/hooks/useGradingSession.ts`
- **Otomatis**: Menampilkan riwayat percakapan di halaman essay grader

#### ✓ Complete Session

- **Endpoint**: `POST /v1/grading-sessions/:session_id/complete`
- **File**: `src/lib/services/grading.ts`
- **Halaman**: `src/app/essay-grader/page.tsx`
- **Cara Menggunakan**:
  - Setelah menjawab semua pertanyaan atau ingin mengakhiri
  - Klik tombol "Complete Session"
  - Tunggu hasil akhir diproses

#### ✓ Delete Session

- **Endpoint**: `DELETE /v1/grading-sessions/:session_id`
- **File**: `src/lib/services/grading.ts`
- **Halaman**: `src/components/profile/SessionHistory.tsx`
- **Cara Menggunakan**:
  - Buka halaman `/profile/enhanced`
  - Klik tab "Riwayat"
  - Pada session yang ingin dihapus, klik "Hapus"
  - Konfirmasi penghapusan

---

### 3. 📊 Grading Results

#### ✓ Get Result for Session

- **Endpoint**: `GET /v1/grading-results/:session_id`
- **File**: `src/lib/services/grading.ts`
- **Halaman**: `src/app/profile/result/[resultId]/page.tsx`
- **Cara Menggunakan**:
  - Dari riwayat session yang selesai
  - Klik "Lihat Detail"
  - Akan menampilkan analisis lengkap

#### ✓ List Results

- **Endpoint**: `GET /v1/grading-results`
- **File**: `src/lib/services/grading.ts`
- **Digunakan di**: `src/hooks/useGradingSession.ts`
- **Otomatis**: Menampilkan daftar hasil di profile

#### ✓ Get Statistics

- **Endpoint**: `GET /v1/grading-results/statistics`
- **File**: `src/lib/services/grading.ts`
- **Halaman**: `src/components/profile/StatisticsDashboard.tsx`
- **Cara Menggunakan**:
  - Buka halaman `/profile/enhanced`
  - Tab "Ringkasan" akan menampilkan:
    - Total Assessment
    - Rata-rata Score
    - Jumlah yang "Siap"
    - Jumlah yang "Perlu Perbaikan"
    - Assessment terakhir

---

## 🛠️ Cara Menggunakan Aplikasi

### Setup Awal

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Set environment variable** (jika belum):

   ```env
   NEXT_PUBLIC_API_URL=https://api.prodiplan.my.id
   ```

3. **Run development server**:
   ```bash
   pnpm dev
   ```

### Flow Pengguna Baru

1. **Register** → `/auth`
   - Isi form registrasi
   - Submit

2. **Dashboard** → `/dashboard`
   - Lihat overview
   - Mulai assessment

3. **Essay Grader** → `/essay-grader`
   - Pilih jurusan
   - Mulai menjawab pertanyaan
   - Submit untuk pertanyaan berikutnya

4. **Lihat Hasil** → `/profile/enhanced`
   - Tab "Ringkasan" untuk statistik
   - Tab "Riwayat" untuk daftar session
   - Tab "Pengaturan" untuk edit profil

### Flow Pengguna Lupa Password

1. **Lupa Password** → `/auth/forgot-password`
   - Masukkan email
   - Cek inbox

2. **Reset Password** → `/auth/reset-password?oobCode=xxx`
   - Klik link dari email
   - Masukkan password baru
   - Login dengan password baru

---

## 📁 Struktur File Penting

```
src/
├── lib/
│   ├── api.ts                    # API endpoints configuration
│   └── services/
│       ├── auth.ts               # Auth service functions
│       └── grading.ts            # Grading service functions
├── types/
│   └── index.ts                  # TypeScript interfaces
├── components/
│   ├── providers/
│   │   └── auth-provider.tsx    # Auth context provider
│   └── profile/
│       ├── ProfileSettings.tsx  # Profile update & delete
│       ├── StatisticsDashboard.tsx  # Statistics display
│       └── SessionHistory.tsx   # Session list & management
├── app/
│   ├── auth/
│   │   ├── page.tsx             # Login & Register
│   │   ├── forgot-password/
│   │   │   └── page.tsx         # Forgot password form
│   │   └── reset-password/
│   │       └── page.tsx         # Reset password form
│   ├── profile/
│   │   └── enhanced/
│   │       └── page.tsx         # Enhanced profile page
│   └── essay-grader/
│       └── page.tsx             # Essay grading interface
└── hooks/
    └── useGradingSession.ts     # Custom hooks for grading
```

---

## 🔧 Kustomisasi

### Menambah Field di Update Profile

Edit file `src/components/profile/ProfileSettings.tsx`:

```typescript
const [formData, setFormData] = useState({
  full_name: user?.full_name || "",
  phone_number: user?.phone_number || "",
  dream_major: user?.dream_major || "",
  avatar_url: user?.avatar_url || "",
  // Tambahkan field baru di sini
});
```

### Mengubah Durasi Default Session

Edit file `src/app/essay-grader/page.tsx`:

```typescript
const createNewSession = async () => {
  const response = await gradingService.createSession(
    {
      target_major: selectedMajor,
      max_questions: 10, // Ubah jumlah pertanyaan
      session_duration_minutes: 60, // Ubah durasi (menit)
    },
    token,
  );
};
```

---

## 🐛 Troubleshooting

### Error: "API Error: 401"

- **Penyebab**: Token expired atau tidak valid
- **Solusi**: Logout dan login kembali

### Error: "Failed to fetch"

- **Penyebab**: Backend tidak responding atau CORS issue
- **Solusi**:
  - Cek koneksi internet
  - Pastikan backend running
  - Periksa NEXT_PUBLIC_API_URL

### Email Reset Password Tidak Terkirim

- **Penyebab**: Email tidak terdaftar atau SMTP issue
- **Solusi**:
  - Periksa ejaan email
  - Cek folder spam
  - Contact admin jika masalah berlanjut

---

## 📞 Support

Jika ada pertanyaan atau masalah:

- Email: support@prodiplan.my.id
- Documentation: `/docs`

---

**Update Terakhir**: January 2026
**Version**: 2.0.0
