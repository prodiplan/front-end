# ProdiPlan Frontend

A modern Next.js frontend application for the ProdiPlan platform - AI-powered major readiness assessment system.

## 🎯 Project Overview

ProdiPlan adalah platform komprehensif yang membantu siswa menilai kesiapan mereka untuk jurusan impian melalui sesi tanya jawab interaktif dengan AI. Platform ini memberikan analisis mendalam, rekomendasi, dan insight tentang kesesuaian siswa dengan jurusan yang dipilih.

## ✨ Key Features

### 🔐 Authentication & User Management

- ✅ User registration dan login
- ✅ Password reset flow (forgot password & email verification)
- ✅ Profile management (update info, delete account)
- ✅ Secure session handling dengan JWT tokens

### 📝 AI-Powered Assessment

- ✅ Interactive grading sessions dengan dynamic questions
- ✅ Real-time AI analysis untuk setiap jawaban
- ✅ Adaptive questioning berdasarkan respons siswa
- ✅ Session management (create, continue, complete, delete)

### 📊 Analytics & Insights

- ✅ Comprehensive statistics dashboard
- ✅ Readiness level assessment (Siap/Perlu Perbaikan/Belum Siap)
- ✅ Detailed analysis reports dengan:
  - Personality traits analysis
  - Strengths & weaknesses
  - Career suggestions
  - Book recommendations
  - Learning path roadmap
  - Industry insights

### 📱 User Experience

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI dengan glassmorphism effects
- ✅ Smooth animations dengan Framer Motion
- ✅ Toast notifications untuk feedback
- ✅ Loading states dan error handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ atau 20+
- pnpm package manager
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd front-end

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dan set NEXT_PUBLIC_API_URL

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.prodiplan.my.id
```

## 📁 Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── auth/                 # Authentication pages
│   │   ├── page.tsx          # Login/Register
│   │   ├── forgot-password/  # Password reset request
│   │   └── reset-password/   # Password reset confirmation
│   ├── dashboard/            # Main dashboard
│   ├── essay-grader/         # Assessment interface
│   │   ├── page.tsx          # Main grading page
│   │   ├── confirmation/     # Session confirmation
│   │   └── result/           # Result display
│   └── profile/              # User profile
│       ├── enhanced/         # Enhanced profile with tabs
│       ├── assessments/      # Assessment history
│       └── result/[id]/      # Detailed result view
├── components/               # Reusable components
│   ├── dashboard/            # Dashboard components
│   ├── layout/               # Layout (header, footer, nav)
│   ├── profile/              # Profile components
│   │   ├── ProfileSettings.tsx      # Edit profile & delete account
│   │   ├── StatisticsDashboard.tsx  # Statistics display
│   │   └── SessionHistory.tsx       # Session list & management
│   ├── providers/            # Context providers
│   │   ├── auth-provider.tsx        # Auth context
│   │   ├── query-provider.tsx       # React Query
│   │   └── lenis-provider.tsx       # Smooth scroll
│   ├── sections/             # Landing page sections
│   └── ui/                   # UI components
│       ├── SearchableSelect.tsx     # Dropdown with search
│       ├── SplitText.tsx            # Animated text
│       └── ...
├── hooks/                    # Custom React hooks
│   └── useGradingSession.ts  # Grading session hooks
├── lib/                      # Utilities & API
│   ├── api.ts                # API configuration
│   ├── utils.ts              # Helper functions
│   ├── websocket.ts          # WebSocket client
│   └── services/             # API services
│       ├── auth.ts           # Auth endpoints
│       └── grading.ts        # Grading endpoints
├── types/                    # TypeScript types
│   └── index.ts              # All type definitions
└── data/                     # Static data
    └── schoolsAndMajors.ts   # Schools & majors list
```

## 🛠️ Tech Stack

### Core

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons

### State & Data

- **Data Fetching**: React Query (TanStack Query)
- **State Management**: React Context API
- **Form Handling**: React Hook Form (where applicable)

### Animation & UX

- **Animations**: Framer Motion
- **Smooth Scroll**: Lenis
- **Notifications**: React Hot Toast

### Development

- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier
- **Type Safety**: TypeScript strict mode

## 📚 Documentation

