# SARMS – Smart Agricultural Reserve Management System

Role-based login and routing: **Worker**, **Engineer/Supervisor**, **Admin**.

## Login page

- **ID + Password**: Enter User ID and password, then **log in**.
- **QR Code**: Use **scan QR code** to open the camera; scan a SARMS QR (resolves to User ID) or enter User ID in the fallback field.

No role selection is shown; the system redirects automatically by role.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). You will land on the login page.

## Test credentials (mock)

| User ID | Password | Role    | Redirects to      |
|---------|----------|---------|-------------------|
| `w1`    | `w1`     | Worker  | Worker Interface  |
| `e1`    | `e1`     | Engineer| Engineer Workspace|
| `a1`    | `a1`     | Admin   | Admin Dashboard   |

QR login: scan a QR that contains one of these User IDs (e.g. `w1`), or enter the ID in the modal.

## Build

```bash
npm run build
npm run preview
```
