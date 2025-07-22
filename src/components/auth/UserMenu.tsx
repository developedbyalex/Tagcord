'use client'

import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useState, useRef, useEffect } from 'react'
import { Profile } from '@/types/database'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserMenuProps {
  user: User
  profile: Profile | null
}

export default function UserMenu({ user, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

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
    router.push('/')
  }

  // Discord avatar URL construction
  const avatarUrl = (() => {
    if (profile?.discord_avatar && profile.discord_avatar !== 'null' && profile.discord_avatar !== '') {
      // If it's already a full URL, use it
      if (profile.discord_avatar.startsWith('http')) {
        return profile.discord_avatar
      }
      // If it's just the avatar hash, construct the URL
      return `https://cdn.discordapp.com/avatars/${profile.discord_id}/${profile.discord_avatar}.png`
    }
    // Fallback to default Discord avatar
    return `https://cdn.discordapp.com/embed/avatars/${(parseInt(profile?.discord_id || '0', 10) % 5)}.png`
  })()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--hover)] transition-colors"
      >
        <img
          src={avatarUrl}
          alt="User"
          className="w-8 h-8 rounded-full"
        />
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
              <p className="text-xs text-[var(--text-secondary)]">
                {user.email}
              </p>
            </div>
            
            <Link
              href="/submit"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Tag
            </Link>
            
            <Link
              href="/my-tags"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              My Tags
            </Link>
            
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
            
            {profile?.is_admin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover)] transition-colors text-[var(--warning)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin Panel
              </Link>
            )}
            
            <div className="border-t border-[var(--border)] mt-1">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover)] transition-colors text-[var(--error)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 