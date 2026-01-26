# Error Handling Documentation

## Authentication Error Handling

Aplikasi ini sekarang mendukung error handling yang lebih spesifik untuk autentikasi (login dan registrasi).

## Login Error Handling

Berikut adalah cara backend API seharusnya mengembalikan error untuk login:

### 1. Email Tidak Terdaftar

Ketika user mencoba login dengan email yang tidak terdaftar, backend seharusnya mengembalikan:

**Status Code:** `404 Not Found`

**Response Body:**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND" atau "EMAIL_NOT_FOUND",
    "message": "User not found" atau "Email not found" atau "Email not registered"
  }
}
```

**Pesan yang ditampilkan ke user:** "Email tidak terdaftar"

### 2. Password Salah

Ketika user mencoba login dengan password yang salah, backend seharusnya mengembalikan:

**Status Code:** `401 Unauthorized`

**Response Body:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD" atau "WRONG_PASSWORD",
    "message": "Invalid password" atau "Wrong password" atau "Incorrect password"
  }
}
```

**Pesan yang ditampilkan ke user:** "Password salah"

### 3. Error Umum (Fallback)

Jika backend mengembalikan error umum seperti `INVALID_LOGIN_CREDENTIALS`:

**Status Code:** `401 Unauthorized`

**Response Body:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_LOGIN_CREDENTIALS",
    "message": "Invalid login credentials"
  }
}
```

**Pesan yang ditampilkan ke user:** "Email atau password salah"

## Registration Error Handling

Berikut adalah cara backend API seharusnya mengembalikan error untuk registrasi:

### 1. Email Sudah Terdaftar

Ketika user mencoba registrasi dengan email yang sudah terdaftar, backend seharusnya mengembalikan:

**Status Code:** `409 Conflict`

**Response Body:**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS" atau "EMAIL_ALREADY_EXISTS" atau "USER_ALREADY_EXISTS",
    "message": "Email already exists" atau "Email sudah terdaftar"
  }
}
```

**Pesan yang ditampilkan ke user:** "Email sudah terdaftar"

### 2. Error Validasi Lainnya

Untuk error validasi seperti password terlalu pendek, format email salah, dll:

**Status Code:** `400 Bad Request`

