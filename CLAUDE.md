# Claude Code Instructions

Follow the same repository rules defined in `AGENTS.md`.

## Primary Constraint

The Data Access Layer is strict. Firebase can only be touched in `lib/firebase/config.ts` and `lib/services`.

When implementing features:

1. Add or update a service function in `lib/services`.
2. Export it from `lib/services/index.ts`.
3. Call the service from hooks, context, pages, or components.
4. Keep UI code unaware of Firestore paths and Firebase SDK functions.

## Review Checklist

Before finishing changes, verify:

- No Firebase imports exist outside the approved files.
- Tenant data is scoped under `tenants/{tenantId}`.
- Role checks use the shared `Role` type.
- Form controls and buttons use shadcn/ui components.
- The app still typechecks.
