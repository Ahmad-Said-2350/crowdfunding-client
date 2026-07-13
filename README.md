# Pledgekit

Crowdfunding with clarity.

Pledgekit is a credit-based crowdfunding platform where Supporters discover campaigns, Creators raise funding, and Admins keep the marketplace trustworthy.

## Live links

- Front-end live site: `https://pledgekit.vercel.app` *(update after deploy)*
- Client GitHub: https://github.com/Ahmad-Said-2350/crowdfunding-client
- Server GitHub: https://github.com/Ahmad-Said-2350/crowdfunding-server

## Admin credentials

- Admin email: `admin@fundora.app`
- Admin password: `Admin@Fundora2026`

## Features

- Role-based workspaces for Supporter, Creator, and Admin (distinct navigation and accents)
- Better Auth email/password + Google sign-in with JWT in localStorage
- Registration credits: 50 for Supporters, 20 for Creators
- Campaign approval gate before public discovery
- Contribution approve/reject with refunds and notifications
- Admin user governance: role updates, **block/unblock**, and removals via professional modals
- Stripe credit packages with dummy checkout fallback
- Creator withdrawals (20 credits = $1, min 200 credits)
- Notification center with click-outside dismiss
- imgBB uploads, paginated contributions, campaign reports
- IBM Carbon-inspired minimal UI with Inter and consistent control sizing

## Local development

1. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`.
2. `npm install`
3. `npm run dev` → http://localhost:3000

## Stack

- Next.js 15 + TypeScript + Tailwind CSS v4
- Better Auth + JWT
- Swiper + Framer Motion + Lucide
