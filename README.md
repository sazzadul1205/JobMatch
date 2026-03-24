# JobMatch

Job board and application tracking platform built with **Laravel 12**, **Inertia + React**, **Vite**, and **Tailwind CSS**.  
Includes employer dashboards, job listings, application management, and ATS scoring.

## Features
- Job listings (create, edit, activate/deactivate)
- Candidate applications with status workflow
- ATS score calculation from resumes
- Role-based access (job seeker, employer, admin)
- Responsive UI with React + Tailwind

## Tech Stack
- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React (Inertia), Tailwind CSS, Vite
- **Auth**: Laravel Fortify
- **Resume Parsing**: PDF parser + basic DOCX extraction

## Requirements
- PHP 8.2+
- Composer
- Node.js 18+ and npm
- MySQL/MariaDB (or another supported Laravel database)

## Setup
1. Install PHP dependencies:
   ```bash
   composer install
   ```
2. Copy env file:
   ```bash
   copy .env.example .env
   ```
3. Generate app key:
   ```bash
   php artisan key:generate
   ```
4. Configure your database in `.env`.
5. Run migrations:
   ```bash
   php artisan migrate
   ```
6. Install frontend dependencies:
   ```bash
   npm install
   ```

## Development
Run Laravel + queue + Vite dev servers:
```bash
composer run dev
```

Or run separately:
```bash
php artisan serve
npm run dev
```

## ATS Scoring
- ATS scores are calculated when an application is created.
- If you need to recompute:
  ```bash
  php artisan ats:recalculate
  ```
  Or for one application:
  ```bash
  php artisan ats:recalculate --application=1
  ```

## Build
```bash
npm run build
```

## Lint & Format
```bash
composer run lint
npm run lint
npm run format
```

## Tests
```bash
composer run test
```

## Project Structure
```
app/                Laravel backend (models, controllers, services)
resources/js/       React frontend (Inertia pages/components)
resources/css/      Tailwind styles
routes/             Web routes
database/           Migrations and seeders
```

## Environment Notes
- Ensure `.env` has correct DB settings (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
- For file uploads:
  ```bash
  php artisan storage:link
  ```

---
If you want screenshots, deployment notes, or API docs added, tell me what to include.
