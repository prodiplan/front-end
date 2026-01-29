# Perubahan Error Handling untuk Autentikasi

## Ringkasan Perubahan

Sistem autentikasi sekarang memberikan pesan error yang lebih spesifik:

### Login - Sebelum:
- ❌ Semua error login menampilkan: **"INVALID_LOGIN_CREDENTIALS"**

### Login - Sesudah:
- ✅ Email tidak terdaftar: **"Email tidak terdaftar"**
- ✅ Password salah: **"Password salah"**
- ℹ️ Error umum (fallback): **"Email atau password salah"**

### Registrasi - Sebelum:
- ❌ Email sudah ada menampilkan: **"email_exist"**

### Registrasi - Sesudah:
- ✅ Email sudah terdaftar: **"Email sudah terdaftar"**
- ℹ️ Error lainnya: Pesan dari backend atau pesan default

## File yang Diubah

### 1. `src/lib/api.ts`
- Menambahkan class `ApiError` untuk menangkap error detail termasuk status code dan error code
- Mengubah fungsi `apiCall` untuk throw `ApiError` dengan informasi lebih lengkap

### 2. `src/components/providers/auth-provider.tsx`
- Menambahkan import `ApiError` dari `@/lib/api`
- Mengubah fungsi `login` untuk mendeteksi jenis error berdasarkan:
  - Status code (404 = user not found, 401 = invalid password)
  - Error code (USER_NOT_FOUND, INVALID_PASSWORD, dll)
  - Error message (mencari kata kunci spesifik)
- Mengubah fungsi `register` untuk mendeteksi jenis error berdasarkan:
  - Status code (409 = email already exists)
  - Error code (EMAIL_EXISTS, EMAIL_ALREADY_EXISTS, dll)
  - Error message (mencari kata kunci spesifik seperti "email_exist", "already exists", dll)
- Menampilkan toast error yang sesuai dengan jenis error

## Cara Kerja

### Login

Ketika user mencoba login:

1. **Email Tidak Terdaftar:**
   - Backend mengembalikan status 404 atau error code `USER_NOT_FOUND`
   - Frontend mendeteksi dan menampilkan: "Email tidak terdaftar"

2. **Password Salah:**
   - Backend mengembalikan status 401 atau error code `INVALID_PASSWORD`
   - Frontend mendeteksi dan menampilkan: "Password salah"

3. **Error Lainnya:**
   - Menampilkan pesan error dari backend atau pesan default

### Registrasi

Ketika user mencoba registrasi:

1. **Email Sudah Terdaftar:**
   - Backend mengembalikan status 409 atau error code `EMAIL_EXISTS`
   - Frontend mendeteksi error message seperti "email_exist", "already exists", dll
   - Frontend menampilkan: "Email sudah terdaftar"

2. **Error Lainnya:**
   - Menampilkan pesan error dari backend atau pesan default

## Contoh Skenario

### Skenario 1: Email Tidak Terdaftar
```
User Input:
- Email: userbaruan@gmail.com
- Password: password123

Response dari Backend:
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}

Pesan di UI: 🔴 "Email tidak terdaftar"
```

### Skenario 2: Password Salah
```
User Input:
- Email: demo@prodiplan.id
- Password: salahpassword

Response dari Backend:
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Invalid password"
  }
}

Pesan di UI: 🔴 "Password salah"
```

### Skenario 3: Login Berhasil
```
User Input:
- Email: demo@prodiplan.id
- Password: demo123

Response dari Backend:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "...",
    "refresh_token": "..."
  }
}

Pesan di UI: ✅ "Login berhasil!"
```

### Skenario 4: Email Sudah Terdaftar (Registrasi)
```
User Input (Registrasi):
- Email: demo@prodiplan.id (sudah terdaftar)
- Password: password123
- Full Name: Test User

Response dari Backend:
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email already exists"
  }
}

Pesan di UI: 🔴 "Email sudah terdaftar"
```

### Skenario 5: Registrasi Berhasil
```
User Input:
- Email: newuser@gmail.com
- Password: password123
- Full Name: New User

Response dari Backend:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "...",
    "refresh_token": "..."
  }
}

Pesan di UI: ✅ "Registrasi berhasil!"
```

## Testing

Untuk menguji implementasi ini:

### Login:
1. Coba login dengan email yang tidak terdaftar
2. Coba login dengan email benar tapi password salah
3. Coba login dengan kredensial yang benar

### Registrasi:
1. Coba registrasi dengan email yang sudah terdaftar
2. Coba registrasi dengan email baru
3. Coba registrasi dengan data yang tidak valid

## Catatan untuk Backend Developer

Backend API harus mengembalikan error yang sesuai:

### Login:
- **Email tidak terdaftar:** Status 404 dengan error code `USER_NOT_FOUND` atau `EMAIL_NOT_FOUND`
- **Password salah:** Status 401 dengan error code `INVALID_PASSWORD` atau `WRONG_PASSWORD`

### Registrasi:
- **Email sudah terdaftar:** Status 409 dengan error code `EMAIL_EXISTS` atau `EMAIL_ALREADY_EXISTS`

Lihat dokumentasi lengkap di [ERROR-HANDLING.md](./ERROR-HANDLING.md)

## Dokumentasi Tambahan

- [ERROR-HANDLING.md](./ERROR-HANDLING.md) - Detail lengkap tentang error handling
- [DEVELOPER-GUIDE.md](./DEVELOPER-GUIDE.md) - Panduan developer umum
