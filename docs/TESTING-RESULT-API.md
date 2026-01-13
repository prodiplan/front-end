# 🧪 Cara Test API Result Page

Panduan untuk test API result page setelah backend selesai konfigurasi.

---

## 📋 Checklist Persiapan

Sebelum test, pastikan:
- [ ] Backend sudah running di `http://localhost:4000` atau `https://prodiplan.my.id`
- [ ] Anda sudah punya akun dan login
- [ ] Sudah ada minimal 1 grading session yang completed

---

## 🔧 Method 1: Test Langsung di Browser

### Langkah 1: Login dan Dapatkan Token

1. Buka browser dan login ke aplikasi
2. Buka DevTools (F12)
3. Pergi ke **Application** > **Local Storage**
4. Copy value dari key `token`

### Langkah 2: Dapatkan Session ID

1. Pergi ke `/profile`
2. Klik salah satu assessment yang sudah completed
3. Copy session ID dari URL: `/profile/result/[SESSION_ID]`
4. Atau lihat di list grading sessions

### Langkah 3: Test API dengan Browser DevTools

Buka **Console** di DevTools, lalu jalankan:

```javascript
// GANTI INI DENGAN DATA ANDA
const token = 'YOUR_TOKEN_HERE';
const sessionId = 'YOUR_SESSION_ID_HERE';
const baseUrl = 'http://localhost:4000'; // atau https://prodiplan.my.id

// Test 1: Get Session
fetch(`${baseUrl}/grading-sessions/${sessionId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('=== SESSION DATA ===');
  console.log(data);
})
.catch(err => console.error('Error:', err));

