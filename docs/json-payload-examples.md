# JSON Payload Specification - Essay Grader API

Dokumentasi contoh JSON payload untuk Essay Grader Result endpoints.

---

## 📋 Daftar Endpoint

1. [GET /api/grading/sessions/{sessionId}](#1-get-apigradingsessionssessionid)
2. [GET /api/results/{sessionId}](#2-get-apiresultssessionid)
3. [Error Responses](#3-error-responses)

---

## 1. GET /api/grading/sessions/{sessionId}

### Request
```
GET /api/grading/sessions/{sessionId}
Authorization: Bearer {token}
Content-Type: application/json
```

### Response Example

```json
{
  "success": true,
  "data": {
    "id": "session_67890abcdef12345",
    "user_id": "user_12345abc",
    "target_major": "Teknik Informatika",
    "status": "completed",
    "current_score": 78,
    "threshold_score": 60,
    "question_count": 5,
    "max_questions": 5,
    "session_duration_minutes": 30,
    "started_at": "2024-12-30T10:00:00Z",
    "expires_at": "2024-12-30T10:30:00Z",
    "last_activity_at": "2024-12-30T10:25:00Z",
    "created_at": "2024-12-30T10:00:00Z"
  }
}
```

### Field Requirements

| Field | Type | Required | Validation | Keterangan |
|-------|------|----------|------------|------------|
| `success` | boolean | ✅ | `true` or `false` | Status response |
| `data.id` | string | ✅ | - | Unique session ID |
| `data.user_id` | string | ✅ | - | ID user |
| `data.target_major` | string | ✅ | - | Nama jurusan yang diuji |
| `data.status` | string | ✅ | `"active"` \| `"completed"` \| `"expired"` | Status session |
| `data.current_score` | number | ✅ | 0-100 | Skor akhir |
| `data.threshold_score` | number | ✅ | 0-100 | Skor minimum lulus |
| `data.question_count` | number | ✅ | ≥ 0 | Jumlah soal terjawab |
| `data.max_questions` | number | ✅ | ≥ 1 | Total soal maksimal |
| `data.session_duration_minutes` | number | ✅ | ≥ 1 | Durasi sesi (menit) |
| `data.started_at` | string | ✅ | ISO 8601 | Waktu mulai |
| `data.expires_at` | string | ✅ | ISO 8601 | Waktu expired |
| `data.last_activity_at` | string | ⚪ | ISO 8601 | Aktivitas terakhir |
| `data.created_at` | string | ✅ | ISO 8601 | Waktu dibuat |

---

## 2. GET /api/results/{sessionId}

### Request
```
GET /api/results/{sessionId}
Authorization: Bearer {token}
Content-Type: application/json
```

### Response Example (COMPLETE)

```json
{
  "success": true,
  "data": {
    "id": "result_abc123xyz789",
    "session_id": "session_67890abcdef12345",
    "final_score": 78,
    "readiness_level": "ready",
    "analysis_report": {
      "summary": "Anda menunjukkan kesiapan yang baik untuk Teknik Informatika dengan pemahaman konseptual yang solid. Motivasi dan ketertarikan Anda terhadap bidang ini sangat baik, namun perlu lebih banyak pengalaman praktis dalam programming.",
      
      "strengths": "Anda memiliki logical thinking dan analytical skills yang kuat, didukung dengan pemahaman matematis yang solid. Motivasi Anda untuk belajar sangat tinggi dan kemampuan problem solving sudah baik. Anda juga terlihat sebagai quick learner dengan kemampuan adaptasi yang cepat terhadap konsep-konsep baru.",
      
      "weaknesses": "Saat ini Anda masih kurang pengalaman dalam programming praktis dan perlu lebih banyak latihan coding. Pemahaman tentang framework modern masih terbatas dan portfolio project masih minim. Anda juga belum familiar dengan Git dan version control yang merupakan tools penting dalam development.",
      
      "recommendations": "Fokus belajar Python sebagai bahasa pertama untuk membangun fondasi yang kuat. Lakukan latihan coding rutin minimal 2-3 problems per hari di platform seperti LeetCode atau HackerRank. Buat portfolio project sederhana seperti calculator atau to-do list app untuk mengaplikasikan ilmu yang dipelajari. Ikuti course online gratis tentang data structures & algorithms seperti CS50 atau freeCodeCamp. Bergabunglah dengan komunitas programmer Indonesia di Discord atau Telegram untuk networking dan belajar bersama.",
      
      "key_insights": {
        "motivation_score": 85,
        "technical_understanding": 72,
        "career_alignment": 80
      },
      
      "personality_traits": {
        "analytical_thinking": "high",
        "problem_solving": "medium",
        "creativity": "medium"
      },
      
      "career_suggestions": [
        "Software Engineer",
        "Data Analyst",
        "Backend Developer",
        "DevOps Engineer",
        "Quality Assurance Engineer"
      ],
      
      "book_recommendations": [
        {
          "title": "Python Crash Course Edisi 3",
          "author": "Eric Matthes",
          "isbn": "978-1718502703",
          "cover_url": "https://images-na.ssl-images-amazon.com/images/I/81pn23z+LqL.jpg",
          "description": "Panduan komprehensif untuk belajar Python dari nol hingga membuat project nyata. Cocok untuk pemula yang ingin membangun fondasi programming yang kuat dengan hands-on projects.",
          "relevance_score": 9,
          "difficulty_level": "beginner",
          "topics": ["Python", "Programming Fundamentals", "Web Development"],
          "estimated_reading_time": "3-4 minggu",
          "purchase_links": {
            "tokopedia": "https://tokopedia.link/python-crash-course",
            "shopee": "https://shopee.co.id/python-crash-course",
            "gramedia": "https://gramedia.com/products/python-crash-course"
          }
        },
        {
          "title": "Algoritma dan Struktur Data",
          "author": "Rinaldi Munir",
          "isbn": "978-6023758340",
          "description": "Buku berbahasa Indonesia yang menjelaskan konsep fundamental algoritma dan struktur data dengan jelas, disertai pseudocode dan implementasi.",
          "relevance_score": 8,
          "difficulty_level": "intermediate",
          "topics": ["Algorithms", "Data Structures", "Problem Solving"],
          "estimated_reading_time": "4-6 minggu"
        },
        {
          "title": "Clean Code",
          "author": "Robert C. Martin",
          "description": "Panduan menulis kode yang bersih, maintainable, dan profesional. Essential reading untuk setiap programmer.",
          "relevance_score": 8,
          "difficulty_level": "intermediate",
          "topics": ["Best Practices", "Code Quality", "Software Engineering"],
          "estimated_reading_time": "4-5 minggu"
        }
      ],
      
      "learning_path": [
        {
          "phase": 1,
          "title": "Fondasi Pemrograman",
          "description": "Membangun dasar programming yang kuat dengan Python dan memahami konsep fundamental computer science.",
          "estimated_duration": "2-3 bulan",
          "skills_to_learn": [
            "Python basics (variables, loops, functions, classes)",
            "Git & GitHub fundamentals",
            "Basic data structures (arrays, lists, dictionaries)",
            "Problem solving fundamentals"
          ],
          "resources": [
            "Codecademy Python Course (gratis)",
            "freeCodeCamp Python tutorials (YouTube)",
            "LeetCode Easy problems",
            "Python Official Documentation"
          ],
          "milestones": [
            "Menyelesaikan 50+ coding problems di LeetCode",
            "Membuat 3 simple projects",
            "Memahami OOP concepts",
            "Familiar dengan Git untuk version control"
          ]
        },
        {
          "phase": 2,
          "title": "Pengembangan Skill Intermediate",
          "description": "Memperdalam pemahaman tentang algoritma, struktur data, dan mulai belajar web development.",
          "estimated_duration": "3-4 bulan",
          "skills_to_learn": [
            "Advanced data structures (trees, graphs, heaps)",
            "Common algorithms (sorting, searching, DP)",
            "Web development basics (HTML, CSS, JavaScript)",
            "Database fundamentals (SQL)"
          ],
          "resources": [
            "CS50 Web Programming (edX)",
            "The Odin Project",
            "LeetCode Medium problems",
            "W3Schools untuk web development"
          ],
          "milestones": [
            "Membuat full-stack web application sederhana",
            "Menyelesaikan 150+ total coding problems",
            "Memahami common algorithms",
            "Build portfolio dengan 2-3 web projects"
          ]
        },
        {
          "phase": 3,
          "title": "Spesialisasi & Portfolio Building",
          "description": "Fokus pada area spesifik dan membangun portfolio yang kuat untuk job market.",
          "estimated_duration": "3-6 bulan",
          "skills_to_learn": [
            "Framework modern (React/Django/Flask)",
            "Cloud basics (AWS/GCP)",
            "Testing & debugging",
            "System design fundamentals"
          ],
          "resources": [
            "Official framework documentation",
            "System Design Primer (GitHub)",
            "AWS/GCP free tier tutorials",
            "Open source contribution"
          ],
          "milestones": [
            "Membuat 2-3 production-ready projects",
            "Contribute to open source projects",
            "Deploy applications to cloud",
            "Siap untuk internship/junior developer role"
          ]
        }
      ],
      
      "action_plan": [
        {
          "priority": "high",
          "title": "Mulai belajar Python basics",
          "description": "Ikuti course Python di Codecademy atau freeCodeCamp. Fokus pada fundamental concepts seperti variables, data types, control flow, dan functions.",
          "timeframe": "2-3 minggu",
          "category": "study",
          "completed": false
        },
        {
          "priority": "high",
          "title": "Latihan coding rutin setiap hari",
          "description": "Selesaikan minimal 2-3 coding problems per hari di LeetCode atau HackerRank. Mulai dari Easy level.",
          "timeframe": "Ongoing",
          "category": "practice",
          "completed": false
        },
        {
          "priority": "high",
          "title": "Setup development environment",
          "description": "Install Python, VS Code, Git, dan setup GitHub account. Pelajari basic Git commands.",
          "timeframe": "1 minggu",
          "category": "study",
          "completed": false
        },
        {
          "priority": "medium",
          "title": "Buat project portfolio pertama",
          "description": "Pilih project sederhana seperti calculator atau to-do list app. Upload ke GitHub dengan README lengkap.",
          "timeframe": "1 bulan",
          "category": "project",
          "completed": false
        },
        {
          "priority": "medium",
          "title": "Join komunitas programmer",
          "description": "Gabung dengan komunitas Python Indonesia di Discord/Telegram. Aktif bertanya dan sharing knowledge.",
          "timeframe": "1-2 minggu",
          "category": "networking",
          "completed": false
        },
        {
          "priority": "low",
          "title": "Explore web development basics",
          "description": "Setelah comfortable dengan Python, mulai pelajari HTML, CSS, dan JavaScript basics.",
          "timeframe": "1 bulan",
          "category": "study",
          "completed": false
        }
      ],
      
      "industry_insights": {
        "job_market_demand": "high",
        "demand_description": "Permintaan untuk Software Engineer terus meningkat 15-20% per tahun di Indonesia. Transformasi digital pasca-pandemi membuat banyak perusahaan dari berbagai industri aktif mencari talent tech.",
        "average_salary_range": "Rp 6-12 juta/bulan",
        "salary_progression": {
          "entry_level": "Rp 5-8 juta (Fresh Graduate - 1 tahun)",
          "mid_level": "Rp 12-20 juta (3-5 tahun pengalaman)",
          "senior_level": "Rp 25-40 juta (7+ tahun pengalaman)"
        },
        "growth_potential": 9,
        "growth_description": "Industri teknologi Indonesia tumbuh sangat pesat dengan munculnya banyak startup unicorn dan decacorn. Peluang karir sangat luas mulai dari startup, corporate, hingga perusahaan multinasional.",
        "top_companies": [
          "Google Indonesia",
          "Tokopedia",
          "Gojek",
          "Shopee Indonesia",
          "Traveloka",
          "Bukalapak",
          "Grab Indonesia",
          "Microsoft Indonesia"
        ],
        "required_certifications": [
          "AWS Certified Developer",
          "Google Cloud Certified",
          "Oracle Certified Java Programmer"
        ],
        "skills_in_demand": [
          "Python",
          "JavaScript/TypeScript",
          "React.js",
          "Node.js",
          "Cloud Computing (AWS/GCP/Azure)",
          "Docker & Kubernetes",
          "System Design",
          "Git & CI/CD"
        ],
        "future_outlook": "Outlook sangat positif hingga 2030. Dengan transformasi digital yang masif di berbagai sektor, kebutuhan software engineer akan terus tinggi. Gaji dan benefit diprediksi terus meningkat."
      }
    },
    "created_at": "2024-12-30T10:30:00Z"
  }
}
```

### Field Requirements

#### ✅ REQUIRED Fields (Wajib Ada)

**Root Level:**
```
success           : boolean
data.id           : string
data.session_id   : string
data.final_score  : number (0-100)
data.readiness_level : "ready" | "not_ready" | "needs_improvement"
data.created_at   : string (ISO 8601)
```

**Analysis Report - Basic:**
```
summary           : string (min 50 chars)
strengths         : string (plain text paragraph, min 50 chars)
weaknesses        : string (plain text paragraph, min 50 chars)
recommendations   : string (plain text paragraph, min 100 chars)
```

**Key Insights (semua required, 0-100):**
```
motivation_score         : number
technical_understanding  : number
career_alignment        : number
```

**Personality Traits (semua required):**
```
analytical_thinking  : "high" | "medium" | "low"
problem_solving      : "high" | "medium" | "low"
creativity          : "high" | "medium" | "low"
```

**Arrays (semua required):**
```
career_suggestions      : array[string] - min 3 items
book_recommendations    : array[object] - min 3 items
learning_path          : array[object] - exactly 3 items (phase 1, 2, 3)
action_plan            : array[object] - min 5 items
```

**Industry Insights (semua required kecuali certifications):**
```
job_market_demand       : "high" | "medium" | "low"
demand_description      : string
average_salary_range    : string
salary_progression      : object { entry_level, mid_level, senior_level }
growth_potential        : number (1-10)
growth_description      : string
top_companies          : array[string] - min 5 items
skills_in_demand       : array[string] - min 5 items
future_outlook         : string
```

#### ⚪ OPTIONAL Fields (Boleh Kosong)

```
book_recommendations[].isbn
book_recommendations[].cover_url
book_recommendations[].purchase_links
industry_insights.required_certifications
action_plan[].completed
```

---

### Detailed Object Structures

#### 📚 book_recommendations (Array of Objects)

**Minimal 3 items, maksimal 6 items**

```json
{
  "title": "string - REQUIRED",
  "author": "string - REQUIRED",
  "description": "string - REQUIRED (min 50 chars)",
  "relevance_score": 9,
  "difficulty_level": "beginner",
  "topics": ["Topic1", "Topic2"],
  "estimated_reading_time": "string - REQUIRED",
  "isbn": "string - OPTIONAL",
  "cover_url": "string - OPTIONAL",
  "purchase_links": {
    "tokopedia": "string - OPTIONAL",
    "shopee": "string - OPTIONAL",
    "gramedia": "string - OPTIONAL"
  }
}
```

**Validation:**
- `relevance_score`: 1-10
- `difficulty_level`: `"beginner"` | `"intermediate"` | `"advanced"`
- `topics`: min 1 item
- Sort by `relevance_score` descending

---

#### 🛤️ learning_path (Array of Objects)

**Exactly 3 items (phase 1, 2, 3)**

```json
{
  "phase": 1,
  "title": "string - REQUIRED",
  "description": "string - REQUIRED",
  "estimated_duration": "string - REQUIRED",
  "skills_to_learn": ["skill1", "skill2"],
  "resources": ["resource1", "resource2"],
  "milestones": ["milestone1", "milestone2"]
}
```

**Validation:**
- `phase`: 1, 2, or 3 (sequential)
- All array fields: min 3 items
- Harus ada exactly 3 phases

---

#### ✅ action_plan (Array of Objects)

**Minimal 5 items**

```json
{
  "priority": "high",
  "title": "string - REQUIRED",
  "description": "string - REQUIRED",
  "timeframe": "string - REQUIRED",
  "category": "study",
  "completed": false
}
```

**Validation:**
- `priority`: `"high"` | `"medium"` | `"low"`
- `category`: `"study"` | `"practice"` | `"networking"` | `"certification"` | `"project"`
- `completed`: boolean (default: false)
- Sort by priority: high → medium → low

---

#### 💼 industry_insights (Object)

```json
{
  "job_market_demand": "high",
  "demand_description": "string - REQUIRED",
  "average_salary_range": "string - REQUIRED",
  "salary_progression": {
    "entry_level": "string - REQUIRED",
    "mid_level": "string - REQUIRED",
    "senior_level": "string - REQUIRED"
  },
  "growth_potential": 9,
  "growth_description": "string - REQUIRED",
  "top_companies": ["Company1", "Company2"],
  "required_certifications": ["Cert1", "Cert2"],
  "skills_in_demand": ["Skill1", "Skill2"],
  "future_outlook": "string - REQUIRED"
}
```

**Validation:**
- `job_market_demand`: `"high"` | `"medium"` | `"low"`
- `growth_potential`: 1-10
- `top_companies`: min 5 items
- `skills_in_demand`: min 5 items
- `required_certifications`: OPTIONAL (bisa empty array atau null)

---

## 3. Error Responses

### 3.1 Result Not Ready (200 OK)

Ketika AI masih processing hasil.

```json
{
  "success": false,
  "error": {
    "code": "RESULT_NOT_READY",
    "message": "Grading result is still being processed. Please try again in a few moments."
  }
}
```

Frontend akan auto-retry setiap 2 detik.

---

### 3.2 Session Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "The requested session does not exist or has been deleted."
  }
}
```

---

### 3.3 Unauthorized (403)

User coba akses session milik orang lain.

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You don't have permission to access this result."
  }
}
```

**Backend harus validate:**
- `session.user_id` sama dengan authenticated user ID
- `result.session_id` belongs to authenticated user

---

### 3.4 Invalid Token (401)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Authentication token is invalid or has expired."
  }
}
```

---

## 📝 Important Notes

### 1. String Formatting

**Strengths, Weaknesses, & Recommendations:**
- Format sebagai **plain text paragraphs** (teks biasa)
- Bukan bullet points atau numbered list
- Gunakan kalimat yang mengalir natural

```javascript
// ✅ Correct - Plain text paragraph
"Anda memiliki logical thinking yang kuat dan pemahaman matematis yang solid. Motivasi belajar Anda sangat tinggi dan kemampuan problem solving sudah baik."

