# Prehara — Learning Portal (Frontend)

A complete React front end for **Prehara**: a public landing page plus three working portals
(Student, Faculty, Admin) that share one live data store.

## Run it in VS Code

1. Install **Node.js 18 or newer** from https://nodejs.org (LTS is fine).
2. Unzip this folder and open it in VS Code (`File → Open Folder…`).
3. Open the terminal (`Ctrl + ~`) and run:

```bash
npm install
npm run dev
```

The browser opens at **http://localhost:5173**.

## Demo accounts (password: `demo123`)

| Role    | Email                       |
|---------|-----------------------------|
| Student | ananya.reddy@prehara.demo   |
| Faculty | ravi.kumar@prehara.demo     |
| Admin   | registrar@prehara.demo      |

The login page fills these in for you — just pick a role and press **Sign in**.

## Suggested demo flow for a presentation (5 minutes)

1. **Home page** → scroll through portals, AI assistants, rollout stages.
2. **Student** → Assignments → upload any file → it lands in the faculty grading queue.
3. **Faculty** → Grading queue → *Draft with assistant* → *Approve grade* → student sees the grade.
4. **Faculty** → Marks entry → *Submit for approval*.
5. **Admin** → Result approvals → *Approve and publish* → student Results page updates.
6. **Admin** → Timetable → *Check for clashes* → *Approve change*.
7. **Admin** → AI agents → switch the Study assistant off → student's assistant page shows it is disabled.
8. **Admin** → Audit log shows every action above.

Everything stays in memory until you reload the page.

## Project structure

```
src/
  App.jsx              hash router (#/, #/login, #/app)
  store.jsx            shared state + toast
  lib.js               helpers (attendance %, clashes, grading draft…)
  data/sample.js       all sample data — replace with API calls later
  components/          Logo (ring mark), shared UI pieces
  pages/               Landing, Login, Portal shell
  portals/             Student, Faculty, Admin views
  styles/              base, landing, auth, portal CSS
public/favicon.svg     logo mark
```

## Build for hosting

```bash
npm run build      # output in /dist — upload to Netlify, Vercel or any static host
npm run preview    # preview the production build locally
```
# Prehara
