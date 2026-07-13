# Fundora

Transparent crowdfunding for ideas that deserve momentum.

Fundora is a credit-based crowdfunding platform where Supporters discover campaigns, Creators raise funding, and Admins keep the marketplace trustworthy.

## Live links

- Front-end live site: `https://fundora.vercel.app` *(update after deploy)*
- Client GitHub: https://github.com/Ahmad-Said-2350/crowdfunding-client
- Server GitHub: https://github.com/Ahmad-Said-2350/crowdfunding-server

## Admin credentials

- Admin email: `admin@fundora.app`
- Admin password: `Admin@Fundora2026`

## Features

- Role-based access for Supporter, Creator, and Admin with private dashboard routes that survive page reload
- Better Auth email/password + Google sign-in with JWT stored in localStorage
- Default registration credits: 50 for Supporters, 20 for Creators
- Campaign lifecycle with pending admin approval before public discovery
- Contribution workflow with pending / approved / rejected states and automatic refunds
- Stripe credit packages (100 / 300 / 800 / 1500) with dummy checkout fallback when Stripe keys are absent
- Creator withdrawals at 20 credits = $1 with a 200-credit minimum
- Notification center with floating popup and click-outside dismiss
- imgBB image uploads on registration and campaign creation
- Paginated My Contributions ledger for Supporters
- Campaign reporting, admin moderation, and user role management
- Responsive IBM-inspired UI across mobile, tablet, and desktop
- Unique extras: category insights, platform impact ledger, advanced explore filters

## Local development

1. Copy `.env.local.example` to `.env.local` and point `NEXT_PUBLIC_API_URL` at the Fundora API.
2. `npm install`
3. `npm run dev` → http://localhost:3000

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Better Auth client + JWT plugin
- Swiper + Framer Motion
- Lucide icons
