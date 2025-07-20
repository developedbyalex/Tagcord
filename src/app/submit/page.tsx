import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import TagForm from '@/components/forms/TagForm'
import Link from 'next/link'

export default async function SubmitTagPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return (
      <main className="min-h-screen bg-[var(--background)] py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-[var(--secondary)] rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[var(--text-secondary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Profile Not Found
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              There was an issue with your Discord profile. Please sign out and sign back in.
            </p>
            <Link
              href="/"
              className="text-[var(--accent)] hover:text-[var(--foreground)] font-medium transition-colors"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Submit Your Discord Tag
          </h1>
          <p className="text-[var(--text-secondary)]">
            Share your Discord community with others and help them discover awesome servers
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <TagForm
            user={user}
            profile={profile}
            onSuccess={() => {
              // Redirect to all tags page after successful submission
              window.location.href = '/tags'
            }}
          />
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-[var(--background)] border border-[var(--border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Submission Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--success)] mt-0.5">✓</span>
              Use your real Discord username or tag
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--success)] mt-0.5">✓</span>
              Write a clear description of your community
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--success)] mt-0.5">✓</span>
              Choose an appropriate image that represents your server
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--error)] mt-0.5">✗</span>
              No spam, explicit content, or misleading information
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--error)] mt-0.5">✗</span>
              Don't submit multiple tags for the same community
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
} 