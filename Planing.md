Here's a comprehensive documentation document for your project planning session:

---

# JobMatch Platform – Technical Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Database Structure](#database-structure)
3. [Core Workflows](#core-workflows)
4. [ATS Scoring System](#ats-scoring-system)
5. [Role-Based Access Control](#role-based-access-control)
6. [Current Limitations & Risks](#current-limitations--risks)
7. [Improvement Roadmap](#improvement-roadmap)
8. [Technical Debt](#technical-debt)
9. [Action Items](#action-items)

---

## System Overview

JobMatch is a recruitment platform that connects employers with job seekers, featuring automated resume screening through an ATS (Applicant Tracking System) scoring algorithm.

### High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Frontend│────▶│   Inertia.js    │────▶│   Laravel API   │
│   (Tailwind)    │◀────│   (Routing)     │◀────│   Controllers   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   File System   │◀────│   ATSService    │────▶│   MySQL DB      │
│   (Resumes)     │     │   (Parsing)     │     │   (Models)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Database Structure

### Entity Relationship Diagram

```
┌──────────────────┐
│      users       │
├──────────────────┤
│ id (PK)          │
│ name             │
│ email            │
│ role             │◄──────────────────┐
│ ...              │                   │
└────────┬─────────┘                   │
         │                              │
         │ 1:N                          │
         ▼                              │
┌──────────────────┐     ┌──────────────────┐
│  job_listings    │     │  applications    │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ user_id (FK)     │────▶│ job_listing_id   │
│ title            │     │ user_id (FK)     │─────┐
│ description      │     │ name             │     │
│ requirements     │     │ email            │     │
│ location         │     │ resume_path      │     │
│ keywords (JSON)  │     │ ats_score (JSON) │     │
│ ...              │     │ status           │     │
└──────────────────┘     │ ...              │     │
                         └──────────────────┘     │
                                                  │
                                                  │ 1:N
                                                  │
                                           ┌──────┴─────┐
                                           │   users    │
                                           └────────────┘
```

### Table Specifications

#### `users`

| Column            | Type      | Description                       |
| ----------------- | --------- | --------------------------------- |
| id                | bigint    | Primary key                       |
| name              | string    | User's full name                  |
| email             | string    | Unique login email                |
| password          | string    | Hashed password                   |
| role              | enum      | `admin`, `employer`, `job_seeker` |
| email_verified_at | timestamp | Nullable verification             |

**Indexes:** `role`, `email`

#### `job_listings`

| Column               | Type    | Description                                                  |
| -------------------- | ------- | ------------------------------------------------------------ |
| id                   | bigint  | Primary key                                                  |
| user_id              | foreign | Employer who posted                                          |
| title                | string  | Job title                                                    |
| description          | text    | Full job description                                         |
| requirements         | text    | Required qualifications                                      |
| location             | string  | Job location                                                 |
| salary_range         | string  | Nullable compensation range                                  |
| job_type             | enum    | `full-time`, `part-time`, `contract`, `internship`, `remote` |
| category             | string  | Industry category                                            |
| experience_level     | enum    | `entry`, `mid-level`, `senior`, `executive`                  |
| keywords             | json    | Extracted skill keywords                                     |
| application_deadline | date    | Closing date                                                 |
| is_active            | boolean | Visible to job seekers                                       |

**Composite Indexes:** `(is_active, application_deadline)`

#### `applications`

| Column           | Type    | Description                                               |
| ---------------- | ------- | --------------------------------------------------------- |
| id               | bigint  | Primary key                                               |
| job_listing_id   | foreign | Target job                                                |
| user_id          | foreign | Applicant                                                 |
| name             | string  | Applicant's full name                                     |
| email            | string  | Contact email                                             |
| phone            | string  | Nullable contact number                                   |
| resume_path      | string  | Stored file path                                          |
| ats_score        | json    | Complete score data                                       |
| matched_keywords | json    | Keywords found in resume                                  |
| missing_keywords | json    | Keywords not found                                        |
| status           | enum    | `pending`, `reviewed`, `shortlisted`, `rejected`, `hired` |
| employer_notes   | text    | Private notes                                             |

**Unique Constraint:** `(job_listing_id, user_id)` – prevents duplicate applications

### JSON Structure – `ats_score`

```json
{
    "total": 72.5,
    "percentage": 72.5,
    "matched_keywords": ["laravel", "php", "mysql"],
    "missing_keywords": ["docker", "redis"],
    "matched_count": 8,
    "total_keywords": 12,
    "extracted_skills": ["php", "laravel", "javascript"],
    "extracted_experience_years": 5,
    "extracted_education": ["bachelor", "computer science"],
    "analysis_details": {
        "level": "Good",
        "message": "Your resume matches many key requirements...",
        "matched_count": 8,
        "missing_count": 4,
        "top_matched": ["laravel", "php", "mysql"],
        "critical_missing": ["docker", "redis"]
    }
}
```

---

## Core Workflows

### 1. Application Submission Flow

```
┌─────────────┐
│ Job Seeker  │
│ Views Job   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ 1. User clicks "Apply"                  │
│ 2. Check: Job is active & deadline      │
│ 3. Check: No existing application       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. Upload resume (PDF/DOC/DOCX)         │
│    - Store in storage/app/public/resumes│
│    - Generate file path                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. Create Application record            │
│    - status: 'pending'                  │
│    - Populate name/email/phone          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 6. Calculate ATS Score                  │
│    - Parse resume text                   │
│    - Extract job keywords                │
│    - Match & score                       │
│    - Store JSON result                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 7. Redirect to application details      │
│    - Show score to applicant            │
│    - Notify employer                    │
└─────────────────────────────────────────┘
```

### 2. ATS Scoring Algorithm

```
                    ┌─────────────────┐
                    │   Job Listing    │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │ Extract Job Keywords     │
              │ - Title phrases          │
              │ - Description skills     │
              │ - Requirements keywords  │
              │ - Manually added         │
              └───────────┬──────────────┘
                          │
┌─────────────────┐       ▼
│  Resume PDF     │  ┌──────────────────────────┐
└────────┬────────┘  │ Combine & Prioritize     │
         │           │ - Remove duplicates      │
         ▼           │ - Order by importance    │
┌─────────────────┐  └───────────┬──────────────┘
│ Extract Text    │              │
│ - PDF parsing   │              ▼
│ - DOCX parsing  │  ┌──────────────────────────┐
└────────┬────────┘  │ Keyword Matching         │
         │           │ - Exact matches          │
         ▼           │ - Partial matches        │
┌─────────────────┐  │ - 70% word match rule    │
│ Extract Skills  │  └───────────┬──────────────┘
│ - Common skills │              │
│ - Experience    │              ▼
│ - Education     │  ┌──────────────────────────┐
└────────┬────────┘  │ Score Calculation        │
         │           │ Base: matched/total * 100│
         ▼           │ Bonus: important keywords│
┌─────────────────┐  └───────────┬──────────────┘
│ Generate Report │              │
│ - Score         │              ▼
│ - Analysis      │  ┌──────────────────────────┐
│ - Suggestions   │  │ Store JSON in Database   │
└─────────────────┘  └──────────────────────────┘
```

### 3. Application Review Flow (Employer)

```
┌─────────────────────────────────────────┐
│ Employer views applications for a job   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Filter by status / ATS score            │
│ - Pending (new applications)            │
│ - Reviewed (seen but pending decision)  │
│ - Shortlisted (moving forward)          │
│ - Rejected / Hired (finalized)          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Review application details              │
│ - View resume                           │
│ - See ATS score & keyword analysis      │
│ - Add employer notes                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Update status                           │
│ - pending → reviewed (acknowledged)     │
│ - reviewed → shortlisted (interview)    │
│ - shortlisted → hired (offer)           │
│ - any → rejected (decline)              │
└─────────────────────────────────────────┘
```

---

## Role-Based Access Control

| Action                    | Job Seeker     | Employer        | Admin  |
| ------------------------- | -------------- | --------------- | ------ |
| View all jobs             | ✅ Active only | ✅ Own only     | ✅ All |
| Create job                | ❌             | ✅              | ✅     |
| Edit/delete job           | ❌             | ✅ Own only     | ✅     |
| Apply for job             | ✅             | ❌              | ❌     |
| View applications         | ✅ Own only    | ✅ For own jobs | ✅ All |
| Update application status | ❌             | ✅ For own jobs | ✅     |
| Download resume           | ✅ Own only    | ✅ For own jobs | ✅     |
| Recalculate ATS score     | ❌             | ✅ For own jobs | ✅     |
| Delete application        | ✅ Own only    | ❌              | ✅     |
| View analytics            | ❌             | ✅ Own jobs     | ✅ All |

---

## ATS Scoring System – Deep Dive

### How Keywords Are Extracted

**From Job Listings:**

1. Manually added keywords (if provided)
2. Title → split into phrases (e.g., "Senior PHP Developer" → ["senior", "php", "developer"])
3. Description → regex patterns for common skills
4. Requirements → same extraction as description
5. Prioritization: important skills (PHP, Python, AWS, etc.) are ranked higher

**From Resumes:**

1. PDF/DOCX text extraction
2. Case normalization and special character removal
3. Stop word filtering (the, and, for, etc.)
4. Single-word and multi-phrase extraction (2-3 word combos)
5. Skill detection from predefined list (100+ common tech skills)
6. Experience extraction via regex patterns and date ranges
7. Education detection (bachelor, master, PhD, etc.)

### Scoring Formula

```php
Base Score = (Matched Keywords / Total Keywords) × 100
Bonus = (Important Matches / Total Important) × 15 (max 15)
Final Score = min(100, Base Score + Bonus)
```

### Analysis Categories

| Score Range | Level             | Recommendation                                         |
| ----------- | ----------------- | ------------------------------------------------------ |
| 80–100      | Excellent         | Strong match, ready for review                         |
| 60–79       | Good              | Matches many requirements, minor improvements possible |
| 40–59       | Fair              | Some relevant keywords, needs optimization             |
| 0–39        | Needs Improvement | Low match, significant gaps                            |

---

## Current Limitations & Risks

### Technical Limitations

| Area                      | Limitation                                                      | Impact                                          |
| ------------------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| **Resume Parsing**        | PDF parsing via Smalot\PdfParser has limited formatting support | Complex PDFs may yield garbled text             |
| **DOCX Support**          | Basic ZipArchive extraction, no formatting preservation         | Tables, images, and complex layouts are ignored |
| **Keyword Detection**     | Hardcoded skill list (100+ items)                               | New/uncommon technologies aren't detected       |
| **Language Support**      | English-only detection                                          | Non-English resumes perform poorly              |
| **Experience Extraction** | Regex-based, limited to patterns                                | Inconsistent year extraction                    |
| **Scalability**           | Synchronous ATS calculation                                     | Slow for bulk operations                        |
| **File Upload**           | 5MB max, no virus scanning                                      | Security risk, size limitation                  |

### Business Risks

| Risk                          | Description                                            | Mitigation                                              |
| ----------------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| **False Positives/Negatives** | ATS score may not accurately reflect candidate quality | Employer review required; scoring is supplementary      |
| **Bias in Scoring**           | Keyword matching favors certain terminology            | Regular review of skill list; consider NLP improvements |
| **Data Privacy**              | Resume storage with PII                                | Ensure proper access controls; consider encryption      |
| **Duplicate Applications**    | Unique constraint prevents re-applying                 | Should allow re-application after rejection?            |
| **No Email Notifications**    | Applicants not notified of status changes              | Missing critical user engagement                        |

### Performance Considerations

- **ATS Calculation** – Each application triggers PDF parsing, which can take 1-3 seconds
- **Bulk Recalculation** – `ats:recalculate` runs synchronously; large datasets may timeout
- **JSON Queries** – Filtering by JSON fields (`JSON_EXTRACT`) is slower than indexed columns
- **No Queues** – Score calculation should be async to improve user experience

---

## Improvement Roadmap

### Phase 1: Stability & Performance (Short-term – 1-2 weeks)

#### Priority 1 – Critical Fixes

- [ ] **Implement queue for ATS calculation** – Move `calculateATSScore()` to a job queue
    ```php
    // Example: Dispatch job instead of synchronous
    ProcessApplicationATS::dispatch($application);
    ```
- [ ] **Add email notifications** – Notify applicants on status changes
- [ ] **Add file virus scanning** – Integrate ClamAV or similar
- [ ] **Improve error handling** – Graceful failures with user feedback

#### Priority 2 – Performance

- [ ] **Add database indexes** for JSON fields (MySQL 8+ supports generated columns)
    ```sql
    ALTER TABLE applications ADD COLUMN ats_score_total INT GENERATED ALWAYS AS (ats_score->>'$.total') STORED;
    CREATE INDEX idx_ats_score_total ON applications(ats_score_total);
    ```
- [ ] **Implement caching** for job keyword extraction
- [ ] **Optimize PDF parsing** – Use faster parser or consider third-party API

### Phase 2: Feature Enhancements (Medium-term – 2-4 weeks)

#### Resume Parsing Improvements

- [ ] **Integrate professional PDF parser** – Consider `spatie/pdf-to-text` or commercial APIs
- [ ] **Better DOCX parsing** – Use `PhpOffice/PhpWord` for full document structure
- [ ] **OCR for scanned PDFs** – Add Tesseract integration
- [ ] **Multi-language support** – Detect and handle non-English resumes

#### Keyword Intelligence

- [ ] **Machine learning for skill extraction** – Use NLP libraries like `spatie/word-cloud`
- [ ] **Synonym matching** – "React" matches "React.js", "ReactJS"
- [ ] **Industry-specific skill databases** – Allow employers to define custom skill sets
- [ ] **Experience level weighting** – Match years of experience requirements

#### Analytics Dashboard

- [ ] **Hiring funnel visualization** – Track conversion rates
- [ ] **Time-to-hire metrics** – Average days from application to hire
- [ ] **Source tracking** – Where do top candidates come from?
- [ ] **ATS score trends** – Compare scores across jobs

### Phase 3: Advanced Features (Long-term – 6-8 weeks)

#### AI-Powered Features

- [ ] **Resume summarization** – Extract key points using LLM
- [ ] **Cover letter generation** – AI-assisted customization
- [ ] **Interview question generator** – Based on job requirements
- [ ] **Candidate ranking** – Machine learning model for scoring

#### Platform Scaling

- [ ] **Multi-tenant architecture** – Support multiple companies
- [ ] **API for third-party integrations** – REST API with authentication
- [ ] **Webhooks** – Notify external systems on status changes
- [ ] **SSO Integration** – Google, LinkedIn, GitHub auth

#### Collaboration Features

- [ ] **Team reviews** – Multiple employers reviewing applications
- [ ] **Comments/threads** – Discussion on candidates
- [ ] **Interview scheduling** – Calendar integration
- [ ] **Offer letter generation** – PDF templates

---

## Technical Debt

### Code Quality Issues

| File                              | Issue                                                      | Priority |
| --------------------------------- | ---------------------------------------------------------- | -------- |
| `ATSService.php`                  | ~650 lines – violates single responsibility principle      | Medium   |
| `ApplicationController.php`       | Too many responsibilities (CRUD + analytics + stats)       | Medium   |
| `ATSService::extractResumeData()` | Mixed concerns – should be separate parser classes         | High     |
| Hardcoded skill lists             | Should be database-driven or configurable                  | Medium   |
| Missing interface definitions     | `ATSService` should implement an interface for testability | Low      |

### Testing Gaps

- No unit tests for `ATSService`
- No feature tests for application flow
- Missing factory definitions for complex JSON fields
- No test coverage for edge cases (corrupt PDFs, missing files)

### Security Considerations

- [ ] Add rate limiting on application submissions
- [ ] Implement file type verification beyond extension
- [ ] Sanitize resume text before storage/display
- [ ] Add audit logging for sensitive actions
- [ ] Environment-specific debug mode (currently may leak errors)

---

## Action Items – Project Planning Session

### Immediate Actions (This Week)

| Task                                    | Owner   | Estimate | Dependencies           |
| --------------------------------------- | ------- | -------- | ---------------------- |
| Move ATS calculation to queue           | Backend | 4h       | Redis/Beanstalkd setup |
| Add email notifications                 | Backend | 3h       | Mail configuration     |
| Create database indexes for JSON fields | Backend | 2h       | Migration planning     |
| Add unit tests for ATSService           | Backend | 6h       | None                   |
| Fix PDF parsing error handling          | Backend | 3h       | None                   |

### Next Sprint (2 Weeks)

| Task                                  | Owner      | Estimate | Dependencies        |
| ------------------------------------- | ---------- | -------- | ------------------- |
| Implement resume virus scanning       | Backend    | 4h       | ClamAV integration  |
| Add skill management UI for employers | Frontend   | 8h       | Backend API         |
| Create analytics dashboard charts     | Frontend   | 12h      | Chart.js / Recharts |
| Implement application bulk actions    | Full-stack | 8h       | API design          |
| Add rate limiting and throttling      | Backend    | 2h       | None                |

### Future Considerations (Next Quarter)

- Evaluate NLP libraries for better skill extraction
- Consider paid PDF parsing API for production
- Plan for mobile app or PWA
- Develop public API for third-party integrations
- GDPR compliance and data retention policies

---

## Appendix

### Commands Reference

```bash
# Development
composer run dev              # Start all dev servers
php artisan serve             # Start Laravel
npm run dev                   # Start Vite

# Database
php artisan migrate           # Run migrations
php artisan migrate:rollback  # Rollback last migration
php artisan db:seed           # Seed test data

# ATS Operations
php artisan ats:recalculate               # Recalc all missing/zero scores
php artisan ats:recalculate --application=1  # Recalc specific app

# Queue
php artisan queue:work         # Process queued jobs
php artisan queue:failed       # List failed jobs

# Testing
php artisan test               # Run tests
composer run test              # Alias for php artisan test
```

### Environment Variables Checklist

```env
# Required
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jobmatch
DB_USERNAME=root
DB_PASSWORD=

# For queue (optional but recommended)
QUEUE_CONNECTION=database   # or redis

# For email (optional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=hello@jobmatch.com
MAIL_FROM_NAME="JobMatch"

# For production
APP_ENV=production
APP_DEBUG=false
```

---

**Document Version:** 1.0  
**Last Updated:** March 24, 2026  
**Next Review:** Project Planning Session

---

_Questions for the planning session:_

1. What's the expected scale? (number of jobs, applicants, concurrent users)
2. Should ATS scoring be configurable by employers?
3. What's the budget for third-party services (email, PDF parsing, etc.)?
4. Timeline for production deployment?
5. Team capacity – frontend vs backend split?
