import Link from 'next/link'
import SignInButton from '@/components/auth/SignInButton'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="card text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Sign in to Tagcord.gg
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Connect with Discord to submit and manage your tags
          </p>

          {/* Sign In Button */}
          <div className="mb-6">
            <SignInButton />
          </div>

          {/* Features */}
          <div className="text-left space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--success)] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                Submit your Discord tags
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--success)] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                Discover new communities
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--success)] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                Safe and secure authentication
              </span>
            </div>
          </div>

          {/* Back Link */}
          <Link
            href="/"
            className="text-[var(--accent)] hover:text-[var(--foreground)] text-sm font-medium transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-[var(--text-secondary)] text-center mt-6">
          We only access your basic Discord profile information (username, avatar, ID). 
          We never access your messages or server data.
        </p>
      </div>
    </main>
  )
} 