import { createClient } from '@/lib/supabase-server'
import TagsGrid from '@/components/tags/TagsGrid'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  
  let tags = []
  let error = null
  
  try {
    // Get recent tags (limit to 6 for cleaner layout)
    const { data, error: fetchError } = await supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)
    
    tags = data || []
    error = fetchError
  } catch (err) {
    console.error('Error fetching tags:', err)
    error = err
  }

  let user = null
  try {
    const { data: { user: userData } } = await supabase.auth.getUser()
    user = userData
  } catch (err) {
    console.error('Error fetching user:', err)
    // Continue without user data
  }

  if (error) {
    console.error('Error fetching tags:', error)
    // Continue with empty tags array instead of breaking
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-[var(--accent)] rounded-3xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-[var(--foreground)] mb-6 tracking-tight">
              Tagcord<span className="text-[var(--accent)]">.gg</span>
            </h1>
            <p className="text-xl sm:text-2xl text-[var(--text-secondary)] mb-12 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform to <span className="text-[var(--accent)] font-semibold">discover</span> and <span className="text-[var(--accent)] font-semibold">share</span> amazing Discord tags.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/tags"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[var(--accent)] rounded-xl hover:bg-[#677bc4] transition-colors"
              >
                Explore Tags
              </Link>
              {user && (
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] rounded-xl hover:bg-[var(--accent)] hover:text-white transition-colors"
                >
                  Share Your Server
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Communities Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              Recent Communities
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Discover the latest Discord servers shared by our community
            </p>
            <Link
              href="/tags"
              className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--foreground)] font-medium transition-colors group"
            >
              View all communities
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {tags && tags.length > 0 ? (
            <TagsGrid tags={tags} />
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-[var(--secondary)] rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-[var(--text-secondary)]"
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
              <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                Be the Pioneer
              </h3>
              <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                No communities yet! Be the first to share your awesome Discord server with the world.
              </p>
              {user ? (
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[var(--accent)] rounded-xl hover:bg-[#677bc4] transition-colors"
                >
                  Submit the First Community
                </Link>
              ) : (
                <div className="space-y-4">
                  <p className="text-[var(--text-secondary)]">
                    Sign in with Discord to submit your server
                  </p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[var(--accent)] rounded-xl hover:bg-[#677bc4] transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--background)] border-t border-[var(--border)] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-[var(--foreground)]">Tagcord.gg</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-[var(--text-secondary)]">
              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="flex items-center gap-2">
                  <span>Created in the</span>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United_Kingdom.svg.png?20190917170937" 
                    alt="UK Flag" 
                    className="w-6 h-4 rounded"
                  />
                  <span>by</span>
                  <a 
                    href="https://byalex.gg/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:text-[#677bc4] font-medium transition-colors"
                  >
                    Alex
                  </a>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  We are not affiliated with Discord.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
