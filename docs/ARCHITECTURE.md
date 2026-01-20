# 🗺️ ProdiPlan Frontend - Architecture Overview

## 📐 Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODIPLAN FRONTEND                        │
│                         Next.js 14 App                           │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                  │
        ┌───────▼────────┐              ┌────────▼────────┐
        │  PUBLIC PAGES  │              │ PROTECTED PAGES │
        └───────┬────────┘              └────────┬────────┘
                │                                 │
    ┌───────────┼───────────┐         ┌──────────┼──────────┐
    │           │           │         │          │          │
┌───▼──┐  ┌────▼────┐  ┌──▼───┐  ┌──▼────┐ ┌───▼────┐ ┌──▼────┐
│ Home │  │  Login  │  │Reset │  │Dashboard│ │Grader  │ │Profile│
│  /   │  │ /auth   │  │ PW   │  │         │ │        │ │       │
└──────┘  └─────────┘  └──────┘  └─────────┘ └────────┘ └───────┘
```

## 🔄 Data Flow

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ Interaction
     ▼
┌──────────────────┐
│   UI COMPONENTS  │
│  (Pages/Comps)   │
└────┬─────────────┘
     │ Actions
     ▼
┌──────────────────┐
│  STATE MGMT      │
│  (React Query +  │
│   Context API)   │
└────┬─────────────┘
     │ API Calls
     ▼
┌──────────────────┐
│  API SERVICES    │
│  (auth.ts,       │
│   grading.ts)    │
└────┬─────────────┘
     │ HTTP Requests
     ▼
┌──────────────────┐
│  BACKEND API     │
│  api.prodiplan   │
└──────────────────┘
```

## 🎯 Feature Map

```
AUTHENTICATION
├── Register (/auth)
├── Login (/auth)
├── Forgot Password (/auth/forgot-password)
├── Reset Password (/auth/reset-password)
├── Update Profile (/profile/enhanced → Settings)
├── Delete Account (/profile/enhanced → Settings)
└── Logout (Header/Profile)

GRADING SESSIONS
├── Create Session (/essay-grader)
├── Answer Questions (/essay-grader)
├── View Chat History (/essay-grader)
├── Complete Session (/essay-grader)
├── View Results (/essay-grader/result)
└── Session History (/profile/enhanced → Riwayat)
    ├── List Sessions
    ├── Filter by Status
    ├── Continue Active
    ├── Delete Session
    └── View Details

STATISTICS & ANALYTICS
└── Dashboard (/profile/enhanced → Ringkasan)
    ├── Total Assessments
    ├── Average Score
    ├── Readiness Distribution
    └── Latest Result Preview
```

## 📦 Component Hierarchy

```
App
├── Providers
│   ├── AuthProvider (Context)
│   ├── QueryProvider (React Query)
│   └── LenisProvider (Smooth Scroll)
│
├── Layout
│   ├── Navigation
│   └── Footer
│
└── Pages
    ├── Public
    │   ├── Home (/)
    │   ├── Auth (/auth)
    │   │   ├── LoginForm
    │   │   └── RegisterForm
    │   ├── ForgotPassword (/auth/forgot-password)
    │   └── ResetPassword (/auth/reset-password)
    │
    └── Protected
        ├── Dashboard (/dashboard)
        │   ├── WelcomeSection
        │   ├── QuickStats
        │   └── RecentActivity
        │
        ├── EssayGrader (/essay-grader)
        │   ├── SessionSetup
        │   ├── ChatInterface
        │   ├── QuestionDisplay
        │   └── AnswerInput
        │
        └── Profile (/profile/enhanced)
            ├── ProfileHeader
            ├── Tabs
            │   ├── Overview
            │   │   └── StatisticsDashboard
            │   │       ├── StatCard (×4)
            │   │       └── LatestResultPreview
            │   │
            │   ├── History
            │   │   └── SessionHistory
            │   │       ├── FilterButtons
            │   │       ├── SessionCard (×N)
            │   │       └── DeleteModal
            │   │
            │   └── Settings
            │       └── ProfileSettings
            │           ├── EditForm
            │           ├── DangerZone
            │           └── DeleteAccountModal
            └── LogoutModal
```

## 🛣️ User Journey Maps

### New User Flow

