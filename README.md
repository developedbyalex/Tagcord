# 🎮 Tagcord.gg

A modern, clean Discord tag explorer built with Next.js and Tailwind CSS. Discover and share amazing Discord communities with our beautiful, responsive interface.

## ✨ Features

- 🔐 **Discord OAuth** - Secure authentication with Discord
- 🎨 **Discord Theme** - Beautiful dark theme matching Discord's design
- 📝 **Tag Submission** - Easy form to submit Discord tags
- 🔍 **Tag Discovery** - Search and browse community tags
- 📱 **Mobile Friendly** - Fully responsive design
- ⚡ **Fast & Modern** - Built with Next.js 15 and Tailwind CSS 4
- 🔒 **Secure** - Row Level Security with Supabase

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tagcord.gg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📖 Full Setup Instructions

For detailed setup instructions including Supabase and Discord configuration, see [SETUP.md](./SETUP.md).

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Discord OAuth
- **Deployment**: Ready for Vercel, Netlify, etc.

## 📁 Project Structure

```
tagcord.gg/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── lib/                 # Utility functions and configs
│   └── types/               # TypeScript type definitions
├── database-setup.sql       # Database schema and setup
└── public/                  # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with 💜 for the Discord community**
