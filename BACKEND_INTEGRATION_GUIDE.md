# 🔌 Backend Integration Guide

## API Integration Points

### 1. Test Submission Endpoint

**Current Status**: ⏳ Simulated (2 second delay)  
**Location**: `src/app/essay-grader/page.tsx` line ~150

#### Expected API Response

```typescript
// Request
POST /api/essay-grader/submit
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
Body: {
  answers: {
    1: "Answer to question 1",
    2: "Answer to question 2",
    3: "Answer to question 3",
    4: "Answer to question 4",
    5: "Answer to question 5"
  },
  major_id?: number,
  user_id?: number
}

// Response (Success - 200)
{
  success: true,
  data: {
    test_id: "uuid-here",
    analysis: {
      overall_score: 82,
      readiness_level: "Siap",
      strengths: [...],
      weaknesses: [...],
      recommendations: [...],
      detailed_analysis: "..."
    }
  }
}

// Response (Error - 400/500)
{
  success: false,
  error: {
    message: "Error message",
    code: "ERROR_CODE"
  }
}
```

#### How to Integrate

Replace the mock setTimeout in `handleSubmitTest()`:

**Before** (Current):

```typescript
const handleSubmitTest = async () => {
  setIsSubmitting(true);
  setCurrentStep("loading");
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push("/essay-grader/result");
  } catch (error) {
    console.error("Error submitting test:", error);
    setCurrentStep("test");
    setIsSubmitting(false);
  }
};
```

**After** (With API):

```typescript
const handleSubmitTest = async () => {
  setIsSubmitting(true);
  setCurrentStep("loading");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/essay-grader/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // from useAuth()
        },
        body: JSON.stringify({
          answers,
          major_id: user.dream_major_id, // if available
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || "Failed to submit test");
    }

    // Save result to context or local storage if needed
    localStorage.setItem("lastTestResult", JSON.stringify(data.data.analysis));

    router.push("/essay-grader/result");
  } catch (error) {
    console.error("Error submitting test:", error);
    toast.error("Gagal mengirim jawaban. Silakan coba lagi.");
    setCurrentStep("test");
    setIsSubmitting(false);
  }
};
```

### 2. Fetch Analysis Result

**Current Status**: 🎭 Using mock data  
**Location**: `src/app/essay-grader/result/page.tsx` line ~13

#### How to Integrate

**Option A: Get from submission response (Recommended)**

```typescript
// Store result from submission
const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
  null
);

// After successful submission:
setAnalysisResult(data.data.analysis);
router.push("/essay-grader/result", { state: { result: analysisResult } });
```

**Option B: Fetch from test ID**

```typescript
// Get test ID from URL params
const searchParams = useSearchParams();
const testId = searchParams.get("testId");

useEffect(() => {
  const fetchResult = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/essay-grader/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAnalysisResult(data.data);
    } catch (error) {
      console.error("Error fetching result:", error);
    }
  };

  if (testId) {
    fetchResult();
  }
}, [testId, token]);
```

### 3. Get Test History

**Current Status**: ❌ Not implemented  
**Target Location**: Future dashboard enhancement

```typescript
// New page: src/app/dashboard/history/page.tsx
const fetchTestHistory = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/essay-grader/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    // data.data = [{ test_id, date, score, readiness_level }, ...]
    setTestHistory(data.data);
  } catch (error) {
    console.error("Error fetching history:", error);
  }
};
```

### 4. Download Report

**Current Status**: ⏳ Button exists but no function  
**Location**: `src/app/essay-grader/result/page.tsx` line ~360

```typescript
// Add to result page
const handleDownloadReport = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/essay-grader/report/${testId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download report");
    }

    // Create blob from response
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-result-${testId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading report:", error);
    toast.error("Gagal mengunduh laporan");
  }
};
```

## Environment Variables

Add to `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
# For production:
# NEXT_PUBLIC_API_URL=https://api.prodiplan.id
```

## Error Handling Patterns

