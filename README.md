# Tagcord.gg

A modern Discord community discovery platform built with Next.js and Supabase. Tagcord.gg provides a clean, intuitive interface for discovering and sharing Discord communities through visual tags and detailed descriptions.

## Features

- **Discord OAuth Authentication** - Secure user authentication through Discord
- **Community Tag Submission** - Streamlined form for submitting Discord server information with category tags
- **Tag Discovery** - Browse and search Discord communities with visual tags and category filtering
- **Category System** - Add up to 3 categories per Discord tag (Gaming, Coding, Design, etc.)
- **Advanced Filtering** - Filter tags by categories and search across multiple fields
- **User Account Management** - Settings page with profile information and account deletion
- **Admin Panel** - Server management and moderation tools for administrators
- **Responsive Design** - Mobile-friendly interface optimized for all devices
- **Modern UI** - Clean design with Discord-inspired theming
- **Database Integration** - Powered by Supabase with Row Level Security
- **Fast Performance** - Built with Next.js 15 and optimized for speed

## Technology Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Discord OAuth
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## Project Structure

```
tagcord.gg/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── api/               # API routes
│   │   │   ├── delete-account/ # Account deletion endpoint
│   │   │   └── admin/         # Admin API endpoints
│   │   ├── admin/             # Admin panel page
│   │   ├── settings/          # User settings page
│   │   ├── submit/            # Tag submission page
│   │   ├── tags/              # Tag browsing page
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   └── tags/              # Tag display components
│   ├── lib/                   # Utility functions and configs
│   │   ├── supabase.ts        # Client-side Supabase client
│   │   └── supabase-server.ts # Server-side Supabase client
│   └── types/                 # TypeScript type definitions
├── database-setup.sql         # Database schema and RLS policies
├── CODE_OF_CONDUCT.md        # Community guidelines
├── SETUP.md                  # Detailed setup instructions
└── public/                   # Static assets
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/developedbyalex/Tagcord.git
   cd tagcord.gg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env.local` file with your Supabase and Discord credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database setup**
   Run the SQL commands in `database-setup.sql` in your Supabase dashboard

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Detailed Setup

For comprehensive setup instructions including Supabase project creation, Discord OAuth configuration, and deployment guidelines, refer to [SETUP.md](./SETUP.md).

## Database Schema

The application uses a single `tags` table with the following structure:
- Tag metadata (name, description, categories)
- Discord server information (invite links, member counts)
- User associations and timestamps
- Image URLs for server logos
- Category tags (array of up to 3 categories per tag)

Row Level Security (RLS) policies ensure users can only modify their own submissions while allowing public read access.

### Categories

Tags can be categorized with up to 3 categories from the following options:
- Gaming, Coding, Design, Small Community, Music, Art, Education, Technology
- Social, Business, Entertainment, Sports, Health, Travel, Food, Fashion
- Science, Politics, Religion, Other

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes with appropriate tests
4. Commit with descriptive messages (`git commit -m 'Add new feature'`)
5. Push to your fork (`git push origin feature/new-feature`)
6. Submit a Pull Request

Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

## Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Ensure mobile responsiveness
- Test authentication flows thoroughly

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues, feature requests, or questions, please open an issue on GitHub or contact the maintainers.

---

Built for the Discord community by developers who understand the importance of finding the right servers.
