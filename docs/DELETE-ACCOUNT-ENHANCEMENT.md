# Peningkatan Fitur Delete Account

## Ringkasan Perubahan

Implementasi peningkatan keamanan dan user experience pada fitur delete account dengan dua fitur utama:

### ✅ 1. Logout Otomatis Setelah Hapus Akun

**Lokasi:** `src/components/providers/auth-provider.tsx`

**Implementasi:**
- Setelah akun berhasil dihapus, sistem otomatis memanggil API logout untuk membersihkan session di backend
- Token dan refresh token dihapus dari cookies dan state
- User otomatis ter-logout dan diarahkan ke halaman utama

**Code Changes:**
```typescript
const deleteAccount = async (password: string) => {
  // ... existing code ...
  
  // Call logout to properly clean up session and invalidate tokens on backend
  try {
    await authService.logout(token, Cookies.get("refresh_token"));
  } catch (logoutError) {
    console.warn("Logout after delete account failed:", logoutError);
  }

  // Clear local state
  Cookies.remove("token");
  Cookies.remove("refresh_token");
  setToken(null);
  setUser(null);
};
```

### ✅ 2. Pencegahan Login dengan Akun yang Sudah Dihapus

**Lokasi:** `src/components/providers/auth-provider.tsx`

**Implementasi:**
- Menambahkan pengecekan error spesifik untuk akun yang sudah dihapus
- Menampilkan pesan error yang jelas: "Akun ini telah dihapus dan tidak dapat digunakan lagi"
- Mendukung berbagai response code dan error message dari backend

**Code Changes:**
```typescript
const login = async (email: string, password: string) => {
  try {
    // ... existing code ...
  } catch (error: any) {
    let errorMessage = "Login gagal";
    
    // Check for deleted account
    if (error.statusCode === 403 ||
        error.statusCode === 410 ||
        error.message?.toLowerCase().includes('account deleted') ||
        error.errorCode === 'ACCOUNT_DELETED') {
      errorMessage = "Akun ini telah dihapus dan tidak dapat digunakan lagi";
    }
    // ... other error checks ...
    
    toast.error(errorMessage);
  }
};
```

### ✅ 3. Update UI/UX pada Modal Delete Account

**Lokasi:** `src/components/profile/ProfileSettings.tsx`

**Perubahan:**
- Menambahkan peringatan baru: "Anda akan langsung logout dan tidak bisa login lagi dengan akun ini"
- Menggunakan `deleteAccount` dari auth context untuk konsistensi
- Pesan sukses yang lebih informatif: "Akun berhasil dihapus. Anda akan dialihkan..."

## Backend Requirements

Backend API harus mendukung:

1. **DELETE /v1/auth/user** 
   - Menghapus user dari database
   - Menghapus data auth dari auth provider
   - Return success response jika berhasil

2. **POST /v1/auth/login**
   - Return error code `403` atau `410` untuk akun yang sudah dihapus
   - Error message: "Account has been deleted" atau "Account deleted"
   - Error code: `ACCOUNT_DELETED` atau `USER_DELETED`

3. **POST /v1/auth/logout**
   - Invalidate refresh token di backend
   - Clean up session data

## Testing

### Skenario Test 1: Delete Account dan Logout Otomatis
1. Login dengan akun valid
2. Buka halaman profile
3. Klik "Hapus Akun"
4. Masukkan password
5. Konfirmasi delete
6. **Expected:** User langsung ter-logout dan diarahkan ke homepage

### Skenario Test 2: Prevent Login dengan Akun yang Sudah Dihapus
1. Delete account seperti di skenario 1
2. Coba login kembali dengan email dan password yang sama
3. **Expected:** Muncul error "Akun ini telah dihapus dan tidak dapat digunakan lagi"

## Error Codes yang Didukung

| Status Code | Error Message Contains | Error Code | User Message |
|-------------|------------------------|------------|--------------|
| 403, 410 | "account deleted", "user deleted" | ACCOUNT_DELETED, USER_DELETED | "Akun ini telah dihapus dan tidak dapat digunakan lagi" |
| 404 | "user not found", "email not found" | USER_NOT_FOUND, EMAIL_NOT_FOUND | "Email tidak terdaftar" |
| 401 | "invalid password", "wrong password" | INVALID_PASSWORD, WRONG_PASSWORD | "Password salah" |

## Files Modified

1. `src/components/providers/auth-provider.tsx` - Auth context provider dengan logout otomatis dan error handling
2. `src/components/profile/ProfileSettings.tsx` - Komponen profile settings dengan peningkatan UX
