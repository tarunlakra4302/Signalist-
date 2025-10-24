# Signalist Stock Tracker App - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Setup & Installation](#setup--installation)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [API & Server Actions](#api--server-actions)
8. [Event-Driven Workflows](#event-driven-workflows)
9. [Authentication](#authentication)
10. [Environment Variables](#environment-variables)
11. [Development Workflow](#development-workflow)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Signalist** is a modern, AI-powered stock market tracking application built with Next.js 15. It enables users to:
- Track real-time stock prices with interactive charts
- Create personalized watchlists
- Set price alerts and receive email notifications
- Explore company insights (financials, news, ratings)
- Receive AI-generated daily market summaries

### Key Features
- **Real-time Data**: Integration with Finnhub API for live stock data
- **AI-Powered Insights**: Gemini AI for personalized market summaries and welcome emails
- **Event-Driven Architecture**: Inngest for automated workflows (alerts, daily digests)
- **Modern Auth**: Better Auth for secure authentication with email/password
- **Responsive UI**: Shadcn UI components with TailwindCSS

---

## Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router and Turbopack
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **TailwindCSS 4** - Utility-first CSS framework
- **Shadcn UI** - Accessible, customizable component library
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Next Themes** - Dark/light mode support

### Backend
- **Next.js Server Actions** - Server-side logic
- **MongoDB 6.19.0** - NoSQL database
- **Mongoose 8.18.0** - MongoDB ODM
- **Better Auth 1.3.7** - Authentication framework
- **Inngest 3.40.1** - Event-driven workflow engine

### External APIs
- **Finnhub API** - Real-time financial data
- **Gemini AI** - AI-powered content generation
- **Nodemailer 7.0.6** - Email delivery

---

## Architecture

### Application Flow

```
User Request
    ↓
Next.js App Router (app/)
    ↓
Server Actions (lib/actions/)
    ↓
Database (MongoDB via Mongoose)
    ↓
External APIs (Finnhub, Gemini)
    ↓
Inngest Events (Background Jobs)
    ↓
Email Notifications (Nodemailer)
```

### Key Architectural Patterns

1. **Server Components First**: Leverages Next.js 15 Server Components for optimal performance
2. **Server Actions**: All database operations use Server Actions (not REST API routes)
3. **Event-Driven Workflows**: Background jobs handled by Inngest
4. **Singleton Connections**: MongoDB connection uses global caching pattern
5. **Type Safety**: End-to-end TypeScript with strict typing

---

## Setup & Installation

### Prerequisites
- Node.js 20+ and npm
- MongoDB Atlas account OR local MongoDB installation
- API keys for:
  - Finnhub (https://finnhub.io)
  - Google Gemini (https://aistudio.google.com)
  - Inngest (https://www.inngest.com)
  - Email provider (for Nodemailer)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/adrianhajdin/signalist_stock-tracker-app.git
   cd signalist_stock-tracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV='development'
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # FINNHUB
   NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key
   FINNHUB_BASE_URL=https://finnhub.io/api/v1

   # MONGODB
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/signalist

   # BETTER AUTH
   BETTER_AUTH_SECRET=your_generated_secret_key
   BETTER_AUTH_URL=http://localhost:3000

   # GEMINI
   GEMINI_API_KEY=your_gemini_api_key

   # NODEMAILER
   NODEMAILER_EMAIL=your_email@gmail.com
   NODEMAILER_PASSWORD=your_app_password
   ```

4. **Generate Better Auth Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   Copy the output to `BETTER_AUTH_SECRET`

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

6. **Run Inngest dev server** (in a separate terminal)
   ```bash
   npx inngest-cli@latest dev
   ```

---

## Project Structure

```
signalist_stock-tracker-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/
│   │   │   └── page.tsx         # Sign-in page
│   │   └── sign-up/
│   │       └── page.tsx         # Sign-up page
│   ├── (root)/                   # Main application routes
│   │   ├── page.tsx             # Dashboard/home page
│   │   └── stocks/
│   │       └── [symbol]/
│   │           └── page.tsx     # Individual stock detail page
│   ├── api/
│   │   └── inngest/
│   │       └── route.ts         # Inngest webhook endpoint
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── forms/                   # Form components
│   │   ├── InputField.tsx
│   │   ├── SelectField.tsx
│   │   └── CountrySelectField.tsx
│   ├── Header.tsx               # App header/navbar
│   ├── NavItems.tsx             # Navigation menu
│   ├── SearchCommand.tsx        # Stock search command palette
│   ├── TradingViewWidget.tsx    # Stock chart widget
│   ├── UserDropdown.tsx         # User menu dropdown
│   └── WatchlistButton.tsx      # Add to watchlist button
│
├── database/                     # Database layer
│   ├── mongoose.ts              # MongoDB connection
│   └── models/
│       └── watchlist.model.ts   # Watchlist schema
│
├── lib/                          # Utility libraries
│   ├── actions/                 # Server Actions
│   │   ├── auth.actions.ts     # Authentication actions
│   │   ├── user.actions.ts     # User CRUD operations
│   │   ├── watchlist.actions.ts # Watchlist operations
│   │   └── finnhub.actions.ts  # Finnhub API integration
│   ├── better-auth/
│   │   └── auth.ts             # Better Auth configuration
│   ├── inngest/
│   │   ├── client.ts           # Inngest client setup
│   │   ├── functions.ts        # Inngest workflow functions
│   │   └── prompts.ts          # AI prompts for email generation
│   ├── nodemailer/
│   │   └── index.ts            # Email service
│   └── utils.ts                 # Utility functions
│
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
├── scripts/                      # Utility scripts
│   └── test-db.mjs             # Database connection test
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

## Database Schema

### Collections

#### 1. **Users** (Managed by Better Auth)
Better Auth automatically creates and manages user collections with the following key fields:
- `id` - Unique user identifier
- `email` - User email (unique)
- `name` - User's full name
- `emailVerified` - Email verification status
- `createdAt` - Account creation timestamp
- Custom fields:
  - `country` - User's country
  - `investmentGoals` - Investment objectives
  - `riskTolerance` - Risk preference (low/medium/high)
  - `preferredIndustry` - Preferred stock sectors

#### 2. **Watchlist**
```typescript
{
  userId: string;        // Reference to user
  symbol: string;        // Stock ticker (uppercase)
  company: string;       // Company name
  addedAt: Date;        // Timestamp when added
}

// Indexes:
// - { userId: 1, symbol: 1 } - Unique compound index (prevents duplicates)
// - { userId: 1 } - Query optimization
```

#### 3. **Sessions** (Managed by Better Auth)
Handles user authentication sessions automatically.

---

## API & Server Actions

### Authentication Actions (`lib/actions/auth.actions.ts`)

```typescript
// Sign up a new user
signUpUser(data: SignUpFormData): Promise<Response>

// Sign in existing user
signInUser(data: SignInFormData): Promise<Response>

// Sign out current user
signOutUser(): Promise<void>

// Get current session
getSession(): Promise<Session | null>
```

### User Actions (`lib/actions/user.actions.ts`)

```typescript
// Get all users for email notifications
getAllUsersForNewsEmail(): Promise<UserForNewsEmail[]>
```

### Watchlist Actions (`lib/actions/watchlist.actions.ts`)

```typescript
// Add stock to watchlist
addToWatchlist(userId: string, symbol: string, company: string): Promise<Response>

// Remove stock from watchlist
removeFromWatchlist(userId: string, symbol: string): Promise<Response>

// Get user's watchlist
getUserWatchlist(userId: string): Promise<WatchlistItem[]>

// Check if stock is in watchlist
isInWatchlist(userId: string, symbol: string): Promise<boolean>

// Get watchlist symbols by user email
getWatchlistSymbolsByEmail(email: string): Promise<string[]>
```

### Finnhub Actions (`lib/actions/finnhub.actions.ts`)

```typescript
// Get stock quote
getQuote(symbol: string): Promise<StockQuote>

// Get company profile
getCompanyProfile(symbol: string): Promise<CompanyProfile>

// Get market news
getNews(symbols?: string[]): Promise<MarketNewsArticle[]>

// Search stocks
searchStocks(query: string): Promise<SearchResult[]>

// Get stock candles (historical data)
getCandles(symbol: string, resolution: string, from: number, to: number): Promise<Candles>
```

---

## Event-Driven Workflows

Inngest handles background jobs and scheduled tasks.

### Workflow Functions (`lib/inngest/functions.ts`)

#### 1. **Welcome Email on Sign Up**
```typescript
Event: 'app/user.created'
Trigger: User registration
Function: sendSignUpEmail()

Steps:
1. Receive user data (country, goals, risk tolerance, industry)
2. Generate personalized intro using Gemini AI
3. Send welcome email via Nodemailer
```

#### 2. **Daily News Summary**
```typescript
Event: 'app/send.daily.news' OR Cron: '0 12 * * *' (12 PM daily)
Trigger: Manual event or scheduled cron
Function: sendDailyNewsSummary()

Steps:
1. Fetch all users from database
2. For each user:
   - Get their watchlist symbols
   - Fetch news for those symbols (fallback to general news)
   - Limit to 6 articles per user
3. Generate AI summary of news using Gemini
4. Send personalized email to each user
```

### Triggering Events

```typescript
// From server actions or API routes
import { inngest } from '@/lib/inngest/client';

// Trigger welcome email
await inngest.send({
  name: 'app/user.created',
  data: {
    email: user.email,
    name: user.name,
    country: user.country,
    investmentGoals: user.investmentGoals,
    riskTolerance: user.riskTolerance,
    preferredIndustry: user.preferredIndustry
  }
});

// Trigger daily news summary
await inngest.send({
  name: 'app/send.daily.news',
  data: {}
});
```

---

## Authentication

### Better Auth Configuration

**Features:**
- Email/password authentication
- Session management with cookies
- No email verification required (configurable)
- Auto sign-in after registration
- MongoDB adapter for data persistence

**Key Settings:**
```typescript
// lib/better-auth/auth.ts
{
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true
  }
}
```

### Usage in Components

```typescript
// Client-side
import { useSession } from '@/lib/better-auth/client';

const { data: session, isPending } = useSession();

// Server-side (Server Components)
import { auth } from '@/lib/better-auth/auth';

const session = await auth.api.getSession({
  headers: await headers()
});
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `NEXT_PUBLIC_BASE_URL` | Application URL | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.net/db` |
| `BETTER_AUTH_SECRET` | Auth encryption key | Generated 32-byte base64 string |
| `BETTER_AUTH_URL` | Auth callback URL | Same as `NEXT_PUBLIC_BASE_URL` |
| `GEMINI_API_KEY` | Google Gemini API key | From Google AI Studio |
| `NEXT_PUBLIC_FINNHUB_API_KEY` | Finnhub API key | From Finnhub.io |
| `FINNHUB_BASE_URL` | Finnhub API endpoint | `https://finnhub.io/api/v1` |
| `NODEMAILER_EMAIL` | Sender email address | `your-email@gmail.com` |
| `NODEMAILER_PASSWORD` | Email app password | Gmail app password |

### Getting API Keys

1. **MongoDB URI**
   - Sign up at https://mongodb.com/atlas
   - Create free cluster
   - Get connection string from "Connect" button

2. **Better Auth Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. **Finnhub API Key**
   - Register at https://finnhub.io
   - Get free API key from dashboard

4. **Gemini API Key**
   - Visit https://aistudio.google.com
   - Create API key in settings

5. **Nodemailer (Gmail)**
   - Enable 2FA on Gmail account
   - Generate app password in account settings
   - Use app password (not regular password)

---

## Development Workflow

### Running the Application

1. **Start Next.js dev server**
   ```bash
   npm run dev
   ```
   App runs on http://localhost:3000 (or next available port)

2. **Start Inngest dev server** (separate terminal)
   ```bash
   npx inngest-cli@latest dev
   ```
   Inngest UI runs on http://localhost:8288

3. **Test database connection**
   ```bash
   npm run test:db
   ```

### Available Scripts

```json
{
  "dev": "next dev --turbopack",      // Start dev server with Turbopack
  "build": "next build --turbopack",  // Production build
  "start": "next start",              // Start production server
  "lint": "eslint",                   // Run ESLint
  "test:db": "node scripts/test-db.mjs" // Test MongoDB connection
}
```

### Development Tips

1. **Hot Reload**: Turbopack provides instant hot module replacement
2. **Type Checking**: Run `npx tsc --noEmit` for type errors
3. **Database Changes**: Restart dev server after schema changes
4. **Environment Updates**: Restart both Next.js and Inngest after `.env` changes

---

## Troubleshooting

### Common Issues

#### 1. **MongoDB Connection Error**
```
Error: MONGODB_URI must be set within .env
```

**Solution:**
- Ensure `.env` file exists in root directory
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas IP whitelist (use 0.0.0.0/0 for development)
- Test connection: `npm run test:db`

#### 2. **Better Auth Error: No Secret**
```
Error: BETTER_AUTH_SECRET is required
```

**Solution:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Add output to `.env` as `BETTER_AUTH_SECRET`

#### 3. **Port Already in Use**
```
⚠ Port 3000 is in use, using port 3002
```

**Solution:**
- Update `NEXT_PUBLIC_BASE_URL` and `BETTER_AUTH_URL` in `.env` to match the new port
- Or kill process on port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F

  # Mac/Linux
  lsof -ti:3000 | xargs kill -9
  ```

#### 4. **Finnhub API Rate Limit**
```
Error: API rate limit exceeded
```

**Solution:**
- Free tier: 60 calls/minute
- Implement request caching
- Upgrade to paid plan if needed

#### 5. **Email Not Sending**
```
Error: Invalid login credentials
```

**Solution:**
- For Gmail: Use App Password, not regular password
- Enable 2FA first, then generate app password
- Check `NODEMAILER_EMAIL` and `NODEMAILER_PASSWORD` in `.env`

#### 6. **Inngest Events Not Triggering**
```
Events sent but functions not running
```

**Solution:**
- Ensure Inngest dev server is running: `npx inngest-cli@latest dev`
- Check Inngest dashboard at http://localhost:8288
- Verify event names match exactly
- Check function logs for errors

---

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Better Auth Docs**: https://www.better-auth.com/docs
- **Inngest Docs**: https://www.inngest.com/docs
- **Shadcn UI**: https://ui.shadcn.com/docs
- **Finnhub API**: https://finnhub.io/docs/api
- **MongoDB Docs**: https://www.mongodb.com/docs

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## License

This project is part of a JavaScript Mastery tutorial.

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/adrianhajdin/signalist_stock-tracker-app/issues
- Discord Community: https://discord.com/invite/n6EdbFJ
- YouTube Tutorial: https://youtu.be/gu4pafNCXng
