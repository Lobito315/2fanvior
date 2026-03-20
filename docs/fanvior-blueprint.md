# Fanvior Blueprint

## Product surfaces extracted from the supplied Stitch HTML files

- Landing page with premium creator positioning
- Signup, login, and password recovery flows
- Creator dashboard with revenue, views, and subscriber snapshots
- Content upload and paid visibility controls
- Subscription tier management
- Admin user management and moderation queue
- Activity feed and notification settings
- Checkout with PayPal and payment result pages
- Post detail view with media focus
- Live chat experience

## Architecture

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Framer Motion-ready structure
- Backend: Next.js route handlers plus a custom Node server for WebSocket chat
- Database: PostgreSQL with Prisma models for users, profiles, posts, purchases, subscriptions, conversations, messages, notifications, and moderation flags
- Auth: JWT session cookie
- Payments: PayPal REST order creation flow

## Runbook

1. Copy `.env.example` to `.env`.
2. Fill in PostgreSQL, JWT, and PayPal credentials.
3. Run `npm install`.
4. Run `npx prisma migrate dev --name init`.
5. Run `npm run dev`.

## Notes

- Uploads are stored locally under `public/uploads`.
- WebSocket chat is served from `/ws` by `server.js`.
- The supplied HTML files were used as product input to define routes, modules, and flows rather than pasted in as static markup.
