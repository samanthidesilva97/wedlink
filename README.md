# WedLink — Sri Lanka's Wedding Marketplace

> **MVP Web Application** built with Next.js 14, Supabase, PayHere, and Resend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Local Development Setup](#3-local-development-setup)
4. [Third-Party Service Setup](#4-third-party-service-setup)
5. [Supabase Database Schema](#5-supabase-database-schema)
6. [Feature Pages Reference](#6-feature-pages-reference)
7. [Environment Variables](#7-environment-variables)
8. [Deployment (Vercel)](#8-deployment-vercel)
9. [Going Live Checklist](#9-going-live-checklist)

---

## 1. Project Overview

WedLink is a two-sided marketplace connecting Sri Lankan couples with wedding vendors. It includes:

- **Couple features** — Vendor discovery, booking flow, messaging, checklist, budget tracker, guest list + RSVP, seating planner, mood board, AI day-of timeline
- **Vendor features** — Business profile, portfolio, availability calendar, booking management, analytics dashboard, PayHere payouts
- **Admin panel** — Vendor approvals, dispute resolution, revenue reporting
- **Multi-language** — English, Sinhala (සිංහල), Tamil (தமிழ்)

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| File Storage | Supabase Storage |
| Realtime Messaging | Supabase Realtime |
| Payments | PayHere (Checkout, Recurring, IPN) |
| Email | Resend |
| SMS | Twilio |
| AI Features | OpenAI GPT-4o-mini |
| Charts | Recharts |
| State | Zustand |
| Icons | Lucide React |

---

## 3. Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier works)
- A PayHere sandbox account (free at sandbox.payhere.lk)

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Visit `http://localhost:3000`.

> All pages show mock data and work without API keys. Add the env vars progressively to unlock each service.

---

## 4. Third-Party Service Setup

### 4.1 Supabase (Database & Auth)

**Create project:**
1. Go to https://supabase.com → New Project
2. Choose region: Singapore (ap-southeast-1) — closest to Sri Lanka
3. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

**Enable Google OAuth:**
1. Authentication → Providers → Google → Enable
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)
3. Authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Paste Client ID & Secret into Supabase

**Set up Storage buckets:**
In Supabase → Storage, create:
- `portfolio-images` (public)
- `avatars` (public)
- `vendor-documents` (private)

**Run database schema:**
Copy the full SQL from Section 5 and run it in Supabase SQL Editor.

**Code changes needed:** None — client is already at `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`.

---

### 4.2 PayHere (Payment Gateway — Sri Lanka)

WedLink uses **PayHere**, the most widely used payment gateway in Sri Lanka, supporting:
- LKR payments via Visa, Mastercard, Amex
- Local mobile wallets: eZ Cash, FriMi, mCash
- Internet banking (all major SL banks)
- Recurring (preapproval) payments for vendor subscriptions

> **Why PayHere over Stripe?** Stripe does not support Sri Lanka as a merchant country. PayHere is trusted by Daraz, PickMe, and thousands of local businesses, and supports all LKR payment methods.

#### Payout model (Marketplace)
Unlike Stripe Connect, PayHere does not auto-split payments. WedLink uses a **managed payout model**:
1. Couple pays 100% through PayHere → funds land in WedLink's merchant account
2. Platform retains 10% commission
3. Vendor payout (90%) is disbursed via PayHere Disbursement API or direct bank transfer
4. All transactions and payout status are tracked in the `payment_logs` table

---

**Step 1 — Create a sandbox account:**
1. Go to https://sandbox.payhere.lk → Register as Merchant
2. Complete the test merchant registration
3. Log in → **Settings → Domains & Credentials**
4. Add `localhost` and `yourdomain.com` under Allowed Domains
5. Copy **Merchant ID** → `PAYHERE_MERCHANT_ID` and `NEXT_PUBLIC_PAYHERE_MERCHANT_ID`
6. Copy **Merchant Secret** → `PAYHERE_MERCHANT_SECRET` (**never expose this publicly**)

**Step 2 — Configure IPN (webhook) URL:**
1. PayHere Dashboard → **Settings → Notifications**
2. Set IPN URL to: `https://yourdomain.com/api/payments/webhooks`
3. For local testing, use [ngrok](https://ngrok.com) to expose localhost:
```bash
ngrok http 3000
# Copy the HTTPS URL e.g. https://abc123.ngrok.io
# Set IPN URL to: https://abc123.ngrok.io/api/payments/webhooks
```

**Step 3 — Trigger a booking payment (frontend):**
```typescript
// 1. Get checkout payload from your API
const res = await fetch('/api/payments/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ booking_id, amount_lkr }),
})
const payload = await res.json()
const { checkout_url, ...formFields } = payload

// 2. Submit a form to PayHere's hosted checkout
const form = document.createElement('form')
form.method = 'POST'
form.action = checkout_url
Object.entries(formFields).forEach(([key, value]) => {
  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = key
  input.value = value as string
  form.appendChild(input)
})
document.body.appendChild(form)
form.submit()
```

**Step 4 — Trigger vendor Premium subscription (frontend):**
```typescript
// Same pattern — call /api/payments/subscribe instead
const res = await fetch('/api/payments/subscribe', { method: 'POST' })
const payload = await res.json()
// submit form to payload.checkout_url (recurring checkout)
```

**Step 5 — Switch to production:**
1. Apply for a live PayHere merchant account at https://www.payhere.lk → Merchant Sign Up
2. You'll need: NIC/Passport, business registration, bank details
3. Once approved, replace sandbox credentials with live credentials in `.env.local`
4. Change `NEXT_PUBLIC_PAYHERE_ENV=production`
5. Update IPN URL to production domain in PayHere dashboard

**Supported payment methods (auto-shown in PayHere checkout):**

| Method | Cards | eZ Cash | FriMi | mCash | Internet Banking |
|---|---|---|---|---|---|
| Supported | ✅ Visa/MC/Amex | ✅ | ✅ | ✅ | ✅ All major SL banks |

**Code reference:** `src/lib/payhere.ts` — all hash generation, IPN verification, and payload builders.

---

### 4.3 Resend (Transactional Email)

1. Create account at https://resend.com
2. Verify your domain (add MX, TXT, DKIM records at your registrar)
3. Create API key → `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL=noreply@wedlink.lk`

**Create `src/lib/resend.ts`:**
```typescript
import { Resend } from 'resend'
export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingInquiryEmail(to: string, coupleNames: string, vendorName: string, date: string) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `New Booking Inquiry — ${coupleNames}`,
    html: `<h2>New inquiry from ${coupleNames} for ${date}</h2>
           <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/bookings">View →</a>`,
  })
}

export async function sendRSVPEmail(to: string, guestName: string, coupleNames: string, rsvpLink: string) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `RSVP — ${coupleNames}'s Wedding`,
    html: `<p>Dear ${guestName},</p>
           <a href="${rsvpLink}" style="background:#C21A6B;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">RSVP Now</a>`,
  })
}
```

Then call these functions in the API routes (marked with `// TODO: Send email` comments).

---

### 4.4 OpenAI (AI Features)

Used for: AI timeline generation, vendor recommendations, review sentiment.

1. Get API key at https://platform.openai.com/api-keys → `OPENAI_API_KEY`
2. Install the SDK: `npm install openai`
3. In `src/app/api/ai/timeline/route.ts`, uncomment the OpenAI block and remove the fallback return

```typescript
import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
// ... then uncomment the try/catch block in the POST handler
```

**Additional AI routes to build:**
- `POST /api/ai/recommendations` — Vendor recommendations based on couple preferences & budget
- `POST /api/ai/sentiment` — Review sentiment scoring (called after new review submitted)
- `POST /api/ai/budget-insights` — Budget optimisation suggestions

---

### 4.5 Twilio (SMS Notifications)

1. Create account at https://www.twilio.com
2. Get a phone number (use +94 prefix for Sri Lanka)
3. Copy Account SID → `TWILIO_ACCOUNT_SID`, Auth Token → `TWILIO_AUTH_TOKEN`, phone → `TWILIO_PHONE_NUMBER`
4. Install: `npm install twilio`

**Create `src/lib/twilio.ts`:**
```typescript
import twilio from 'twilio'
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function sendSMS(to: string, message: string) {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  })
}
```

> **Tip:** For Sri Lanka, consider Twilio's WhatsApp Business API for higher delivery rates than standard SMS.

---

## 5. Supabase Database Schema

Run this SQL in **Supabase → SQL Editor**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('couple','vendor','admin')) DEFAULT 'couple',
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE couple_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner1_name TEXT, partner2_name TEXT,
  wedding_date DATE, wedding_location TEXT,
  total_budget NUMERIC, guest_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL, category TEXT NOT NULL,
  description TEXT, location TEXT, city TEXT, district TEXT,
  price_min NUMERIC DEFAULT 0, price_max NUMERIC DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','suspended')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free','premium')),
  portfolio_images TEXT[] DEFAULT '{}',
  video_url TEXT, website_url TEXT, instagram_url TEXT, facebook_url TEXT,
  payhere_merchant_id TEXT, payout_enabled BOOLEAN DEFAULT FALSE,
  subscription_payment_id TEXT, subscription_expires_at TIMESTAMPTZ,
  avg_rating NUMERIC DEFAULT 0, review_count INTEGER DEFAULT 0,
  profile_completeness INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couple_profiles(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'inquiry' CHECK (status IN ('inquiry','negotiating','awaiting_payment','confirmed','completed','cancelled','expired','refunded','disputed')),
  event_date DATE NOT NULL, service_description TEXT,
  estimated_guests INTEGER, agreed_price NUMERIC, deposit_amount NUMERIC,
  payhere_payment_id TEXT, payhere_payment_method TEXT, invoice_url TEXT, notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL, attachment_url TEXT, attachment_type TEXT,
  is_read BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id),
  couple_id UUID NOT NULL REFERENCES couple_profiles(id),
  overall_rating NUMERIC NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  quality_rating NUMERIC, communication_rating NUMERIC, value_rating NUMERIC, punctuality_rating NUMERIC,
  comment TEXT, photos TEXT[], vendor_reply TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','flagged','removed')),
  sentiment_score NUMERIC, positive_themes TEXT[], negative_themes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couple_profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL, email TEXT, phone TEXT,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending','confirmed','declined')),
  meal_preference TEXT, dietary_restrictions TEXT,
  has_plus_one BOOLEAN DEFAULT FALSE, plus_one_name TEXT,
  side TEXT CHECK (side IN ('bride''s','groom''s','mutual')),
  group_label TEXT, table_id UUID,
  rsvp_token TEXT UNIQUE DEFAULT uuid_generate_v4()::TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seating_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couple_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, shape TEXT DEFAULT 'round', capacity INTEGER NOT NULL,
  position_x NUMERIC DEFAULT 0, position_y NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PayHere payment audit log (all IPN notifications stored here)
