import { createClient } from '@/lib/supabase-server'
import TagsGrid from '@/components/tags/TagsGrid'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Get recent tags (limit to 8 for homepage)
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  const { data: { user } } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching tags:', error)
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[var(--secondary)] to-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[var(--accent)] rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-3xl">T</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-[var(--foreground)] mb-6">
              Tagcord.gg
            </h1>
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Discover and share amazing Discord communities. 
              Find your perfect server with our clean, modern tag explorer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tags"
                className="btn-discord px-8 py-4 text-lg font-semibold hover:transform hover:scale-105 transition-all duration-200"
              >
                Explore Tags
              </Link>
              {user && (
                <Link
                  href="/submit"
                  className="px-8 py-4 text-lg font-semibold bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] rounded-lg hover:bg-[var(--accent)] hover:text-white transition-all duration-200"
                >
                  Submit Your Tag
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Tags Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                Recent Tags
              </h2>
              <p className="text-[var(--text-secondary)]">
                Latest Discord communities shared by our users
              </p>
            </div>
            <Link
              href="/tags"
              className="text-[var(--accent)] hover:text-[var(--foreground)] font-medium transition-colors"
            >
              View all tags →
            </Link>
          </div>

          <TagsGrid tags={tags || []} />

          {(!tags || tags.length === 0) && (
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                No tags yet
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Be the first to share your Discord community!
              </p>
              {user ? (
                <Link
                  href="/submit"
                  className="btn-discord"
                >
                  Submit the First Tag
                </Link>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">
                  Sign in to submit your Discord tag
                </p>
              )}
            </div>
          )}
        </div>
      </section>


    </main>
  )
}
