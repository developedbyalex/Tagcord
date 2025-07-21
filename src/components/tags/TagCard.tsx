'use client'

import { Tag } from '@/types/database'

interface TagCardProps {
  tag: Tag
  currentUserId?: string | null
}

export default function TagCard({ tag, currentUserId }: TagCardProps) {
  const handleClick = () => {
    if (tag.discord_url) {
      // Open Discord invite link in a new tab
      window.open(tag.discord_url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div 
      className="block bg-[#232428] hover:bg-[#2a2c32] rounded-lg p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={tag.discord_icon_id 
              ? `https://discordresources.com/img/guilds/${tag.discord_icon_id}.svg`
              : tag.image_url || 'https://placeholder.pics/svg/64x64/5865F2-FFFFFF/T'
            }
            alt={`${tag.discord_tag} icon`}
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-lg text-white truncate">
            {tag.discord_tag || 'TAG'}
          </h3>
          {tag.discord_url && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Click to join Discord server
            </p>
          )}
          {tag.categories && tag.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tag.categories.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className="inline-block px-2 py-1 bg-[var(--accent)]/20 text-[var(--accent)] rounded-md text-xs font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
        {tag.discord_url && (
          <div className="flex-shrink-0">
            <svg 
              className="w-5 h-5 text-[var(--accent)]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
} 