'use client'

import { createClient } from '@/lib/supabase'
import SignInButton from '@/components/auth/SignInButton'
import UserMenu from '@/components/auth/UserMenu'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/types/database'

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // Reduce timeout to 2 seconds and handle gracefully
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 2000)
      )
      
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      const { data: profileData, error: profileError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ])
      
      if (profileError) {
        // Profile doesn't exist or other error - that's okay, user can still use the app
        return null
      }
      return profileData
    } catch {
      // Profile fetch failed - that's okay, user can still use the app without profile
      return null
    }
  }, [supabase])

  const checkAuthState = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setUser(null)
        setProfile(null)
        return
      }

      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        const profileData = await fetchProfile(currentUser.id)
        setProfile(profileData)
      } else {
        setProfile(null)
      }
    } catch {
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [supabase, fetchProfile])

  useEffect(() => {
    // Initial auth check
    checkAuthState()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        try {
          const profileData = await fetchProfile(currentUser.id)
          setProfile(profileData)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    // Add window focus listener to refresh auth state when returning from OAuth
    const handleWindowFocus = () => {
      checkAuthState()
    }

    window.addEventListener('focus', handleWindowFocus)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [supabase, checkAuthState, fetchProfile])

  return (
    <nav className="bg-[var(--secondary)]/80 backdrop-blur-md border-b border-[var(--border)]/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group mr-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[#677bc4] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              Tagcord<span className="text-[var(--accent)]">.gg</span>
            </span>
          </Link>

          {/* Navigation Links - Now visible on all screen sizes */}
          <div className="flex items-center space-x-6 flex-1">
            <Link
              href="/tags"
              className="text-[var(--text-secondary)] hover:text-[var(--accent)] font-medium transition-all duration-200 hover:scale-105"
            >
              Browse
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-[var(--secondary)] animate-pulse"></div>
            ) : user ? (
              <UserMenu user={user} profile={profile} />
            ) : (
              <SignInButton variant="compact" />
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 