**Response Body:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Deskripsi error spesifik"
  }
}
```

**Pesan yang ditampilkan ke user:** Message dari backend atau pesan default

## Deteksi Error di Frontend

Frontend akan mendeteksi jenis error berdasarkan:

1. **Status Code** (404 untuk user not found, 401 untuk password salah, 409 untuk email sudah ada)
2. **Error Code** (USER_NOT_FOUND, EMAIL_NOT_FOUND, INVALID_PASSWORD, EMAIL_EXISTS, dll)
3. **Error Message** (mencari kata kunci seperti "not found", "invalid password", "already exists", dll)

## Implementasi di Frontend

### Login Error Handling

Berikut adalah implementasi di `auth-provider.tsx`:

```typescript
try {
  const data = await authService.login({ email, password });
  // ... handle success
} catch (error: any) {
  let errorMessage = "Login gagal";
  
  // Cek untuk email tidak terdaftar
  if (error.statusCode === 404 || 
      error.message?.toLowerCase().includes('user not found') ||
      error.message?.toLowerCase().includes('email not found') ||
      error.message?.toLowerCase().includes('not registered') ||
      error.errorCode === 'USER_NOT_FOUND' ||
      error.errorCode === 'EMAIL_NOT_FOUND') {
    errorMessage = "Email tidak terdaftar";
  } 
  // Cek untuk password salah
  else if (error.statusCode === 401 || 
           error.message?.toLowerCase().includes('invalid password') ||
           error.message?.toLowerCase().includes('wrong password') ||
           error.message?.toLowerCase().includes('incorrect password') ||
           error.errorCode === 'INVALID_PASSWORD' ||
           error.errorCode === 'WRONG_PASSWORD') {
    errorMessage = "Password salah";
  } 
  // Fallback untuk error umum
  else if (error.message?.toLowerCase().includes('invalid_login_credentials') ||
           error.message?.toLowerCase().includes('invalid credentials')) {
    errorMessage = "Email atau password salah";
  }
  
  toast.error(errorMessage);
  throw error;
}
```

### Registration Error Handling

Berikut adalah implementasi di `auth-provider.tsx`:

```typescript
try {
  const data = await authService.register(userData);
  // ... handle success
} catch (error: any) {
  let errorMessage = "Registrasi gagal";
  
  // Cek untuk email sudah terdaftar
  if (error.statusCode === 409 || 
      error.message?.toLowerCase().includes('email already exists') ||
      error.message?.toLowerCase().includes('email sudah terdaftar') ||
      error.message?.toLowerCase().includes('email_exist') ||
      error.message?.toLowerCase().includes('already registered') ||
      error.errorCode === 'EMAIL_EXISTS' ||
      error.errorCode === 'EMAIL_ALREADY_EXISTS' ||
      error.errorCode === 'USER_ALREADY_EXISTS') {
    errorMessage = "Email sudah terdaftar";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast.error(errorMessage);
  throw error;
}
```

## Rekomendasi untuk Backend

Untuk implementasi yang lebih baik, backend seharusnya:

1. ✅ Mengembalikan status code yang berbeda untuk error yang berbeda (404 vs 401 vs 409)
2. ✅ Menyertakan `error.code` yang spesifik untuk memudahkan frontend mendeteksi jenis error
3. ✅ Menggunakan message yang konsisten dan deskriptif
4. ⚠️ Untuk login: Pertimbangkan antara UX yang baik vs keamanan (lihat Catatan Keamanan di bawah)

### Catatan Keamanan

Beberapa aplikasi dengan tingkat keamanan tinggi sengaja tidak membedakan antara "email tidak terdaftar" dan "password salah" untuk mencegah **user enumeration attack** (attacker dapat mengetahui email mana yang sudah terdaftar di sistem).

Namun, untuk aplikasi ProdiPlan yang merupakan aplikasi edukasi, memberikan feedback yang lebih spesifik dapat meningkatkan user experience tanpa risiko keamanan yang signifikan.

Untuk **registrasi**, memberitahu user bahwa "Email sudah terdaftar" adalah praktik standar dan tidak menimbulkan masalah keamanan karena endpoint registrasi memang dirancang untuk mengecek ketersediaan email.

Jika tim memutuskan untuk tetap menggunakan error umum demi keamanan pada login, frontend akan menampilkan pesan "Email atau password salah" untuk semua kasus login yang gagal.
## Forgot Password (Reset Password) - Security Best Practice

Untuk fitur forgot password, aplikasi menerapkan **security best practice** dengan tidak mengungkapkan apakah email terdaftar atau tidak di sistem. Ini penting untuk mencegah:

1. **Email Enumeration Attack** - Penyerang tidak bisa mengetahui email mana yang terdaftar di sistem
2. **Privacy Breach** - Mencegah orang lain mengecek apakah seseorang memiliki akun di platform

### Implementasi

**Perilaku Frontend:**
- Selalu menampilkan pesan sukses yang sama, terlepas dari response dari backend
- Pesan: "Jika email terdaftar, link reset password telah dikirim!"
- Tidak membedakan antara email yang ada vs tidak ada di database

**Backend Behavior (Recommended):**
- Jika email terdaftar: Kirim email reset password dan return success
- Jika email tidak terdaftar: Return success tanpa mengirim email (silent fail)
- Selalu return HTTP 200 dengan response yang sama

**Code Implementation:**
```typescript
try {
  await authService.forgotPassword({ email });
  setEmailSent(true);
  toast.success("Jika email terdaftar, link reset password telah dikirim!");
} catch (error: any) {
  // Security: Always show success to prevent email enumeration
  setEmailSent(true);
  toast.success("Jika email terdaftar, link reset password telah dikirim!");
}
```

**User Experience:**
- User menerima konfirmasi yang konsisten
- Jika email mereka benar-benar terdaftar, mereka akan menerima email
- Jika tidak terdaftar, tidak ada email yang dikirim tapi user tidak tahu
- User diminta untuk cek inbox/spam folder mereka