Comprehensive documentation tersedia di folder `/docs`:

- **[USER-GUIDE.md](docs/USER-GUIDE.md)** - Panduan lengkap untuk user
- **[DEVELOPER-GUIDE.md](docs/DEVELOPER-GUIDE.md)** - Panduan untuk developer
- **[IMPLEMENTATION-SUMMARY.md](docs/IMPLEMENTATION-SUMMARY.md)** - Ringkasan implementasi API
- **[api-documentation-fe (2).md](<docs/api-documentation-fe%20(2).md>)** - API reference lengkap

## 🔗 API Integration

Aplikasi ini terintegrasi penuh dengan backend API ProdiPlan:

**Base URL**: `https://api.prodiplan.my.id`

### Implemented Endpoints (19/19) ✅

#### Authentication (9 endpoints)

- POST `/v1/auth/register` - Register user
- POST `/v1/auth/login` - Login user
- GET `/v1/auth/me` - Get current user
- POST `/v1/auth/refresh` - Refresh token
- PATCH `/v1/auth/profile` - Update profile
- DELETE `/v1/auth/user` - Delete account
- POST `/v1/auth/logout` - Logout
- POST `/v1/auth/forgot-password` - Request reset
- POST `/v1/auth/reset-password` - Reset password

#### Grading Sessions (7 endpoints)

- POST `/v1/grading-sessions` - Create session
- GET `/v1/grading-sessions` - List sessions
- GET `/v1/grading-sessions/:id` - Get session
- POST `/v1/grading-sessions/:id/complete` - Complete
- DELETE `/v1/grading-sessions/:id` - Delete session
- POST `/v1/grading-sessions/:id/messages` - Send answer
- GET `/v1/grading-sessions/:id/messages` - Get history

#### Results (3 endpoints)

- GET `/v1/grading-results/:session_id` - Get result
- GET `/v1/grading-results` - List results
- GET `/v1/grading-results/statistics` - Get stats

## 🚀 Deployment

### Build untuk Production

```bash
# Build aplikasi
pnpm build

# Start production server
pnpm start
```

### Environment Variables (Production)

```env
NEXT_PUBLIC_API_URL=https://api.prodiplan.my.id
NODE_ENV=production
```

### Deployment Platforms

Aplikasi ini dapat di-deploy ke:

- **Vercel** (Recommended untuk Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** (custom deployment)

## 📱 Halaman Aplikasi

### Public Pages

- `/` - Landing page
- `/auth` - Login & Register
- `/auth/forgot-password` - Forgot password
- `/auth/reset-password` - Reset password (with oobCode)

### Protected Pages (Requires Login)

- `/dashboard` - Main dashboard
- `/essay-grader` - Assessment interface
- `/essay-grader/confirmation` - Pre-session confirmation
- `/essay-grader/result` - Session result
- `/profile` - User profile (legacy)
- `/profile/enhanced` - Enhanced profile dengan tabs
- `/profile/assessments` - Assessment history
- `/profile/result/[resultId]` - Detailed result view

## 🧪 Development Workflow

### Running Tests

```bash
# Coming soon
pnpm test
```

### Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format
```

### Development Tips

1. Always run `pnpm dev` untuk development
2. Check browser console untuk errors
3. Use React DevTools untuk debugging
4. Monitor Network tab untuk API calls
5. Read documentation di `/docs` folder

## 🤝 Contributing

1. Create feature branch dari `main`
2. Commit changes dengan clear messages
3. Push ke branch
4. Create Pull Request
5. Wait for review

### Commit Message Convention

```
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📞 Support & Help

- **Documentation**: Check `/docs` folder
- **Email**: support@prodiplan.my.id
- **Issues**: Create issue di repository

## 🔄 Version History

### v2.0.0 (Current - January 2026)

- ✅ Full API implementation (19/19 endpoints)
- ✅ Password reset flow
- ✅ Enhanced profile management
- ✅ Statistics dashboard
- ✅ Session history management
- ✅ Comprehensive documentation

### v1.0.0 (Previous)

- Basic authentication
- Essay grading feature
- Simple profile page

## 📄 License

This project is part of the ProdiPlan platform.
© 2026 ProdiPlan. All rights reserved.

---

**Made with ❤️ by ProdiPlan Team**
