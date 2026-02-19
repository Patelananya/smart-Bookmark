# Smart Bookmark App

A production-ready, real-time bookmark manager built with Next.js 14+, Supabase, and Tailwind CSS.

## 🚀 Live Demo

[Live URL Placeholder]

![App Screenshot Placeholder]

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Icons**: Lucide React

## 🏗 Architecture

The application follows a modern Server-Side Rendering (SSR) architecture with Client-Side interactivity where needed.

- **Authentication**: Handled via Supabase Auth (Google OAuth). Middleware protects routes and redirects unauthenticated users.
- **Data Fetching**: 
  - Initial auth check happens on the server (`page.tsx`).
  - Data fetching and subscriptions happen on the client (`BookmarkList.tsx`) to support real-time updates.
- **Real-time**: Uses Supabase Realtime to subscribe to database changes (`INSERT`, `DELETE`) and update the UI instantly across all active sessions.

## 🗄 Database Schema

The app uses a single table `bookmarks` in Supabase.

### Table: `bookmarks`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary Key (auto-generated) |
| `user_id` | uuid | Foreign Key to `auth.users` |
| `title` | text | Bookmark title |
| `url` | text | Bookmark URL |
| `created_at` | timestamp | Creation timestamp |

### 🔒 Row Level Security (RLS)

RLS is strictly enforced to ensure data privacy. Users can **only** access their own data.

- **SELECT**: Users can only view rows where `user_id` matches their authenticated ID.
- **INSERT**: Users can only insert rows where `user_id` matches their authenticated ID.
- **DELETE**: Users can only delete rows where `user_id` matches their authenticated ID.

## ⚡ Real-Time Implementation

Real-time updates are achieved using Supabase's `subscribe()` method.
- The `BookmarkList` component subscribes to `INSERT` and `DELETE` events on the `bookmarks` table.
- A filter `user_id=eq.${user.id}` ensures clients only receive events relevant to them.
- When an event occurs, the local state is updated immediately without a page refresh.

## 🚀 Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Configure Supabase**
   - Create a new project on [Supabase](https://supabase.com).
   - Go to **SQL Editor** and run the contents of `supabase_schema.sql`.
   - Go to **Authentication > Providers** and enable **Google**.
   - Add the callback URL: `https://<your-vercel-project>.vercel.app/auth/callback` (and `http://localhost:3000/auth/callback` for local dev).

3. **Deploy on Vercel**
   - Import the repository on [Vercel](https://vercel.com).
   - Add Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - Click **Deploy**.

## 🧩 Challenges & Solutions

### 1. Middleware with Supabase Auth
**Challenge**: Ensuring server-side route protection while maintaining session state across client and server.
**Solution**: Used `@supabase/ssr` with `createServerClient` in middleware to manage cookies securely and handle token refreshing.

### 2. Real-time Synchronization
**Challenge**: Keeping the UI in sync when bookmarks are added from different tabs/devices.
**Solution**: Implemented Supabase Realtime subscriptions with RLS policies ensuring secure and instant updates.

### 3. Type Safety
**Challenge**: Ensuring end-to-end type safety with Supabase.
**Solution**: While this project uses loose typing for simplicity in the demo, in a full production environment, we would generate TypeScript definitions from the database schema using Supabase CLI.

## 📦 Local Development

1. Clone the repo
2. Install dependencies: `npm install`
3. Set up `.env.local` with your Supabase credentials.
4. Run the development server: `npm run dev`
