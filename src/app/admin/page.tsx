import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import AdminPanel from '@/components/admin/AdminPanel'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const adminStatus = await isAdmin(user.id)
  if (!adminStatus) {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] font-medium transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Admin Panel
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage servers and user accounts
          </p>
        </div>

        {/* Admin Panel */}
        <AdminPanel />
      </div>
    </main>
  )
} 