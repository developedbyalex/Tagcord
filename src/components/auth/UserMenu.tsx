'use client'

import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useState, useRef, useEffect } from 'react'
import { Profile } from '@/types/database'

interface UserMenuProps {
  user: User
  profile: Profile | null
}

export default function UserMenu({ user, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const avatarUrl = profile?.discord_avatar
    ? `https://cdn.discordapp.com/avatars/${profile.discord_id}/${profile.discord_avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${(parseInt(profile?.discord_id || '0', 10) % 5)}.png`

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--hover)] transition-colors"
      >
        <img
          src={avatarUrl}
          alt={profile?.discord_username || 'User'}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium hidden sm:block">
          {profile?.discord_username || 'User'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--secondary)] border border-[var(--border)] rounded-lg shadow-lg z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-[var(--border)]">
              <p className="text-sm font-medium">{profile?.discord_username}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover)] transition-colors text-[var(--error)]"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 