```
1. Landing Page (/)
   │
   ├─→ Click "Mulai Sekarang"
   │
   ▼
2. Auth Page (/auth)
   │
   ├─→ Fill Registration Form
   │   ├─ Email
   │   ├─ Password
   │   ├─ Full Name
   │   ├─ Birth Date
   │   ├─ School
   │   └─ Dream Major
   │
   ├─→ Submit
   │
   ▼
3. Dashboard (/dashboard)
   │
   ├─→ View Overview
   │
   ├─→ Click "Mulai Assessment"
   │
   ▼
4. Essay Grader (/essay-grader)
   │
   ├─→ Select Major
   ├─→ Create Session
   ├─→ Answer Questions
   ├─→ Complete Session
   │
   ▼
5. Result Page
   │
   ├─→ View Analysis
   ├─→ Read Recommendations
   │
   └─→ Back to Dashboard
```

### Returning User Flow

```
1. Auth Page (/auth)
   │
   ├─→ Login
   │
   ▼
2. Dashboard (/dashboard)
   │
   ├─→ View Statistics
   ├─→ Continue Active Session
   │   OR
   ├─→ Start New Assessment
   │   OR
   └─→ View Profile
       │
       ▼
3. Profile (/profile/enhanced)
   │
   ├─→ Tab: Ringkasan
   │   └─→ View Stats
   │
   ├─→ Tab: Riwayat
   │   ├─→ Filter Sessions
   │   ├─→ View Results
   │   ├─→ Continue Active
   │   └─→ Delete Session
   │
   └─→ Tab: Pengaturan
       ├─→ Edit Profile
       └─→ Delete Account
```

### Password Reset Flow

```
1. Auth Page (/auth)
   │
   ├─→ Click "Lupa password?"
   │
   ▼
2. Forgot Password (/auth/forgot-password)
   │
   ├─→ Enter Email
   ├─→ Submit
   │
   ▼
3. Check Email
   │
   ├─→ Click Reset Link
   │
   ▼
4. Reset Password (/auth/reset-password?oobCode=xxx)
   │
   ├─→ Enter New Password
   ├─→ Confirm Password
   ├─→ Submit
   │
   ▼
5. Success
   │
   └─→ Redirect to Login
```

## 🔌 API Integration Map

```
┌─────────────────────────────────────────────────┐
│              API ENDPOINTS (v1)                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  AUTHENTICATION                                  │
│  ├─ POST   /v1/auth/register                    │
│  ├─ POST   /v1/auth/login                       │
│  ├─ GET    /v1/auth/me                          │
│  ├─ POST   /v1/auth/refresh                     │
│  ├─ PATCH  /v1/auth/profile                     │
│  ├─ DELETE /v1/auth/user                        │
│  ├─ POST   /v1/auth/logout                      │
│  ├─ POST   /v1/auth/forgot-password             │
│  └─ POST   /v1/auth/reset-password              │
│                                                  │
│  GRADING SESSIONS                                │
│  ├─ POST   /v1/grading-sessions                 │
│  ├─ GET    /v1/grading-sessions                 │
│  ├─ GET    /v1/grading-sessions/:id             │
│  ├─ POST   /v1/grading-sessions/:id/complete    │
│  ├─ DELETE /v1/grading-sessions/:id             │
│  ├─ POST   /v1/grading-sessions/:id/messages    │
│  └─ GET    /v1/grading-sessions/:id/messages    │
│                                                  │
│  RESULTS                                         │
│  ├─ GET    /v1/grading-results/:session_id      │
│  ├─ GET    /v1/grading-results                  │
│  └─ GET    /v1/grading-results/statistics       │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 🗂️ File Organization

```
src/
├── app/                          # Next.js Pages
│   ├── auth/
│   │   ├── page.tsx             # Login/Register
│   │   ├── forgot-password/
│   │   │   └── page.tsx         # Forgot Password
│   │   └── reset-password/
│   │       └── page.tsx         # Reset Password
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard
│   ├── essay-grader/
│   │   ├── page.tsx             # Grading Interface
│   │   └── result/
│   │       └── page.tsx         # Session Result
│   └── profile/
│       ├── enhanced/
│       │   └── page.tsx         # Enhanced Profile ⭐
│       └── result/[resultId]/
│           └── page.tsx         # Result Detail
│
├── components/                   # React Components
│   ├── profile/
│   │   ├── ProfileSettings.tsx   # ⭐ New
│   │   ├── StatisticsDashboard.tsx # ⭐ New
│   │   └── SessionHistory.tsx    # ⭐ New
│   ├── layout/
│   │   ├── navigation.tsx
│   │   └── footer.tsx
│   ├── providers/
│   │   ├── auth-provider.tsx
│   │   ├── query-provider.tsx
│   │   └── lenis-provider.tsx
│   └── ui/
│       ├── SearchableSelect.tsx
│       ├── SplitText.tsx
│       └── ...
│
├── lib/                          # Utilities
│   ├── api.ts                   # 🔄 Updated
│   ├── services/
│   │   ├── auth.ts              # Auth API
│   │   └── grading.ts           # 🔄 Updated
│   ├── utils.ts
│   └── websocket.ts
│
├── types/
│   └── index.ts                 # 🔄 Updated
│
├── hooks/
│   └── useGradingSession.ts
│
└── data/
    └── schoolsAndMajors.ts
