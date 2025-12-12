Tech Specification
=========

Assumptions
-----------
- There will be the recruiter and can create multiple career pages for differenet companies
- each company will have multiple jobs
- After the publish the recruiter should get the live link which can be shared to candidate
- by using the sahred link candidate should get redirect to the companies page and can apply for the job
- the candidate can perform the multiple filtering operations
- Apply button is going to be dummy

High-level Architecture
-----------------------

![architecture](./career%20builder%20architecture.jpg)
- Client (browser): React SPA built with Vite. Handles page building UI and uses `frontend/src/services/*` to call backend or Supabase.
- API Server: Python service (FastAPI assumed) serving JSON REST endpoints for auth, companies, and jobs. Routers are grouped under `app/routers`.
- Persistence: Relational DB (SQL-based) via `app/database.py`. Models under `app/models` represent `Company` and `Job`.
- External Integrations: Email and notification services abstracted in `app/external_services`.
- Deployment: Typical development run uses `uvicorn` for backend and `npm run dev` (or equivalent) for frontend.

Schema Designs (Tables)
-------------------------------------

- Company:
  - `id` (int)
  - `name` (string)
  - `slug` (string, unique)
  - `branding_config` (JSONB)
  - `page_content` (JSONB)
  - `created_at` / `updated_at` (timestamps)

- Job:
  - `id` (int)
  - `company_id` (foreign key -> Company)
  - `title` (string)
  - `location` (string)
  - `employment_type` (enum: full-time/part-time/contract)
  - `description` (text/markdown)
  - `is_active` (bool)
  - `created_at` / `updated_at` (timestamps)

Security & Auth
----------------
Used Supabase Authentication for signing the jwt token and verifying the user also used OAuth Goggle Provider.

Test Plan
---------
1) Integration tests (backend API)
   - Spin up the API app in test mode and run HTTP tests for endpoints in `auth`, `companies`, `jobs`, and `health`.
   - Verified expected status codes, responses, and side effects (e.g., database writes, email invocations).

2) End-to-end Testing
   - Component tests for key components: `JobList`, `JobCreateSection`, `CompanyRenderer`.

3) Contract tests (JSON)
   - Maintained API contract tests to ensure frontend and backend expectations remain aligned (schemas, required fields).

How to run (dev):
```powershell
# Backend (from repo root)
cd backend; python -m pip install -r requirements.txt; uvicorn main:app --reload

# Frontend
cd frontend; npm install; npm run dev
```
