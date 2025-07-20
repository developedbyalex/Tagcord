import { Tag } from '@/types/database'
import Image from 'next/image'

interface TagCardProps {
  tag: Tag
}

export default function TagCard({ tag }: TagCardProps) {
  const avatarUrl = tag.user_avatar
    ? `https://cdn.discordapp.com/avatars/${tag.user_id}/${tag.user_avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${(parseInt(tag.user_id, 10) % 5)}.png`

  return (
    <div className="card group hover:scale-105 transition-all duration-300 cursor-pointer">
      {/* Tag Image */}
      <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-[var(--background)]">
        <Image
          src={tag.image_url}
          alt={`Tag image for ${tag.discord_tag}`}
          width={400}
          height={200}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          unoptimized
        />
      </div>

      {/* Tag Info */}
      <div className="space-y-3">
        {/* Discord Tag */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            {tag.discord_tag}
          </h3>
          <span className="text-xs text-[var(--text-secondary)] bg-[var(--background)] px-2 py-1 rounded-full">
            TAG
          </span>
        </div>

        {/* Description */}
        {tag.description && (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
            {tag.description}
          </p>
        )}

        {/* User Info */}
        <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
          <img
            src={avatarUrl}
            alt={tag.user_username}
            className="w-6 h-6 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">
              {tag.user_username}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {new Date(tag.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 