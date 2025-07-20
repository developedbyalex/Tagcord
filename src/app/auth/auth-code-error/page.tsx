import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="card text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[var(--error)] rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Authentication Error
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            There was an issue signing you in with Discord. Please try again.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="btn-discord w-full block text-center"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="text-[var(--accent)] hover:text-[var(--foreground)] text-sm font-medium transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-xs text-[var(--text-secondary)] text-center">
          <p className="mb-2">
            If this issue persists, make sure:
          </p>
          <ul className="text-left space-y-1 max-w-xs mx-auto">
            <li>• You have a Discord account</li>
            <li>• You granted permission to the app</li>
            <li>• Your browser allows cookies</li>
          </ul>
        </div>
      </div>
    </main>
  )
} 