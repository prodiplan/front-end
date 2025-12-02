# Auth API Usage Guide

## Overview

Dokumentasi ini menjelaskan cara menggunakan Auth API di frontend yang sudah terintegrasi lengkap dengan API Specification.

## Endpoint yang Tersedia

### 1. Authentication Basics

#### Register

```typescript
const { register } = useAuth();

await register({
  email: "user@example.com",
  password: "securePassword123",
  full_name: "John Doe",
  birth_date: "2000-01-15",
  school_origin: "SMAN 1 Jakarta",
  dream_major: "Computer Science",
});
```

#### Login

```typescript
const { login } = useAuth();

await login("user@example.com", "securePassword123");
```

#### Logout

```typescript
const { logout } = useAuth();

logout(); // Automatically calls API and clears tokens
```

### 2. Profile Management

#### Get Current User

```typescript
const { user } = useAuth();

// user object contains:
// - id, email, full_name, birth_date
// - school_origin, dream_major
// - avatar_url, phone_number
// - email_verified, created_at, updated_at
```

#### Update Profile

```typescript
const { updateProfile } = useAuth();

await updateProfile({
  full_name: "Updated Name",
  phone_number: "+62812345678",
  avatar_url: "https://example.com/avatar.jpg",
});
```

### 3. Password Management (NEW)

#### Forgot Password

```typescript
const { forgotPassword } = useAuth();

// Sends reset password email
await forgotPassword("user@example.com");
```

#### Reset Password

```typescript
const { resetPassword } = useAuth();

// oobCode is from email link
await resetPassword("code-from-email", "newPassword123");
```

### 4. Account Deletion (NEW)

#### Delete Account

```typescript
const { deleteAccount } = useAuth();

// Requires current password for confirmation
await deleteAccount("currentPassword123");
// Automatically logs out after deletion
```

## Direct Service Usage

Jika ingin menggunakan API tanpa Context Provider:

```typescript
import { authService } from "@/lib/services/auth";

// All methods available:
const response = await authService.register(data);
const response = await authService.login(credentials);
const response = await authService.getProfile(token);
const response = await authService.updateProfile(data, token);
const response = await authService.forgotPassword({ email });
const response = await authService.resetPassword({ oobCode, newPassword });
const response = await authService.deleteUser({ password }, token);
const response = await authService.refreshToken({ refresh_token });
const response = await authService.logout(token);
```

## Error Handling

Semua method menggunakan try-catch dan menampilkan toast notification:

```typescript
try {
  await forgotPassword(email);
  // Success toast automatically shown
} catch (error) {
  // Error toast automatically shown
  console.error(error);
}
```

## Response Format

Semua response mengikuti format standar dari API Specification:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Complete Example

```tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword(email);
      // Success - user will see toast notification
    } catch (error) {
      // Error - user will see error toast
      console.error("Failed to send reset email:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button type="submit">Send Reset Email</button>
    </form>
  );
}
```

## Notes

- Semua endpoint sudah mengikuti API Specification (tanpa prefix `/api/v1`)
- Token JWT disimpan di cookies dengan expiry 7 hari
- Refresh token disimpan di cookies dengan expiry 30 hari
- Auto refresh token belum diimplementasikan (perlu ditambahkan interceptor)
- Semua error message sudah dalam Bahasa Indonesia untuk UX yang lebih baik
