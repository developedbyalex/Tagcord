import { Tag } from '@/types/database'
import TagCard from './TagCard'

interface TagsGridProps {
  tags: Tag[]
  isLoading?: boolean
}

export default function TagsGrid({ tags, isLoading = false }: TagsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="w-full h-48 mb-4 rounded-lg bg-[var(--background)]"></div>
            <div className="space-y-3">
              <div className="h-6 bg-[var(--background)] rounded"></div>
              <div className="h-4 bg-[var(--background)] rounded w-3/4"></div>
              <div className="flex items-center gap-3 pt-3">
                <div className="w-6 h-6 bg-[var(--background)] rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-[var(--background)] rounded w-1/2"></div>
                  <div className="h-3 bg-[var(--background)] rounded w-1/3"></div>
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
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-[var(--background)] rounded-full flex items-center justify-center">
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
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          No tags yet
        </h3>
        <p className="text-[var(--text-secondary)] mb-4">
          Be the first to submit a Discord tag!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tags.map((tag) => (
        <TagCard key={tag.id} tag={tag} />
      ))}
    </div>
  )
} 