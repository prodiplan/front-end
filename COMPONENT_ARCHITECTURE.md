# 🎨 Component Architecture & Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Root Layout (RootLayout)                 │
│  - HTML structure                                            │
│  - Global providers setup                                    │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          │                                       │
    ┌─────▼──────┐                         ┌─────▼──────┐
    │  Providers │                         │  Toaster   │
    │  (Auth,    │                         │  (Toast    │
    │   Query)   │                         │   msgs)    │
    └─────┬──────┘                         └────────────┘
          │
    ┌─────▼─────────────────────────────────────────┐
    │  All Pages & Components                       │
    └─────┬─────────────────────────────────────────┘
          │
    ┌─────┴────────┬──────────────┬─────────────────┐
    │              │              │                 │
    ▼              ▼              ▼                 ▼
┌─────────┐  ┌──────────────┐  ┌─────────┐  ┌─────────────┐
│Homepage │  │Auth Page     │  │Dashboard│  │Essay Grader │
│         │  │(Login/Reg)   │  │         │  │  Pages      │
└────┬────┘  └──────┬───────┘  └────┬────┘  └─────┬───────┘
     │             │              │            │
     │      ┌──────▼──────┐      │    ┌────────┴────────────┐
     │      │Protected by │      │    │                    │
     │      │Middleware   │      │    ▼                    ▼
     │      │ - Token     │      │ ┌────────┐        ┌──────────┐
     │      │ - Cookies   │      │ │Intro   │        │Test      │
     │      └─────────────┘      │ │Screen  │        │Screen    │
     │                           │ └────────┘        └──────┬───┘
     └──────────┬────────────────┘                        │
                │                                   ┌──────▼──────┐
                │                                   │Loading      │
                │                                   │Screen       │
                │                                   └──────┬──────┘
                │                                        │
                │                    ┌───────────────────┘
                │                    │
                └────────────────────┴───────────────────┐
                                      │
                              ┌───────▼────────┐
                              │ Result Page    │
                              │ (Analysis)     │
                              └────────────────┘
```

## Page Flow Diagram

```
┌─────────────┐
│  Homepage   │  (Public)
│   page.tsx  │
└──────┬──────┘
       │ "Mulai Gratis" or
       │ "Login"
       │
       ▼
┌──────────────────┐
│   Auth Page      │  (Public)
│   auth/page.tsx  │
│                  │
│ - Login Form     │
│ - Register Form  │
│ - Demo Account   │
└────────┬─────────┘
         │ Success Login/Register
         │
         ▼
┌──────────────────────┐
│   Dashboard Page     │  (Protected ⛔)
│   dashboard/page.tsx │
│                      │
│ - Greeting           │
│ - Platform Info      │
│ - CTA Button         │
└──────────┬───────────┘
           │ "Mulai Test Sekarang"
           │
           ▼
┌──────────────────────────┐
│  Essay Grader Main Page  │  (Protected ⛔)
│  essay-grader/page.tsx   │
│                          │
│ - Intro Screen           │
│ - Test Screen            │
│ - Loading Screen         │
└──────────┬───────────────┘
           │ Submit Test
           │
           ▼
┌──────────────────────────┐
│   Result Page            │  (Protected ⛔)
│   essay-grader/result/   │  page.tsx
│                          │
│ - Overall Score          │
│ - Readiness Level        │
│ - Strengths              │
│ - Weaknesses             │
│ - Recommendations        │
└──────────┬───────────────┘
           │ Back to Dashboard
           │
           └──────────────┐
                          │
                          ▼
                   (Kembali ke Dashboard)
```

## Component Hierarchy

### Dashboard Page

```
DashboardPage
├── Navigation (existing)
├── Hero Section
│   ├── Badge (greeting)
│   ├── SplitText (title)
│   ├── SplitText (subtitle)
│   └── CTA Button → /essay-grader
├── Features Section
│   └── Feature Cards (3x)
├── How It Works Section
│   └── Step Cards (4x)
├── CTA Section
│   └── Call-to-Action Button
└── Footer (existing)
```

### Essay Grader Page

```
EssayGraderPage
├── IntroScreen
│   ├── Header
│   ├── Welcome Card
│   │   ├── Gradient Header
│   │   ├── About Section
│   │   ├── Tips Section
│   │   ├── User Info Box
│   │   └── Action Buttons
│   └── Footer
├── TestScreen
│   ├── Header with Timer
│   │   ├── Question Counter
│   │   ├── Clock Icon + Time
│   │   └── Progress Bar
│   ├── Question Card
│   │   ├── Question Badge
│   │   ├── Question Title
│   │   ├── Tips Box
│   │   ├── TextArea
│   │   ├── Character Counter
│   │   └── Warning (if < 100 chars)
│   └── Navigation
│       ├── Previous Button
│       ├── Question Indicators (dots)
│       └── Next/Submit Button
└── LoadingScreen
    ├── Rotating Icon
    ├── Title
    ├── Description
    └── Loading Dots