### Global Error Handler

```typescript
// Create: src/lib/api.ts
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

// Usage:
try {
  const result = await apiCall(
    "/api/essay-grader/submit",
    {
      method: "POST",
      body: JSON.stringify({ answers }),
    },
    token
  );
} catch (error) {
  toast.error(error.message);
}
```

### Toast Notifications

```typescript
import toast from "react-hot-toast";

// Success
toast.success("Test berhasil dikirim!");

// Error
toast.error("Gagal mengirim test. Silakan coba lagi.");

// Loading
const toastId = toast.loading("Menganalisis...");
// Later:
toast.success("Selesai!", { id: toastId });
```

## Testing the Integration

### 1. Using Postman/Insomnia

```
POST http://localhost:3001/api/essay-grader/submit
Headers:
  Content-Type: application/json
  Authorization: Bearer {token}

Body:
{
  "answers": {
    "1": "Sample answer 1",
    "2": "Sample answer 2",
    "3": "Sample answer 3",
    "4": "Sample answer 4",
    "5": "Sample answer 5"
  }
}
```

### 2. Using Browser DevTools

```javascript
// Open browser console and run:
fetch("http://localhost:3001/api/essay-grader/submit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
  body: JSON.stringify({
    answers: {
      1: "Test answer 1",
      2: "Test answer 2",
      3: "Test answer 3",
      4: "Test answer 4",
      5: "Test answer 5",
    },
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

### 3. Unit Testing

```typescript
// Create: src/__tests__/essay-grader.test.ts
import { render, screen, fireEvent } from "@testing-library/react";
import EssayGraderPage from "@/app/essay-grader/page";

describe("Essay Grader", () => {
  it("should submit answers to API", async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { test_id: "123", analysis: {...} }
        })
      })
    );

    render(<EssayGraderPage />);
    // Test logic
  });
});
```

## Database Schema (Backend)

### Table: essay_tests

```sql
CREATE TABLE essay_tests (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL FOREIGN KEY,
  major_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  status ENUM('completed', 'in_progress', 'abandoned'),
  time_taken INT, -- seconds
  INDEX (user_id),
  INDEX (created_at)
);
```

### Table: essay_answers

```sql
CREATE TABLE essay_answers (
  id UUID PRIMARY KEY,
  test_id UUID NOT NULL FOREIGN KEY,
  question_number INT (1-5),
  answer_text TEXT NOT NULL,
  character_count INT,
  created_at TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES essay_tests(id)
);
```

### Table: essay_analysis

```sql
CREATE TABLE essay_analysis (
  id UUID PRIMARY KEY,
  test_id UUID NOT NULL UNIQUE FOREIGN KEY,
  overall_score INT (0-100),
  readiness_level ENUM('Siap', 'Cukup Siap', 'Perlu Persiapan'),
  strengths JSON,
  weaknesses JSON,
  recommendations JSON,
  detailed_analysis TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES essay_tests(id)
);
```

## Deployment Checklist

- [ ] Update environment variables for production
- [ ] Test all API endpoints
- [ ] Setup error logging (Sentry/LogRocket)
- [ ] Configure CORS for backend
- [ ] Setup database backups
- [ ] Configure CDN for assets
- [ ] Setup monitoring and alerts
- [ ] Test on staging environment
- [ ] Load testing
- [ ] Security audit

## Monitoring & Logging

### What to Log

```typescript
// API Success
console.log("Test submitted", {
  testId,
  userId,
  timestamp,
});

// API Error
console.error("Submit failed", {
  error,
  userId,
  answers: sanitized_answers,
});

// User Action
console.log("User event", {
  event: "test_started",
  userId,
  question: currentQuestion,
});
```

### Key Metrics to Track

- Average test completion time
- Score distribution
- Most common strengths/weaknesses
- API response times
- Error rates
- User retention

---

**Integration Status**: Ready for Backend Development  
**Last Updated**: November 1, 2025  
**Next Step**: Implement backend endpoints