// ❌ Wrong - Bullet points
"- Logical thinking kuat\n- Pemahaman matematis solid\n- Motivasi tinggi"

// ❌ Wrong - Numbered list
"1. Belajar Python\n2. Latihan coding\n3. Buat project"
```

### 2. Timestamp Format

**Gunakan ISO 8601:**
```javascript
"2024-12-30T10:30:00Z"  // ✅ Correct
"2024-12-30 10:30:00"   // ❌ Wrong
"30/12/2024"            // ❌ Wrong
```

Python example:
```python
from datetime import datetime
timestamp = datetime.utcnow().isoformat() + 'Z'
```

### 3. Bahasa & Tone

- Semua text dalam Bahasa Indonesia yang baik dan benar
- Tone: profesional, encouraging, supportive
- No typos, proper grammar
- Hindari technical jargon yang terlalu rumit

### 4. Data Consistency

- Jika `readiness_level` = `"ready"`, maka `final_score` biasanya ≥ 70
- Jika `readiness_level` = `"not_ready"`, maka `final_score` biasanya < 50
- `target_major` di session harus konsisten dengan recommendations

### 5. Performance Tips

- Cache hasil yang sudah complete (jangan re-generate)
- Gunakan background job untuk AI processing
- Return `RESULT_NOT_READY` jika masih processing
- Max processing time: 2-3 menit

---

## ✅ Validation Checklist

Before sending response, pastikan:

- [ ] Semua required fields ada
- [ ] Tidak ada null untuk required fields
- [ ] Scores antara 0-100
- [ ] Enums match exactly (case-sensitive)
- [ ] Timestamps dalam ISO 8601 format
- [ ] Arrays memenuhi min length
- [ ] `learning_path` exactly 3 items dengan phase 1, 2, 3
- [ ] Strings formatted dengan benar (\n separator)
- [ ] Bahasa Indonesia proper
- [ ] No typos

---

## 🧪 Test Commands

### Get Session
```bash
curl -X GET \
  'https://api.prodiplan.com/api/grading/sessions/session_123' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

### Get Result
```bash
curl -X GET \
  'https://api.prodiplan.com/api/results/session_123' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

### Validate Response
```bash
# Pretty print JSON
curl -s URL -H 'Authorization: Bearer TOKEN' | jq '.'

# Check array length
curl -s URL -H 'Authorization: Bearer TOKEN' | \
  jq '.data.analysis_report.book_recommendations | length'
```

---

**Version:** 2.1.0  
**Last Updated:** 2024-12-30  
**Contact:** ProdiPlan Frontend Team
