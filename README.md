# DFET Ops

Internal **IT Asset & Staff Task Management System** for DFET.

Staff sign in, get assigned work, file daily reports, and track company kits (laptops, routers, Starlink, phones) from one desk.

## Sign in (demo Super Admin)

- **Username:** `admin`
- **Password:** `admin`

(`admin@dfet.ng` also works.) Change these before real company use.

## What’s in the app

- Role-based access: Super Admin, Admin, HR, Supervisor, Staff
- Tasks with priority, deadlines, comments, files, and overdue alerts
- Staff / intern directory and profiles
- Equipment register, assignment history, maintenance
- Daily / weekly activity reports with approval
- Dashboard, search, Excel export, print/PDF

## Run it

```bash
npm install
npm run dev
```

Then open the local app in your browser.

## Stack

TanStack Start, Better Auth, Postgres (or local PGLite), Tailwind CSS.

Built as an intern project for DFET.