CREATE TABLE payment_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  payhere_payment_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'LKR',
  status TEXT NOT NULL,  -- 'success', 'failed', 'cancelled'
  method TEXT,           -- 'VISA', 'MASTER', 'eZ Cash', etc.
  raw_payload JSONB,     -- full IPN payload for debugging
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor subscription billing history
CREATE TABLE subscription_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_user_id UUID NOT NULL REFERENCES users(id),
  payhere_payment_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'LKR',
  status TEXT NOT NULL,  -- 'success', 'failed'
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor payout tracking (manual / disbursement API)
CREATE TABLE vendor_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id),
  booking_id UUID REFERENCES bookings(id),
  gross_amount NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL,
  net_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed')),
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couple_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, estimated_amount NUMERIC DEFAULT 0, actual_amount NUMERIC DEFAULT 0,
  vendor_category TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couple_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL, category TEXT, due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE, recommended_months_before INTEGER, notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_vendors (
  couple_id UUID REFERENCES couple_profiles(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (couple_id, vendor_id)
);

CREATE TABLE vendor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL, is_available BOOLEAN DEFAULT FALSE,
  UNIQUE(vendor_id, date)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, message TEXT,
  type TEXT CHECK (type IN ('message','booking','payment','review','checklist','milestone','rsvp','admin')),
  is_read BOOLEAN DEFAULT FALSE, action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  initiated_by UUID NOT NULL REFERENCES users(id),
  reason TEXT, description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','investigating','resolved','closed')),
  resolution TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mood_board_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couple_profiles(id) ON DELETE CASCADE,
  image_url TEXT, label TEXT, category TEXT,
  position_x NUMERIC DEFAULT 0, position_y NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couple_profiles(id) ON DELETE CASCADE,
  time TEXT NOT NULL, title TEXT NOT NULL, description TEXT, category TEXT,
  is_manual BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update vendor rating trigger
CREATE OR REPLACE FUNCTION update_vendor_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendor_profiles SET
    avg_rating = (SELECT ROUND(AVG(overall_rating)::NUMERIC,1) FROM reviews WHERE vendor_id=NEW.vendor_id AND status='approved'),
    review_count = (SELECT COUNT(*) FROM reviews WHERE vendor_id=NEW.vendor_id AND status='approved')
  WHERE id = NEW.vendor_id;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vendor_rating
AFTER INSERT OR UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_vendor_rating();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, avatar_url, role)
  VALUES (NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url',''),
    COALESCE(NEW.raw_user_meta_data->>'role','couple'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "couple_own" ON couple_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "vendors_public_read" ON vendor_profiles FOR SELECT USING (status = 'approved');
CREATE POLICY "vendors_own_write" ON vendor_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "bookings_parties" ON bookings FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM couple_profiles WHERE id = couple_id
    UNION SELECT user_id FROM vendor_profiles WHERE id = vendor_id
  )
);
CREATE POLICY "messages_parties" ON messages FOR ALL USING (auth.uid() = sender_id);
CREATE POLICY "reviews_public" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "reviews_couple_write" ON reviews FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM couple_profiles WHERE id = couple_id)
);
CREATE POLICY "guests_couple" ON guests FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM couple_profiles WHERE id = couple_id)
);
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (auth.uid() = user_id);
```

---

## 6. Feature Pages Reference

| Route | Description | Role |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Email + Google OAuth login | Public |
| `/signup` | Two-step role-aware signup | Public |
| `/vendors` | Marketplace with search & filters | Public |
| `/vendors/[id]` | Vendor profile + booking modal | Public |
| `/rsvp/[token]` | Guest RSVP form | Public |
| `/couple/dashboard` | Dashboard with countdown & stats | Couple |
| `/couple/bookings` | Booking list + dispute flow | Couple |
| `/couple/messages` | Real-time chat with vendors | Couple |
| `/couple/planning/checklist` | Smart task checklist | Couple |
| `/couple/planning/budget` | Budget tracker table | Couple |
| `/couple/planning/guests` | Guest list + RSVP management | Couple |
| `/couple/planning/seating` | Table & guest assignment | Couple |
| `/couple/planning/moodboard` | Visual inspiration board | Couple |
| `/couple/planning/timeline` | AI day-of timeline | Couple |
| `/couple/wishlist` | Saved/favourited vendors | Couple |
| `/vendor/dashboard` | Stats, bookings, chart | Vendor |
| `/vendor/profile` | Profile & portfolio editor | Vendor |
| `/vendor/bookings` | Manage booking requests | Vendor |
| `/vendor/messages` | Chat with couples | Vendor |
| `/vendor/availability` | Calendar blocker | Vendor |
| `/vendor/analytics` | Recharts analytics | Vendor |
| `/admin/dashboard` | Platform overview | Admin |
| `/admin/vendors` | Approve / reject vendors | Admin |
| `/admin/disputes` | Dispute investigation | Admin |
| `/admin/revenue` | Revenue & commission report | Admin |

---

## 7. Environment Variables

See `.env.example` for the full template. Summary:

| Variable | Service | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | ✅ |
| `PAYHERE_MERCHANT_ID` | PayHere | ✅ |
| `PAYHERE_MERCHANT_SECRET` | PayHere | ✅ |
| `NEXT_PUBLIC_PAYHERE_MERCHANT_ID` | PayHere | ✅ |
| `NEXT_PUBLIC_PAYHERE_ENV` | PayHere | ✅ (`sandbox` / `production`) |
| `RESEND_API_KEY` | Resend | Email only |
| `OPENAI_API_KEY` | OpenAI | AI features |
| `TWILIO_ACCOUNT_SID` | Twilio | SMS only |
| `TWILIO_AUTH_TOKEN` | Twilio | SMS only |
| `TWILIO_PHONE_NUMBER` | Twilio | SMS only |

---

## 8. Deployment (Vercel)

```bash
# Push to GitHub first
git add .
git commit -m "chore: ready for deployment"
git push origin main
```

1. Go to https://vercel.com → New Project → Import from GitHub
2. Framework: **Next.js** (auto-detected)
3. Add all env vars from `.env.example`
4. Click **Deploy**

**Post-deploy:**
- Supabase → Auth → URL Configuration → Add `https://yourdomain.com/auth/callback`
- PayHere → Update IPN URL to `https://yourdomain.com/api/payments/webhooks` in Dashboard → Settings → Notifications
- Custom domain: Vercel → Domains → Add `wedlink.lk`

