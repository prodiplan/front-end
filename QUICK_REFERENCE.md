# 📌 Quick Reference - File Locations & Key Code

## 📂 Key Files Location

### Pages

| File                                   | Purpose               | URL                    |
| -------------------------------------- | --------------------- | ---------------------- |
| `src/app/page.tsx`                     | Homepage              | `/`                    |
| `src/app/auth/page.tsx`                | Login/Register        | `/auth`                |
| `src/app/dashboard/page.tsx`           | Dashboard after login | `/dashboard`           |
| `src/app/essay-grader/page.tsx`        | Essay grader test     | `/essay-grader`        |
| `src/app/essay-grader/result/page.tsx` | Result analysis       | `/essay-grader/result` |

### Core Files

| File                                         | Purpose          |
| -------------------------------------------- | ---------------- |
| `src/middleware.ts`                          | Route protection |
| `src/app/layout.tsx`                         | Root layout      |
| `src/app/providers.tsx`                      | Root providers   |
| `src/components/providers/auth-provider.tsx` | Auth context     |

## 🔑 Key Components & Hooks

### useAuth() Hook

```typescript
import { useAuth } from "@/components/providers/auth-provider";

const { user, token, isLoading, login, register, logout } = useAuth();

// Properties:
// user: { id, email, full_name, dream_major, ... }
// token: JWT token string
// isLoading: boolean
// login(email, password): Promise<void>
// register(userData): Promise<void>
// logout(): void
```

### useRouter() Hook

```typescript
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/dashboard");
router.back();
```

## 📝 Code Snippets

### Check Authentication in Component

```typescript
useEffect(() => {
  if (!isLoading && !user) {
    router.push("/auth");
  }
}, [user, isLoading, router]);
```

### API Call Template

```typescript
try {
  const response = await fetch(`${API_URL}/endpoint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "Error occurred");
  }

  // Handle success
} catch (error) {
  toast.error(error instanceof Error ? error.message : "Unknown error");
  throw error;
}
```

### Toast Notifications

```typescript
import toast from "react-hot-toast";

toast.success("Success message");
toast.error("Error message");
toast.loading("Loading message");
```

### Framer Motion Animation

```typescript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

## 🎯 State Management

### Essay Grader Page State

```typescript
const [currentStep, setCurrentStep] = useState<"intro" | "test" | "loading">(
  "intro"
);
const [currentQuestion, setCurrentQuestion] = useState(1);
const [answers, setAnswers] = useState<{ [key: number]: string }>({});
const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
const [isSubmitting, setIsSubmitting] = useState(false);
```

## 🔐 Protected Routes

Routes that require authentication:

- `/dashboard/*` - Dashboard and subpages
- `/essay-grader/*` - Essay grader and results

Redirect behavior:

- Not logged in → redirect to `/auth`
- Already logged in → redirect to `/dashboard` when accessing `/auth`

## 📊 Data Structures

### User Object

```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  birth_date?: string;
  school_origin?: string;
  dream_major?: string;
  avatar_url?: string;
}
```

### Question Object

```typescript
interface Question {
  id: number;
  question: string;
  placeholder: string;
  tips: string;
}
```

### Analysis Result

```typescript
interface AnalysisResult {
  overall_score: number;
  readiness_level: "Siap" | "Cukup Siap" | "Perlu Persiapan";
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detailed_analysis: string;
}
```

## 🎨 Common CSS Classes

### Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">Click me</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Click me</button>

<!-- Disabled -->
<button class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
  Disabled
</button>
```

### Cards

```html
<!-- Basic Card -->
<div class="card p-6">Content</div>

<!-- Card with Hover -->
<div class="card card-hover p-6">Content</div>
```

### Input

```html
<!-- Text Input -->
<input type="text" class="input" placeholder="Enter text" />

<!-- Textarea -->
<textarea class="input resize-none" rows="8"></textarea>
```

### Badges

```html
<div
  class="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
>
  Badge
</div>
```

## 🚀 Common Tasks

### Add New Page

1. Create file: `src/app/[route]/page.tsx`
2. Add "use client" at top
3. Use useAuth() to check authentication
4. Import Navigation and Footer if needed
5. Add middleware entry if protected route

### Add New API Call

1. Get token from useAuth()
2. Use try-catch for error handling
3. Add toast notifications
4. Handle loading state
5. Update component state with result

### Add Animation

1. Import { motion } from "framer-motion"
2. Wrap component with motion.div
3. Add initial, animate, transition
4. Use containerVariants for lists

### Add Toast Notification

```typescript
import toast from "react-hot-toast";

toast.success("Success!");
toast.error("Error!");
toast.loading("Loading...");
```

## 🔧 Environment Setup

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Start Development

```bash
npm run dev
# Server runs on http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

### Lint & Format

```bash
npm run lint
npx prettier --write .
```

## 📚 Documentation Files

- `ESSAY_GRADER_DOCUMENTATION.md` - Complete feature documentation
- `ESSAY_GRADER_QUICKSTART.md` - Quick start guide
- `COMPONENT_ARCHITECTURE.md` - Component structure & diagrams
- `BACKEND_INTEGRATION_GUIDE.md` - API integration guide
- `IMPLEMENTATION_CHECKLIST.md` - Task checklist
- `QUICK_REFERENCE.md` - This file

## 🆘 Troubleshooting

### Port 3000 already in use

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess) | Stop-Process -Force
```

### Module not found

```bash
npm install
rm -rf .next
npm run dev
```

### Build errors

```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting issues
```

### Clear Next.js cache

```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📞 Support

For questions or issues:

1. Check the documentation files
2. Review the component code
3. Check browser console for errors
4. Contact team lead

---

**Quick Links**

- 📖 Full Docs: `ESSAY_GRADER_DOCUMENTATION.md`
- 🚀 Quick Start: `ESSAY_GRADER_QUICKSTART.md`
- 🏗️ Architecture: `COMPONENT_ARCHITECTURE.md`
- 🔌 API Guide: `BACKEND_INTEGRATION_GUIDE.md`
- ✅ Checklist: `IMPLEMENTATION_CHECKLIST.md`

**Last Updated**: November 1, 2025