// Test 2: Get Result
fetch(`${baseUrl}/grading-results/${sessionId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('=== RESULT DATA ===');
  console.log(data);
  
  // Validate structure
  if (data.success && data.data) {
    const result = data.data;
    const report = result.analysis_report;
    
    console.log('\n📊 Validation:');
    console.log('✅ Final Score:', result.final_score);
    console.log('✅ Readiness Level:', result.readiness_level);
    console.log('✅ Summary:', report.summary ? 'OK' : 'MISSING');
    console.log('✅ Strengths (plain text):', typeof report.strengths === 'string' ? 'OK' : 'WRONG FORMAT');
    console.log('✅ Weaknesses (plain text):', typeof report.weaknesses === 'string' ? 'OK' : 'WRONG FORMAT');
    console.log('✅ Recommendations (plain text):', typeof report.recommendations === 'string' ? 'OK' : 'WRONG FORMAT');
    console.log('✅ Book Recommendations:', report.book_recommendations?.length || 0, 'items');
    console.log('✅ Learning Path:', report.learning_path?.length || 0, 'phases');
    console.log('✅ Action Plan:', report.action_plan?.length || 0, 'items');
    console.log('✅ Industry Insights:', report.industry_insights ? 'OK' : 'MISSING');
  }
})
.catch(err => console.error('Error:', err));
```

---

## 🔧 Method 2: Test dengan Node Script

### Langkah 1: Edit Script

Buka file `test-result-api.js` dan ganti:

```javascript
const TOKEN = 'paste_token_anda_di_sini';
const SESSION_ID = 'paste_session_id_di_sini';
```

### Langkah 2: Run Script

```bash
node test-result-api.js
```

Output akan menampilkan:
- ✅ Session data
- ✅ Result data
- ✅ Validation checks
- 📊 Summary

---

## 🔧 Method 3: Test dengan cURL

### Test Get Session

```bash
curl -X GET \
  'http://localhost:4000/grading-sessions/YOUR_SESSION_ID' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  | jq '.'
```

### Test Get Result

```bash
curl -X GET \
  'http://localhost:4000/grading-results/YOUR_SESSION_ID' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  | jq '.'
```

### Validate Specific Fields

```bash
# Check if strengths is plain text
curl -s -X GET \
  'http://localhost:4000/grading-results/YOUR_SESSION_ID' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  | jq '.data.analysis_report.strengths | type'
# Expected: "string"

# Count book recommendations
curl -s -X GET \
  'http://localhost:4000/grading-results/YOUR_SESSION_ID' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  | jq '.data.analysis_report.book_recommendations | length'
# Expected: >= 3

# Count learning path phases
curl -s -X GET \
  'http://localhost:4000/grading-results/YOUR_SESSION_ID' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  | jq '.data.analysis_report.learning_path | length'
# Expected: exactly 3
```

---

## ✅ Checklist Validasi

### 1. Session Endpoint (`/grading-sessions/{sessionId}`)

Response harus punya:
- [ ] `success: true`
- [ ] `data.id` (string)
- [ ] `data.target_major` (string)
- [ ] `data.status` ("completed")
- [ ] `data.current_score` (number 0-100)
- [ ] `data.created_at` (ISO 8601 timestamp)

### 2. Result Endpoint (`/grading-results/{sessionId}`)

**Root Level:**
- [ ] `success: true`
- [ ] `data.final_score` (number 0-100)
- [ ] `data.readiness_level` ("ready" | "not_ready" | "needs_improvement")
- [ ] `data.created_at` (ISO 8601)

**Analysis Report - Basic:**
- [ ] `summary` (string, min 50 chars)
- [ ] `strengths` (plain text string, min 50 chars, BUKAN array)
- [ ] `weaknesses` (plain text string, min 50 chars, BUKAN array)
- [ ] `recommendations` (plain text string, min 100 chars, BUKAN array)

**Key Insights:**
- [ ] `motivation_score` (number 0-100)
- [ ] `technical_understanding` (number 0-100)
- [ ] `career_alignment` (number 0-100)

**Personality Traits:**
- [ ] `analytical_thinking` ("high" | "medium" | "low")
- [ ] `problem_solving` ("high" | "medium" | "low")
- [ ] `creativity` ("high" | "medium" | "low")

**Arrays:**
- [ ] `career_suggestions` (array, min 3 items)
- [ ] `book_recommendations` (array, min 3 items)
  - [ ] Each has: title, author, description, relevance_score, difficulty_level, topics, estimated_reading_time
- [ ] `learning_path` (array, exactly 3 items)
  - [ ] Each has: phase (1,2,3), title, description, estimated_duration, skills_to_learn, resources, milestones
- [ ] `action_plan` (array, min 5 items)
  - [ ] Each has: priority, title, description, timeframe, category

**Industry Insights:**
- [ ] `job_market_demand` ("high" | "medium" | "low")
- [ ] `demand_description` (string)
- [ ] `average_salary_range` (string)
- [ ] `salary_progression` (object with entry_level, mid_level, senior_level)
- [ ] `growth_potential` (number 1-10)
- [ ] `growth_description` (string)
- [ ] `top_companies` (array, min 5 items)
- [ ] `skills_in_demand` (array, min 5 items)
- [ ] `future_outlook` (string)

---

## 🐛 Troubleshooting

### ❌ Error: "RESULT_NOT_READY"

**Penyebab:** AI masih processing hasil
**Solusi:** Tunggu beberapa detik lalu coba lagi

---

### ❌ Error: "SESSION_NOT_FOUND"

**Penyebab:** Session ID tidak valid atau tidak ada
**Solusi:** 
1. Pastikan session ID benar
2. Cek di `/profile` apakah session ada
3. Pastikan session status = "completed"

---

### ❌ Error: "UNAUTHORIZED"

**Penyebab:** Token invalid atau session bukan milik user
**Solusi:**
1. Refresh token (login ulang)
2. Pastikan session ID milik user yang login

---

### ❌ Error: Field "strengths" is array instead of string

**Penyebab:** Backend masih return format lama (array)
**Solusi:** Backend harus update untuk return plain text:

```javascript
// ❌ Wrong
"strengths": ["Item 1", "Item 2", "Item 3"]

// ✅ Correct
"strengths": "Anda memiliki logical thinking yang kuat dan pemahaman matematis yang solid. Motivasi belajar sangat tinggi..."
```

---

### ❌ Page shows "Data tidak lengkap"

**Penyebab:** Ada required field yang missing
**Solusi:** 
1. Cek console browser untuk error detail
2. Lihat network tab untuk response API
3. Bandingkan dengan checklist validasi di atas

---

## 📝 Test Report Template

Copy template ini untuk report hasil test:

```markdown
## Test Result Report

**Tested by:** [Your Name]
**Date:** [Date]
**Backend URL:** [URL]
**Session ID:** [Session ID]

### ✅ Working Endpoints

- [ ] GET /grading-sessions/{sessionId}
- [ ] GET /grading-results/{sessionId}

### ✅ Data Validation

**Session Data:**
- [ ] Valid structure
- [ ] All required fields present

**Result Data:**
- [ ] Valid structure
- [ ] Strengths = plain text ✅/❌
- [ ] Weaknesses = plain text ✅/❌
- [ ] Recommendations = plain text ✅/❌
- [ ] Book recommendations count: ____ (min 3)
- [ ] Learning path phases: ____ (must be 3)
- [ ] Action plan count: ____ (min 5)
- [ ] Industry insights: ✅/❌

### 🐛 Issues Found

1. [Describe issue if any]
2. [Describe issue if any]

### 📸 Screenshots

[Attach relevant screenshots]

### 💡 Notes

[Any additional notes]
```

---

## 🚀 Next Steps After Testing

1. ✅ Jika semua test passed:
   - Coba akses langsung di browser: `/profile/result/[SESSION_ID]`
   - Pastikan tampilan UI menampilkan semua data dengan benar

2. ❌ Jika ada test yang failed:
   - Screenshot error response
   - Share dengan backend team
   - Tunjukkan dokumentasi `json-payload-examples.md`

---

**Last Updated:** 2024-12-30  
**Version:** 1.0.0