---

## 9. Going Live Checklist

**Supabase**
- [ ] SQL schema deployed and triggers working
- [ ] RLS enabled on all sensitive tables
- [ ] Storage buckets created with correct policies
- [ ] Google OAuth redirect URIs set for production domain
- [ ] Test signup → couple_profiles row auto-created

**PayHere**
- [ ] Live merchant account approved by PayHere
- [ ] Production Merchant ID & Secret in env vars
- [ ] `NEXT_PUBLIC_PAYHERE_ENV=production`
- [ ] Production IPN URL set in PayHere Dashboard → Settings → Notifications
- [ ] Production domain added to PayHere Allowed Domains
- [ ] End-to-end payment test with a real card completed
- [ ] `payment_logs` and `subscription_logs` tables created in Supabase

**Resend**
- [ ] `wedlink.lk` domain verified
- [ ] `src/lib/resend.ts` helper created
- [ ] API calls wired up in booking, RSVP, and notification routes

**OpenAI**
- [ ] `npm install openai`
- [ ] `OPENAI_API_KEY` set
- [ ] AI route uncommented in `src/app/api/ai/timeline/route.ts`
- [ ] Usage billing cap set on OpenAI platform

**Twilio**
- [ ] `npm install twilio`
- [ ] `src/lib/twilio.ts` helper created
- [ ] Sri Lanka number or WhatsApp Business API set up

**General**
- [ ] `.env.local` is in `.gitignore`
- [ ] Admin user role set in Supabase: `UPDATE users SET role='admin' WHERE email='admin@wedlink.lk'`
- [ ] Error monitoring (Sentry): `npm install @sentry/nextjs`
- [ ] Lighthouse performance score >85
- [ ] Mobile responsiveness tested on real devices

---

*Built with ❤️ for Sri Lanka · WedLink © 2026*
