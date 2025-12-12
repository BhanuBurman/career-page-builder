# Career Page Builder

A full-stack application that allows recruiters to design custom, branded career pages and post job openings. The platform features a dynamic "Page Builder" with live preview and generates public-facing career sites for candidates.

## Repository Structure

- **`frontend/`**: A React + TypeScript + Vite Single Page Application (SPA).
- **`backend/`**: FastAPI, supabase .

---

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (3.12.3) --> Important
- **Git**
- A **Supabase** account

---

## Step 1: Supabase Configuration

This project uses **Supabase** for Authentication and Database hosting.

1.  **Create a Project:**
    - Log in to [Supabase](https://supabase.com/) and create a new project.

2.  **Get API Credentials:**
    - In the Supabase dashboard go to **Project Settings** (cog icon) → **API**.
    - **Project URL:** Copy the project URL (e.g., `https://xyz.supabase.co`).
    - **Publishable (public) key:** Copy the publishable key. (Dont use legacy Anon key)

3.  **Get Database Connection String:**
    - Click the **Connect** button in the top-right of the Supabase dashboard.
    - Select the environment or client you plan to use (for example: Python, Prisma, etc.).
    - Under **Connection string**, choose **URI** and copy the connection string.
    - Replace `[YOUR-PASSWORD]` in the URI with your actual database password before placing it in `.env`.

---

## Step 2: Backend Setup

The backend runs on FastAPI.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create the Environment File:**
    Create a file named `.env` in the `backend/` folder and paste the following configuration:

    ```ini
    ENVIRONMENT=development
    DEBUG=True
    API_HOST=0.0.0.0
    API_PORT=8000
    # Allow requests from frontend
    CORS_ORIGINS=http://localhost:3000,http://localhost:5173

    # Supabase Configuration
    # Found in Supabase Dashboard -> Project Settings -> API
    SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
    # Found in Supabase Dashboard -> Project Settings -> API -> JWT Settings
    SUPABASE_JWT_SECRET=your_jwt_secret_here
    # Found in Supabase Dashboard -> Project Settings -> API -> Service Role Secret (Optional, if used)
    SUPABASE_SECRET_KEY=your_service_role_key_here

    # Database
    # Found in Supabase Dashboard -> Project Settings -> Database -> Connection String
    # Remember to replace [YOUR-PASSWORD] with your actual DB password
    DATABASE_CONNECTION_STRING=postgresql://postgres:password@db.project.supabase.co:5432/postgres
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Server:**
    ```bash
    python main.py
    ```
    *The API will start at `http://localhost:8000`.*

---

## Step 3: Frontend Setup

The frontend is built with React and Vite.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Create the Environment File:**
    Create a file named `.env` in the `frontend/` folder.
    *Note: Vite requires variables to start with `VITE_`.*

    ```ini
    # Found in Supabase Dashboard -> Project Settings -> API -> Project URL
    VITE_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)

    # Found in Supabase Dashboard -> Project Settings -> API -> Project API Keys -> anon public
    VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key_here

    # The address of your Python Backend
    VITE_API_URL=http://localhost:8000
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    *The app will start at `http://localhost:5173`.*

---

## User Guide

### 1. Recruiter Flow (Admin)
1.  **Login:** Open the frontend app. If you haven't set up Auth yet, check the `Login.tsx` file to see if a demo login button exists.
2.  **Dashboard:** You will see a list of your companies.
3.  **Page Builder:** Click "Create Company" or select an existing one.
    * **Edit:** Use the left sidebar to change the Logo, Colors, Header Text, and About Sections.
    * **Preview:** The right side updates in real-time.
    * **Publish:** Click "Save & Publish" to generate a public link.

### 2. Candidate Flow (Public)
1.  Recruiters share the generated link (e.g., `http://localhost:5173/google/careers`).
2.  Candidates can view the branded page, read about the company, and view open job positions.
