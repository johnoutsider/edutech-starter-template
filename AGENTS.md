# AI Agent Instructions

This repository is a reusable Next.js 14 App Router starter for multi-tenant EduTech applications.

## Non-Negotiable Architecture Rule

UI code must never import Firebase SDKs or Firebase clients directly.

Allowed Firebase locations:

- `lib/firebase/config.ts`
- `lib/services/*.ts`

Everything else must call service functions from `lib/services`.

Forbidden outside the service layer:

- `firebase/*` imports
- `db`, `auth`, `collection`, `doc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`
- Firestore path construction inside pages or components

## Multi-Tenancy

All tenant-owned Firestore data must be scoped under:

```text
tenants/{tenantId}/...
```

Users live at:

```text
tenants/{tenantId}/users/{uid}
```

Every authenticated user document must include `role` and `tenantId`.

## Development Standards

- Use TypeScript strict mode.
- Use App Router conventions.
- Use shadcn/ui components for forms and buttons.
- Use Tailwind CSS for layout and spacing.
- Use `async/await` only.
- Wrap service calls in `try/catch`.
- Keep new service APIs database-agnostic from the caller's perspective.

## Adding Data Features

Create a new file under `lib/services`, export it from `lib/services/index.ts`, and call that service from components or hooks. Do not leak Firebase implementation details into UI code.
