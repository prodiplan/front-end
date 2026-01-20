# 🔧 Developer Guide - API Implementation

## 📝 Ringkasan Implementasi

Semua endpoint dari `api-documentation-fe (2).md` telah diimplementasikan dan siap digunakan.

---

## ✅ Checklist Implementasi

### Authentication Endpoints

- [x] `POST /v1/auth/register` - Register user baru
- [x] `POST /v1/auth/login` - Login user
- [x] `GET /v1/auth/me` - Get current user profile
- [x] `POST /v1/auth/refresh` - Refresh access token
- [x] `PATCH /v1/auth/profile` - Update user profile
- [x] `DELETE /v1/auth/user` - Delete user account
- [x] `POST /v1/auth/logout` - Logout user
- [x] `POST /v1/auth/forgot-password` - Request password reset
- [x] `POST /v1/auth/reset-password` - Reset password with code

### Grading Sessions Endpoints

- [x] `POST /v1/grading-sessions` - Create new session
- [x] `GET /v1/grading-sessions` - List sessions with pagination
- [x] `GET /v1/grading-sessions/:id` - Get session details
- [x] `POST /v1/grading-sessions/:id/complete` - Complete session
- [x] `DELETE /v1/grading-sessions/:id` - Delete session
- [x] `POST /v1/grading-sessions/:id/messages` - Send message/answer
- [x] `GET /v1/grading-sessions/:id/messages` - Get chat history

### Grading Results Endpoints

- [x] `GET /v1/grading-results/:session_id` - Get result for session
- [x] `GET /v1/grading-results` - List all results
- [x] `GET /v1/grading-results/statistics` - Get user statistics

---

## 🗂️ File Structure & Changes

### 1. API Configuration

**File**: `src/lib/api.ts`

**Changes**:

- ✅ Updated all endpoints to use `/v1` prefix
- ✅ Added `deleteSession` endpoint
- ✅ Added `statistics` endpoint

```typescript
export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/v1/auth/register`,
    login: `${API_BASE_URL}/v1/auth/login`,
    // ... all updated with /v1 prefix
  },
  grading: {
    deleteSession: (id: string) => `${API_BASE_URL}/v1/grading-sessions/${id}`,
  },
  results: {
    statistics: `${API_BASE_URL}/v1/grading-results/statistics`,
  },
};
```

### 2. Type Definitions

**File**: `src/types/index.ts`

**Changes**:

- ✅ Added `GradingStatistics` interface

```typescript
export interface GradingStatistics {
  total_sessions: number;
  average_score: number;
  readiness_distribution: {
    ready: number;
    not_ready: number;
    needs_improvement: number;
  };
  latest_result?: {
    session_id: string;
    final_score: number;
    readiness_level: "ready" | "not_ready" | "needs_improvement";
    created_at: string;
  };
}
```

### 3. Services

**File**: `src/lib/services/grading.ts`

**Changes**:

- ✅ Added `deleteSession` function
- ✅ Added `getStatistics` function

```typescript
export const gradingService = {
  // ... existing methods

  deleteSession: async (sessionId: string, token: string) => {
    return apiCall(
      API_ENDPOINTS.grading.deleteSession(sessionId),
      { method: "DELETE" },
      token,
    ) as Promise<ApiResponse<void>>;
  },

  getStatistics: async (token: string) => {
    return apiCall(
      API_ENDPOINTS.results.statistics,
      { method: "GET" },
      token,
    ) as Promise<ApiResponse<GradingStatistics>>;
  },
};
```

### 4. New Pages

**Created Files**:

- `src/app/auth/forgot-password/page.tsx` - Forgot password form
- `src/app/auth/reset-password/page.tsx` - Reset password with oobCode
- `src/app/profile/enhanced/page.tsx` - Enhanced profile with tabs

### 5. New Components

**Created Files**:

- `src/components/profile/ProfileSettings.tsx` - Profile update & delete account
- `src/components/profile/StatisticsDashboard.tsx` - Display user statistics
- `src/components/profile/SessionHistory.tsx` - Session list with filters & delete

---

## 🔄 API Call Examples

### Authentication

```typescript
// Register
import { authService } from "@/lib/services/auth";

const registerUser = async () => {
  const response = await authService.register({
    email: "user@example.com",
    password: "SecurePass123",
    full_name: "John Doe",
    birth_date: "2000-01-01",
    school_origin: "SMA 1",
    dream_major: "Computer Science",
  });
  console.log(response.data); // { user, token, refresh_token }
};

// Update Profile
const updateUserProfile = async (token: string) => {
  const response = await authService.updateProfile(
    {
      full_name: "Jane Doe",
      phone_number: "+6281234567890",
      dream_major: "Data Science",
    },
    token,
  );
  console.log(response.data); // Updated user object
};

// Delete Account
const deleteUserAccount = async (token: string) => {
  await authService.deleteUser({ password: "currentPassword" }, token);
};

// Forgot Password
const requestPasswordReset = async () => {
  await authService.forgotPassword({
    email: "user@example.com",
  });
};

// Reset Password
const resetPassword = async () => {
  await authService.resetPassword({
    oobCode: "code_from_email",
    newPassword: "NewSecurePass123",
  });
};
```

### Grading Sessions

```typescript
import { gradingService } from "@/lib/services/grading";

