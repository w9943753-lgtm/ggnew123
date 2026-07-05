# Hafiz Store - Online Grocery Store for Pakistan

A production-ready full-stack online grocery store built with Next.js, TypeScript, Tailwind CSS, and Supabase. Mobile-first design optimized for Pakistani grocery shoppers.

## Tech Stack

- **Frontend:** React 19, Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, Swiper.js
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, RLS)
- **State:** Zustand, TanStack Query
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Features

### Customer Features
- Homepage with hero, categories, flash sale timer, product sliders, promo widgets
- Product listing with filters (price, brand, category, rating, availability)
- Product detail with image gallery, reviews, related products
- Cart with live updates, coupon system
- Checkout with multiple payment methods (COD, JazzCash, EasyPaisa, Bank Transfer, Card)
- User registration, login, forgot password
- Profile, orders, addresses, wishlist, reviews, notifications
- Search with instant suggestions
- PWA support

### Admin Panel
- Dashboard with stats, charts, recent orders
- Product management (CRUD, bulk operations, image upload)
- Order management with status timeline
- Category, Brand, Customer, Coupon, Banner management
- Reviews management
- Store settings
- Responsive sidebar navigation

### Technical Features
- Mobile-first responsive design
- SEO optimized (sitemap, robots.txt, meta tags)
- Skeleton loading states
- Smooth Framer Motion animations
- Dark mode ready
- WhatsApp & Call floating buttons
- Supabase RLS policies
- Type-safe with TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd hafiz-store

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=+923000000000
```

### Supabase Setup

1. Create a new Supabase project (or use an existing one)
2. Go to **SQL Editor** in the Supabase dashboard
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql` and run it
4. Copy the entire contents of `supabase/migrations/002_seed_data.sql` and run it
5. Go to **Storage** and create these buckets (set each to **Public**):
   - `products`
   - `categories`
   - `brands`
   - `banners`
   - `avatars`
6. Go to **Settings > API** and copy the Project URL, Anon Key, and Service Role Key
7. Paste them into `.env.local`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (shop)/          # Customer-facing pages
│   │   ├── page.tsx     # Homepage
│   │   ├── product/     # Product detail
│   │   ├── category/    # Category pages
│   │   ├── cart/        # Shopping cart
│   │   ├── checkout/    # Checkout
│   │   ├── search/      # Search
│   │   └── wishlist/    # Wishlist
│   ├── (auth)/          # Auth pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (account)/       # User account
│   │   ├── profile/
│   │   ├── orders/
│   │   └── addresses/
│   ├── admin/           # Admin panel
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   └── settings/
│   └── api/             # API routes
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   ├── home/            # Homepage components
│   ├── product/         # Product components
│   └── admin/           # Admin components
├── lib/                 # Supabase client setup
├── store/               # Zustand stores
├── types/               # TypeScript types
├── utils/               # Utility functions
├── hooks/               # Custom hooks
├── constants/           # App constants
└── validators/          # Zod schemas
supabase/
└── migrations/          # SQL migrations
```

## Payment Integration

### Current: Cash on Delivery
Works out of the box. No setup needed.

### Future: JazzCash / EasyPaisa
Environment variables are ready. Integration architecture supports:
1. Set credentials in `.env.local`
2. Implement API calls in edge functions
3. Webhook handler at `/api/webhook`

## Customization

### Colors
Edit `src/app/globals.css` and `src/constants/index.ts` to change the color theme.

### Products
Products are stored in Supabase. Seed data includes 32 Pakistani grocery products with realistic PKR pricing.

### Logo
Replace `public/images/logo.png` with your logo.

## License

Private - Hafiz Store
