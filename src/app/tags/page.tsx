'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Tag } from '@/types/database'
import TagsGrid from '@/components/tags/TagsGrid'
import { AVAILABLE_CATEGORIES, Category } from '@/components/forms/CategorySelector'

const TAGS_PER_PAGE = 12

export default function AllTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    // Fetch current user ID on mount
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
    })()
  }, [supabase])

  const fetchTags = useCallback(async () => {
    setLoading(true)
    
    let query = supabase
      .from('tags')
      .select('*', { count: 'exact' })

    // Apply search filter
    if (searchQuery.trim()) {
      query = query.or(`discord_tag.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,user_username.ilike.%${searchQuery}%`)
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      query = query.overlaps('categories', selectedCategories)
    }

    // Apply sorting
    query = query.order('created_at', { ascending: sortBy === 'oldest' })

    // Apply pagination
    const start = (currentPage - 1) * TAGS_PER_PAGE
    const end = start + TAGS_PER_PAGE - 1
    query = query.range(start, end)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching tags:', error)
    } else {
      setTags(data || [])
      setTotalCount(count || 0)
    }
    
    setLoading(false)
  }, [searchQuery, selectedCategories, currentPage, sortBy, supabase])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const totalPages = Math.ceil(totalCount / TAGS_PER_PAGE)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchTags()
  }

  const handleCategoryChange = (categories: Category[]) => {
    setSelectedCategories(categories)
    setCurrentPage(1) // Reset to first page when filtering
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
              All Discord Tags
            </h1>
            <p className="text-[var(--text-secondary)]">
              Discover amazing Discord communities shared by our users
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search and Sort Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search tags, descriptions, or users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 pr-4"
                  />
                </div>
              </form>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="input w-auto min-w-[120px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Filter by Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(category)
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleCategoryChange(selectedCategories.filter(c => c !== category))
                        } else {
                          handleCategoryChange([...selectedCategories, category])
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--secondary)] text-[var(--text-secondary)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {category}
                    </button>
                  )
                })}
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleCategoryChange([])}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-[var(--error)]/20 text-[var(--error)] hover:bg-[var(--error)]/30 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-[var(--text-secondary)]">
            {loading ? (
              'Loading...'
            ) : (
              `Showing ${tags.length} of ${totalCount} tag${totalCount !== 1 ? 's' : ''}`
            )}
          </div>

          {/* Tags Grid */}
          <TagsGrid tags={tags} isLoading={loading} currentUserId={currentUserId} />

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover)] transition-colors"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1
                    
                    // Adjust page numbers for current page context
                    if (totalPages > 5) {
                      if (currentPage > 3) {
                        pageNum = currentPage - 2 + i
                        if (pageNum > totalPages) {
                          pageNum = totalPages - 4 + i
                        }
                      }
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                            : 'bg-[var(--secondary)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover)] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && tags.length === 0 && (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                No tags found
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                {searchQuery || selectedCategories.length > 0 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Be the first to submit a tag!'
                }
              </p>
              {(searchQuery || selectedCategories.length > 0) && (
                <div className="flex gap-2 justify-center">
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setCurrentPage(1)
                      }}
                      className="text-[var(--accent)] hover:text-[var(--foreground)] font-medium transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategories([])
                        setCurrentPage(1)
                      }}
                      className="text-[var(--accent)] hover:text-[var(--foreground)] font-medium transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

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
    </div>
  )
} 