// Create Session
const createSession = async (token: string) => {
  const response = await gradingService.createSession(
    {
      target_major: "Computer Science",
      max_questions: 10,
      session_duration_minutes: 60,
    },
    token,
  );
  console.log(response.data); // Session with first_question
};

// List Sessions
const listSessions = async (token: string) => {
  const response = await gradingService.listSessions(
    {
      status: "active",
      limit: 10,
      offset: 0,
    },
    token,
  );
  console.log(response.data.sessions); // Array of sessions
};

// Delete Session
const deleteSession = async (sessionId: string, token: string) => {
  await gradingService.deleteSession(sessionId, token);
};

// Send Answer
const sendAnswer = async (sessionId: string, token: string) => {
  const response = await gradingService.sendMessage(
    sessionId,
    {
      message_type: "answer",
      content: "My answer to the question...",
    },
    token,
  );
  console.log(response.data); // { message, score, next_question, session_completed }
};

// Complete Session
const completeSession = async (sessionId: string, token: string) => {
  const response = await gradingService.completeSession(sessionId, {}, token);
  console.log(response.data); // Completed session
};
```

### Results & Statistics

```typescript
// Get Session Result
const getResult = async (sessionId: string, token: string) => {
  const response = await gradingService.getResult(sessionId, token);
  console.log(response.data); // Full analysis report
};

// List Results
const listResults = async (token: string) => {
  const response = await gradingService.listResults(
    {
      readiness_level: "ready",
      limit: 10,
      offset: 0,
    },
    token,
  );
  console.log(response.data.results); // Array of results
};

// Get Statistics
const getStatistics = async (token: string) => {
  const response = await gradingService.getStatistics(token);
  console.log(response.data);
  // {
  //   total_sessions: 5,
  //   average_score: 75.5,
  //   readiness_distribution: { ready: 3, not_ready: 1, needs_improvement: 1 },
  //   latest_result: { ... }
  // }
};
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Flow

- [ ] Register dengan data valid
- [ ] Login dengan credentials yang baru dibuat
- [ ] Get current user profile
- [ ] Update profile (nama, telepon, jurusan)
- [ ] Request forgot password
- [ ] Reset password dengan link dari email
- [ ] Login dengan password baru
- [ ] Delete account

#### Grading Flow

- [ ] Create new grading session
- [ ] Send answer dan terima next question
- [ ] Get chat history
- [ ] Complete session
- [ ] View result
- [ ] List all sessions
- [ ] Delete session

#### Statistics

- [ ] View statistics setelah complete beberapa session
- [ ] Verify total sessions count
- [ ] Verify average score calculation
- [ ] Check readiness distribution

### Integration Testing

```typescript
// Example test flow
describe("Grading Session Flow", () => {
  let token: string;
  let sessionId: string;

  test("should login user", async () => {
    const response = await authService.login({
      email: "test@example.com",
      password: "TestPass123",
    });
    token = response.data.token;
    expect(token).toBeDefined();
  });

  test("should create session", async () => {
    const response = await gradingService.createSession(
      { target_major: "Computer Science" },
      token,
    );
    sessionId = response.data.id;
    expect(response.data.first_question).toBeDefined();
  });

  test("should send answer", async () => {
    const response = await gradingService.sendMessage(
      sessionId,
      { message_type: "answer", content: "Test answer" },
      token,
    );
    expect(response.data.next_question).toBeDefined();
  });

  test("should delete session", async () => {
    await gradingService.deleteSession(sessionId, token);
    // Session should be deleted
  });
});
```

---

## 🚀 Deployment Notes

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.prodiplan.my.id
```

### Build Command

```bash
pnpm build
```

### Production Considerations

1. **Token Management**
   - Access tokens stored in memory (auth context)
   - Refresh tokens should be handled automatically
   - Implement token refresh logic before expiry

2. **Error Handling**
   - All API calls wrapped in try-catch
   - User-friendly error messages via toast
   - Proper error logging for debugging

3. **Performance**
   - Use React Query for caching (implemented in hooks)
   - Lazy load components
   - Optimize images and assets

4. **Security**
   - Never log sensitive data (tokens, passwords)
   - Validate all user inputs
   - Use HTTPS in production

---

## 📚 Additional Resources

- **API Documentation**: `docs/api-documentation-fe (2).md`
- **User Guide**: `docs/USER-GUIDE.md`
- **Type Definitions**: `src/types/index.ts`

---

## 🔄 Migration Guide (jika update dari versi lama)

### Breaking Changes

1. **API Endpoints now use /v1 prefix**

   ```typescript
   // Old
   /auth/eegirrst /
     // New
     v1 /
     auth /
     register;
   ```

2. **New required fields in types**
   ```typescript
   // GradingStatistics is now available
   import { GradingStatistics } from "@/types";
   ```

### Update Steps

1. Pull latest changes
2. Run `pnpm install` (jika ada dependency baru)
3. Update environment variables if needed
4. Test all critical flows
5. Deploy

---

**Last Updated**: January 20, 2026
**API Version**: v1
**Frontend Version**: 2.0.0
