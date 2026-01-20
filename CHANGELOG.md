# Changelog

All notable changes to the ProdiPlan Frontend project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-01-20

### 🎉 Major Release - Full API Implementation

This release implements all endpoints from the API documentation and adds comprehensive user features.

### Added

#### Authentication

- ✨ Forgot password page (`/auth/forgot-password`)
- ✨ Reset password page (`/auth/reset-password`)
- ✨ Password reset email flow with oobCode validation
- ✨ Password strength validation (8+ chars, uppercase, lowercase, numbers)
- ✨ Link to forgot password from login page

#### Profile Management

- ✨ Enhanced profile page with tabbed interface (`/profile/enhanced`)
- ✨ Profile settings component with edit functionality
- ✨ Delete account feature with password confirmation
- ✨ Statistics dashboard component
- ✨ Session history management component
- ✨ Filter sessions by status (all/active/completed/expired)

#### Session Management

- ✨ Delete session functionality
- ✨ Continue active sessions from history
- ✨ View detailed results from completed sessions

#### API Integration

- ✨ `deleteSession` service method
- ✨ `getStatistics` service method
- ✨ `GradingStatistics` TypeScript interface

#### Documentation

- ✨ USER-GUIDE.md - Comprehensive user guide
- ✨ DEVELOPER-GUIDE.md - Developer documentation
- ✨ IMPLEMENTATION-SUMMARY.md - Quick reference
- ✨ Updated README.md with full feature list

### Changed

#### API Endpoints

- 🔄 Updated all API endpoints to use `/v1` prefix
  - `/auth/*` → `/v1/auth/*`
  - `/grading-sessions/*` → `/v1/grading-sessions/*`
  - `/grading-results/*` → `/v1/grading-results/*`

#### UI/UX Improvements

- 🎨 Consistent glassmorphism design across all pages
- 🎨 Enhanced modal designs with better animations
- 🎨 Improved form validation and error messages
- 🎨 Better loading states and skeletons

### Fixed

- 🐛 Type safety improvements across all components
- 🐛 Consistent error handling in all API calls
- 🐛 Proper cleanup on component unmount

### Security

- 🔒 Password confirmation for account deletion
- 🔒 Secure token handling in delete operations
- 🔒 Input validation on all forms

---

## [1.0.0] - 2025-12-XX

### Initial Release

#### Features

- 🎯 User authentication (register, login, logout)
- 🎯 Dashboard page
- 🎯 Essay grader with AI integration
- 🎯 Basic profile page
- 🎯 Session creation and management
- 🎯 Result viewing

#### Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Query
- Framer Motion

---

## API Endpoint Implementation Status

### v2.0.0 - All Endpoints Implemented ✅

| Category         | Implemented | Total  | Percentage  |
| ---------------- | ----------- | ------ | ----------- |
| Authentication   | 9           | 9      | 100% ✅     |
| Grading Sessions | 7           | 7      | 100% ✅     |
| Grading Results  | 3           | 3      | 100% ✅     |
| **TOTAL**        | **19**      | **19** | **100%** ✅ |

### Detailed Breakdown

#### Authentication Endpoints (9/9)

- [x] POST `/v1/auth/register`
- [x] POST `/v1/auth/login`
- [x] GET `/v1/auth/me`
- [x] POST `/v1/auth/refresh`
- [x] PATCH `/v1/auth/profile`
- [x] DELETE `/v1/auth/user`
- [x] POST `/v1/auth/logout`
- [x] POST `/v1/auth/forgot-password`
- [x] POST `/v1/auth/reset-password`

#### Grading Sessions Endpoints (7/7)

- [x] POST `/v1/grading-sessions`
- [x] GET `/v1/grading-sessions`
- [x] GET `/v1/grading-sessions/:id`
- [x] POST `/v1/grading-sessions/:id/complete`
- [x] DELETE `/v1/grading-sessions/:id`
- [x] POST `/v1/grading-sessions/:id/messages`
- [x] GET `/v1/grading-sessions/:id/messages`

#### Grading Results Endpoints (3/3)

- [x] GET `/v1/grading-results/:session_id`
- [x] GET `/v1/grading-results`
- [x] GET `/v1/grading-results/statistics`

---

## Breaking Changes

### v2.0.0

#### API Endpoints

All API endpoints now require `/v1` prefix. If you have any custom integrations or bookmarks, please update them:

**Old Format:**

```
/auth/login
/grading-sessions
```

**New Format:**

```
/v1/auth/login
/v1/grading-sessions
```

#### Type Definitions

New interface `GradingStatistics` added. Update your imports if you're using type definitions:

```typescript
import { GradingStatistics } from "@/types";
```

---

## Migration Guide

### From v1.0.0 to v2.0.0

1. **Pull latest changes**

   ```bash
   git pull origin main
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Update environment variables** (if needed)
   - No changes required for default setup
   - API_URL remains the same

4. **Clear cache and rebuild**

   ```bash
   rm -rf .next
   pnpm build
   ```

5. **Test critical flows**
   - Login/Register
   - Create session
   - View profile
   - Delete session (new feature)

6. **Update bookmarks** (for users)
   - Profile page: Use `/profile/enhanced` for better experience
   - Old `/profile` still works but consider using enhanced version

---

## Known Issues

### v2.0.0

- None reported yet

### v1.0.0

- ✅ FIXED: Missing password reset flow
- ✅ FIXED: No way to delete sessions
- ✅ FIXED: Limited profile management options
- ✅ FIXED: No statistics dashboard

---

## Upcoming Features (Roadmap)

### v2.1.0 (Planned)

- [ ] Email verification flow
- [ ] Social media login (Google, Facebook)
- [ ] Advanced filtering in session history
- [ ] Export results to PDF
- [ ] Bookmark favorite results

### v2.2.0 (Planned)

- [ ] Dark mode support
- [ ] Multi-language support (ID/EN)
- [ ] Notification system
- [ ] Achievement badges
- [ ] Progress tracking

### v3.0.0 (Future)

- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] AI chatbot assistant

---

## Contributors

- ProdiPlan Development Team

## Support

For questions or issues:

- Email: support@prodiplan.my.id
- Documentation: `/docs` folder
- Create issue in repository

---

**Last Updated**: January 20, 2026
