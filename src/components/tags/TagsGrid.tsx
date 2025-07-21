import { Tag } from '@/types/database'
import TagCard from './TagCard'

interface TagsGridProps {
  tags: Tag[]
  isLoading?: boolean
  currentUserId?: string | null
}

export default function TagsGrid({ tags, isLoading = false, currentUserId }: TagsGridProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="h-48 bg-[var(--background)]"></div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-[var(--background)] rounded w-32"></div>
                  <div className="h-6 bg-[var(--background)] rounded-full w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-[var(--background)] rounded w-full"></div>
                  <div className="h-4 bg-[var(--background)] rounded w-3/4"></div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]/50">
                  <div className="w-8 h-8 bg-[var(--background)] rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-[var(--background)] rounded w-24"></div>
                    <div className="h-3 bg-[var(--background)] rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[var(--accent)] to-[#677bc4] rounded-full flex items-center justify-center opacity-50">
          <svg
            className="w-16 h-16 text-white"
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
          No communities found
        </h3>
        <p className="text-[var(--text-secondary)] mb-4">
          Be the first to share your Discord server!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {tags.map((tag) => (
        <TagCard key={tag.id} tag={tag} currentUserId={currentUserId} />
      ))}
    </div>
  )
} 