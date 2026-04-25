# Multi-Tenant EduTech Starter

A production-oriented Next.js 14 App Router starter for multi-tenant EduTech applications. It uses Firebase Auth and Firestore behind a strict Data Access Layer so future projects can replace Firebase without rewriting UI components.

## Tech Stack

- Next.js 14 App Router
- TypeScript strict mode
- Firebase Auth and Firestore
- Tailwind CSS
- shadcn/ui-style components
- Email and password authentication

## Setup

1. Clone the project.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local`.
4. Fill in your Firebase web app values:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

5. Enable Email/Password sign-in in Firebase Auth.
6. Create Firestore user documents under tenant-scoped paths:

```text
tenants/{tenantId}/users/{uid}
```

Each user document must include:

```ts
{
  uid: "firebase-auth-uid",
  email: "user@example.com",
  displayName: "User Name",
  role: "admin",
  tenantId: "tenant-id",
  createdAt: "2026-04-25T00:00:00.000Z"
}
```

7. Run the development server:

```bash
npm run dev
```

## Folder Structure

- `app/(auth)` contains the login screen and centered auth layout.
- `app/(dashboard)` contains role-specific placeholder dashboards and the shared dashboard layout.
- `components/auth` contains authentication UI.
- `components/layout` contains sidebar, topbar, dashboard panel, and role guard components.
- `components/ui` contains shadcn/ui-style primitives.
- `context/AuthContext.tsx` loads the authenticated app user and exposes role and tenant state.
- `hooks/useAuth.ts` provides typed access to auth context.
- `lib/firebase/config.ts` initializes Firebase.
- `lib/services` is the only place where Firebase SDK calls are allowed.
- `lib/db/client.ts` is a placeholder for a future SQL client.
- `types/index.ts` stores shared application types.
- `middleware.ts` protects dashboard routes using the client-created Firebase session token cookie.

## Adding a New Service

Create a service file under `lib/services`, keep all database details inside it, and export it from `lib/services/index.ts`.

Example:

```ts
// lib/services/courseService.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function getCoursesByTenant(tenantId: string) {
  try {
    const snapshot = await getDocs(collection(db, `tenants/${tenantId}/courses`));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Failed to load courses.", error);
    throw new Error("Unable to load courses.");
  }
}
```

Then call it from UI code:

```ts
import { getCoursesByTenant } from "@/lib/services";
```

Do not import Firebase in the component.

## Swapping Firebase for SQL Later

1. Add a real SQL client in `lib/db/client.ts`.
2. Keep the public service function names and return types unchanged.
3. Rewrite the internals of files in `lib/services` to query SQL tables instead of Firestore.
4. Preserve tenant scoping by filtering every query by `tenantId`.
5. Run typecheck and app flows. UI code should not need changes because it only depends on service functions.

## DAL Rule

Firebase imports are only allowed in:

- `lib/firebase/config.ts`
- files inside `lib/services`

Pages, components, hooks, and context must call service functions only.
