# 🚀 Tagcord.gg Setup Instructions

A modern Discord tag explorer built with Next.js, Supabase, and Tailwind CSS.

## ✅ Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Discord application (for OAuth)

## 🛠️ Setup Steps

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Run the database setup** by executing the SQL in `database-setup.sql` in your Supabase Dashboard SQL Editor
3. **Configure Discord OAuth**:
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Discord provider
   - Add your Discord app credentials

### 3. Discord Application Setup

1. **Create a Discord application** at [discord.com/developers/applications](https://discord.com/developers/applications)
2. **Add OAuth redirect URLs**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`
3. **Copy the Client ID and Secret** to your Supabase Discord OAuth configuration

### 4. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🎨 Features Included

- ✅ **Discord OAuth Authentication** - Sign in with Discord
- ✅ **Modern Discord Theme** - Dark theme with Discord colors
- ✅ **Tag Submission System** - Submit Discord tags with images
- ✅ **Tag Discovery** - Browse and search through tags
- ✅ **Responsive Design** - Mobile-friendly layout
- ✅ **Real-time Updates** - Powered by Supabase
- ✅ **Image Selector** - Predefined Discord-themed images
- ✅ **Search & Pagination** - Find tags easily
- ✅ **Loading States** - Skeleton loading and toasts

## 📱 Mobile Optimizations

- Responsive grid layouts
- Touch-friendly buttons (44px minimum)
- Optimized input sizes to prevent iOS zoom
- Custom scrollbars
- Collapsible mobile navigation

## 🔐 Security Features

- Row Level Security (RLS) enabled
- Protected routes for authenticated users
- Secure Discord OAuth flow
- Input validation and sanitization

## 🚀 Deployment

The app is ready to deploy to Vercel, Netlify, or any other Next.js hosting platform:

1. **Update environment variables** in your hosting platform
2. **Update Discord OAuth redirect URLs** to your production domain
3. **Deploy!**

## 🎯 What's Next?

- Add user profiles and tag management
- Implement tag categories and filtering
- Add server statistics and analytics
- Create tag favorites and bookmarking
- Add moderation features

---

**Built with love for the Discord community! 💙** 