# SCM Admin

SCM Capital's internal operations portal for products, customers, users and
roles, KYC, support, integrations, notifications, content, and audit activity.

## Architecture

The application uses Next.js App Router and follows this request path:

```text
page/component → React Query hook → domain service → Axios
  → same-origin /api/proxy route → encrypted .NET API
```

The browser never receives backend bearer tokens or API encryption keys.
`/api/proxy` stores access and refresh tokens in secure httpOnly cookies,
converts camelCase JSON to the backend's PascalCase contract, encrypts request
bodies, decrypts responses, and retries one request after a successful token
refresh.

The primary business workflow is maker-checker:

1. An Initiator creates or edits a record and submits it.
2. An Approver reviews the pending request.
3. The Approver approves or rejects it with a reason.

## Requirements

- Node.js 20+
- npm
- Access to the SCM backend API
- A 16-byte AES key and IV supplied by the backend team

## Configuration

Copy `.env.example` to `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

Required server-only variables:

| Variable            | Purpose                            |
| ------------------- | ---------------------------------- |
| `API_BASE_URL`      | Base URL of the .NET API           |
| `API_AES_KEY`       | 16-byte AES-128-CBC key            |
| `API_AES_IV`        | 16-byte AES initialization vector  |
| `AUTH_REFRESH_PATH` | Optional refresh endpoint override |

Never rename these to `NEXT_PUBLIC_*`; public variables are embedded into the
browser bundle.

## Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
```

## Tests

Unit tests use Vitest:

```bash
npm test
```

## Deployment

The repository retains its existing Docker and Docker Compose configuration:

```bash
docker compose up --build
```

Environment configuration is managed separately for each deployment target.

## Repository map

```text
src/app/          routes, layouts, error boundary, and API proxy
src/components/   shared and module-specific UI
src/hooks/        React Query queries and mutations
src/services/     backend API operations
src/lib/          browser HTTP client and server transport
src/stores/       Zustand auth and toast state
src/types/        domain DTOs
src/constants/    navigation, form and feature configuration
```

For an end-to-end code trace, start with:

1. `src/app/layout.tsx`
2. `middleware.ts`
3. `src/stores/authStore.ts`
4. `src/lib/axios.ts`
5. `src/app/api/proxy/[...path]/route.ts`
6. A feature page, hook, and service such as Customer Management

## Security notes

- Tokens are httpOnly, secure in production, same-site cookies.
- Backend encryption and key conversion happen only on the server.
- The proxy uses a fixed configured upstream; clients cannot choose a target.
- Login responses are scrubbed before reaching browser JavaScript.
- Do not commit `.env`, credentials, API tokens, or generated test data.