```

### Result Page

```
ResultPage
├── Header
├── Main Container
│   ├── Score Card (Gradient)
│   │   ├── Title
│   │   ├── Score Circle
│   │   ├── Readiness Level
│   │   └── Quote
│   ├── Strengths Section
│   │   └── Strength Cards (4x)
│   ├── Weaknesses Section
│   │   └── Weakness Cards (3x)
│   ├── Recommendations Section
│   │   └── Recommendation Items (5x)
│   ├── Action Buttons
│   └── Info Box
└── Footer (implied)
```

## State Management Flow

```
┌─────────────────────────────────┐
│   EssayGraderPage Component     │
└──────────────┬──────────────────┘
               │
     ┌─────────┼─────────┐
     │         │         │
     ▼         ▼         ▼
┌─────────┐ ┌──────────┐ ┌──────────┐
│currentStep
│ - intro
│ - test
│ - loading
└─────────┘

└──────────┐ └──────────┐
           │           │
    ┌──────▼────┐  ┌──────▼─────┐
    │current    │  │answers{}   │
    │Question   │  │{           │
    │ (1-5)     │  │  1: "text" │
    │           │  │  2: "text" │
    │           │  │  ...       │
    │           │  │}           │
    └───────────┘  └────────────┘

┌─────────────────────────────────┐
│ useEffect Hooks                 │
├─────────────────────────────────┤
│ 1. Check auth (redirect if not) │
│ 2. Timer countdown (every 1s)   │
│ 3. Auto-submit on time out      │
└─────────────────────────────────┘
```

## Data Structure

### Question Object

```typescript
interface Question {
  id: number; // 1-5
  question: string; // Main question text
  placeholder: string; // TextArea placeholder
  tips: string; // Tips for answering
}
```

### Answers Storage

```typescript
const answers = {
  1: "User's answer to question 1...",
  2: "User's answer to question 2...",
  3: "User's answer to question 3...",
  4: "User's answer to question 4...",
  5: "User's answer to question 5...",
};
```

### Analysis Result

```typescript
interface AnalysisResult {
  overall_score: number; // 0-100
  readiness_level: string; // "Siap" | "Cukup Siap" | "Perlu Persiapan"
  strengths: string[]; // 4 items
  weaknesses: string[]; // 3 items
  recommendations: string[]; // 5 items
  detailed_analysis: string; // Long text
}
```

## Styling System

### Colors Used

```
Primary:      #3b82f6 (Blue)
Secondary:    #818cf8 (Indigo)
Success:      #22c55e (Green)
Warning:      #eab308 (Yellow)
Error:        #ef4444 (Red)
Neutral:      #000000 - #ffffff grayscale

Backgrounds:
- Primary 50:    #eff6ff
- Secondary 50:  #eef2ff
- Green 50:      #f0fdf4
- Yellow 50:     #fefce8
```

### Typography

```
H1: text-4xl md:text-6xl lg:text-7xl font-bold
H2: text-2xl md:text-4xl font-bold
H3: text-xl font-semibold
Body: text-base font-regular
Small: text-sm font-regular
Mono: font-mono (for timer)
```

### Spacing

```
Padding: px-4 sm:px-6 lg:px-8
Gap: gap-4, gap-6, gap-8
Margin: mb-4, mb-6, mb-8, mt-4, etc
Container: max-w-7xl mx-auto
```

## Animation Patterns

### Framer Motion Variants

```typescript
// Container animations
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
}

// Item animations
itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

// Button hover
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Animations Timing

```
SplitText animations:   1-3 seconds (staggered)
Page transitions:        0.4-0.6 seconds
Button interactions:     0.2-0.3 seconds
Loading spinner:        2 seconds loop
Progress bar:           0.5 seconds
```

## Responsive Breakpoints

```
Mobile:     < 640px (default)
Tablet:     640px - 1024px (sm, md)
Desktop:    > 1024px (lg)

TailwindCSS prefixes:
- sm: @media (min-width: 640px)
- md: @media (min-width: 768px)
- lg: @media (min-width: 1024px)
```

## Component Reusability

### Components to Enhance

1. **SplitText** - Used for animated titles
2. **Button** - Primary & Secondary variants
3. **Card** - Container for content blocks

### New Components (Potential)

1. **QuestionCard** - Extracted from test screen
2. **ResultCard** - Extracted from result page
3. **FeatureCard** - Extracted from dashboard
4. **StepCard** - Extracted from how-it-works

## Performance Considerations

### Code Splitting

- Each page is lazy-loaded
- CSS is minified
- Images optimized (use next/image when possible)

### Re-render Optimization

- useCallback for event handlers
- useMemo for expensive calculations
- Avoid inline object creation

### Bundle Size

- Framer Motion: ~40kb
- React Hot Toast: ~5kb
- Heroicons: ~20kb
- Tailwind CSS: ~30kb (purged)

---

**Version**: 1.0.0  
**Last Updated**: November 1, 2025
