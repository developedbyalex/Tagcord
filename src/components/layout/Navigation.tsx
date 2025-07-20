import { createClient } from '@/lib/supabase-server'
import SignInButton from '@/components/auth/SignInButton'
import UserMenu from '@/components/auth/UserMenu'
import Link from 'next/link'

export default async function Navigation() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <nav className="bg-[var(--secondary)] border-b border-[var(--border)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold">Tagcord.gg</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/tags"
              className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              All Tags
            </Link>
            {user && (
              <Link
                href="/submit"
                className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                Submit Tag
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu user={user} profile={profile} />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-[var(--border)]">
        <div className="px-4 py-3 space-y-2">
          <Link
            href="/"
            className="block text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/tags"
            className="block text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            All Tags
          </Link>
          {user && (
            <Link
              href="/submit"
              className="block text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Submit Tag
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
} 