```

## 🎨 Design System

```
COLORS
├── Primary
│   ├── Blue-600: #2563eb
│   ├── Blue-700: #1d4ed8
│   └── Cyan-500: #06b6d4
│
├── Status
│   ├── Success: #10b981 (Green)
│   ├── Warning: #f59e0b (Yellow)
│   ├── Error: #ef4444 (Red)
│   └── Info: #3b82f6 (Blue)
│
└── Neutral
    ├── Black: #000000
    ├── White: #ffffff
    ├── Gray-50 to Gray-900
    └── Slate-50 to Slate-900

TYPOGRAPHY
├── Headings
│   ├── H1: 3xl (30px) Bold
│   ├── H2: 2xl (24px) Bold
│   └── H3: xl (20px) Semibold
│
└── Body
    ├── Large: base (16px)
    ├── Normal: sm (14px)
    └── Small: xs (12px)

SPACING
├── xs: 0.25rem (4px)
├── sm: 0.5rem (8px)
├── md: 1rem (16px)
├── lg: 1.5rem (24px)
└── xl: 2rem (32px)

SHADOWS
├── sm: 0 1px 2px rgba(0,0,0,0.05)
├── md: 0 4px 6px rgba(0,0,0,0.1)
└── lg: 0 10px 15px rgba(0,0,0,0.1)
```

## 📱 Responsive Breakpoints

```
┌────────────────────────────────────────┐
│  MOBILE (< 640px)                      │
│  ├─ Stack vertically                   │
│  ├─ Single column layout               │
│  ├─ Collapsible nav                    │
│  └─ Touch-friendly buttons (44x44px)   │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  TABLET (640px - 1024px)               │
│  ├─ 2 column grid                      │
│  ├─ Expanded nav                       │
│  └─ Medium spacing                     │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  DESKTOP (> 1024px)                    │
│  ├─ 3-4 column grid                    │
│  ├─ Full navigation                    │
│  ├─ Large spacing                      │
│  └─ Hover effects                      │
└────────────────────────────────────────┘
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│          SECURITY LAYERS                 │
├─────────────────────────────────────────┤
│                                          │
│  1. CLIENT-SIDE VALIDATION              │
│     ├─ Form validation                  │
│     ├─ Input sanitization               │
│     └─ Password strength check          │
│                                          │
│  2. AUTHENTICATION                      │
│     ├─ JWT tokens                       │
│     ├─ Token refresh                    │
│     └─ Secure storage (memory)          │
│                                          │
│  3. AUTHORIZATION                       │
│     ├─ Protected routes                 │
│     ├─ Role-based access                │
│     └─ Token validation                 │
│                                          │
│  4. HTTPS                               │
│     ├─ Encrypted transmission           │
│     └─ Secure API calls                 │
│                                          │
│  5. BACKEND VALIDATION                  │
│     ├─ Server-side checks               │
│     ├─ Database constraints             │
│     └─ API rate limiting                │
│                                          │
└─────────────────────────────────────────┘
```

---

**Visual Guide Version**: 1.0
**Last Updated**: January 20, 2026
**For**: ProdiPlan Frontend v2.0.0
