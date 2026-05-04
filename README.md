# genome.computer

Direct-to-consumer landing + checkout site for **Humankind Bio, Inc.**
Customers order a sequencing kit (or pay for a `.genome` conversion of an
existing DNA file) and receive their data as a `.genome/1.0` bundle plus
the `readmygenome.md` skill.

Note: the repo directory name is `genome-download` for historical
reasons; the actual production domain is `genome.computer`.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn-style HSL tokens in `app/globals.css`
- Geist + Geist Mono via `next/font`
- Stripe PaymentIntent + PaymentElement for checkout
- Supabase for order persistence, conversion-job tracking, and file storage
- Resend for transactional order-confirmation + conversion-delivery emails
- Deploy target: Vercel (domain: `genome.computer`)

Mirrors the commerce stack used by the Humankind Website repo.

## Local development

```bash
pnpm install
cp .env.example .env.local   # fill in real values for live commerce
pnpm dev
```

Without env vars the landing page, privacy, terms, and thanks pages all render.
The order flow renders but checkout will fail until Stripe keys are set.

## Environment variables

See `.env.example`. Vars are grouped by purpose:

| Purpose | Vars |
| --- | --- |
| Stripe (required for checkout) | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Supabase (required for order records) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Resend (required for confirmation emails) | `RESEND_API_KEY`, `RESEND_FROM` |

## Routes

- `/` — landing page (5 product tiers + FAQ + footer)
- `/order/[tier]` — checkout form per tier (`snp`, `snp-imputed`, `wgs-30x`, `wgs-100x`)
- `/thanks?order=...` — post-purchase confirmation
- `/privacy` — draft privacy policy (pending counsel review)
- `/terms` — draft terms of service (pending counsel review)
- `POST /api/create-payment-intent` — mints a Stripe PaymentIntent for a tier
- `POST /api/save-order` — verifies PaymentIntent status on Stripe, persists to Supabase, sends Resend confirmation email

## Supabase schema

Run `supabase/schema.sql` against your Supabase project to create the `orders` table.

## Pre-launch TODOs

Before the site can take real orders:

- [ ] Create Stripe products in Stripe Dashboard (one per tier). Price IDs are
      not needed by the app — amounts come from `lib/products.ts` — but creating
      the products lets you track conversion in Stripe's UI. Paste the product
      IDs into `stripeProductId` in `lib/products.ts`.
- [ ] Finalize the **1x whole-genome tier price** (currently $99 placeholder in `lib/products.ts`)
- [ ] Create Supabase project and run `supabase/schema.sql`; paste URL + keys into Vercel env
- [ ] Verify `genome.computer` sender domain in Resend; paste API key into Vercel env
- [ ] Design + upload `og-image.png` (1200×630) to `public/`
- [ ] Generate + upload favicon PNGs from https://favicon.io/emoji-favicons/dna to `public/`
- [ ] Counsel review + finalize `/privacy` and `/terms` copy
- [ ] Attach `genome.computer` custom domain in Vercel project settings

## License

© Humankind Bio, Inc.
