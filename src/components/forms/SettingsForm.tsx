'use client'

import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { Profile } from '@/types/database'
import toast from 'react-hot-toast'

interface SettingsFormProps {
  user: User
  profile: Profile
}

export default function SettingsForm({ user, profile }: SettingsFormProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const supabase = createClient()

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion')
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account')
      }

      toast.success('Account deleted successfully')
      
      // Sign out and redirect to home
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred while deleting your account')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setDeleteConfirmation('')
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="card">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
          Profile Information
        </h2>
        
        <div className="flex items-center gap-4 mb-6">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-lg font-medium text-[var(--foreground)]">
              {profile.discord_username.replace(/#\d+$/, '')}
            </h3>
            <p className="text-[var(--text-secondary)]">
              Discord ID: {profile.discord_id}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Username
            </label>
            <div className="p-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg">
              <span className="text-[var(--foreground)]">{profile.discord_username.replace(/#\d+$/, '')}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Username is managed through Discord and cannot be changed here
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Email Address
            </label>
            <div className="p-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg">
              <span className="text-[var(--foreground)]">{user.email}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Email is managed through Discord and cannot be changed here
            </p>
          </div>


        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-[var(--error)]/20">
        <h2 className="text-xl font-semibold text-[var(--error)] mb-6">
          Danger Zone
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
              Delete Account
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              This action cannot be undone. This will permanently delete your account and all associated data including:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] mb-4 space-y-1">
              <li>Your user profile</li>
              <li>All tags you've submitted</li>
              <li>All account data and preferences</li>
            </ul>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4 p-4 bg-[var(--error)]/10 border border-[var(--error)]/20 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-[var(--error)] mb-2">
                  Type DELETE to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="w-full p-3 bg-[var(--background)] border border-[var(--error)]/30 rounded-lg text-[var(--foreground)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--error)]/50"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmation !== 'DELETE'}
                  className="btn-danger flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmation('')
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 