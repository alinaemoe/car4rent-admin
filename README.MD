# Car4Rent Admin

**The back-office for a car-rental platform - with a 3D car model where managers pin damages in the exact place they happened.**

## The Car4Rent system

| Repo | Role | Stack |
|---|---|---|
| **car4rent-backend** | REST API, auth, bookings, payments ledger, media | NestJS 11, TypeORM, PostgreSQL |
| **car4rent-mobile** | Customer and car-owner app (Android / iOS) | Expo / React Native, Redux Toolkit, TanStack Query |
| **car4rent-admin** | Back-office for managers | Refine 5, MUI 6, React Three Fiber |
| **car4rent-landing** | Public marketing site and lead capture | React 19, Vite, i18next, Framer Motion |

Car4Rent is a peer-to-peer and fleet **car rental platform** built as a diploma project: clients search
and book cars, owners publish and manage theirs, and managers run the whole thing from the admin panel.

## Highlights

- **3D damage scene (the showpiece).** A React Three Fiber scene renders a car model; click on the
  body and the 3D coordinates are captured into an *Add damage* dialog, then the damage appears as a
  **pulsing pin** on the model next to the list of damages. Types: scratch, dent, crack, broken part,
  interior, wheel, other.
- **18 managed resources** built on Refine: users (with documents and rentals tabs), cars, rentals
  (damages + timeline), documents, partnership requests, rental leads, reviews, transactions, news,
  FAQ, features, locations, translations, languages, settings and more.
- **Document verification** with bulk *Verify / Reject* and rejection reasons.
- **Analytics** for transactions: stat cards and charts (Recharts).
- **Locations on a map** (Leaflet), **multilingual content editing** (translations, features, news, FAQ),
  light/dark theme, auto-refresh of the JWT with a request-queue so parallel calls don't race.

## Stack

React 19, Vite 6, Refine 5 (`@refinedev/core`, `mui`, `react-hook-form`, `react-router`),
MUI 6 + MUI X Data Grid, React Three Fiber + drei + three.js, Recharts, i18next, Axios.

## Run

```bash
cp .env.example .env     # VITE_API_URL points to the Car4Rent API
npm install
npm run dev
```

Requires the [Car4Rent API](../backend) running.