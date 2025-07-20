'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/types/database'
import ImageSelector from './ImageSelector'
import toast from 'react-hot-toast'

interface TagFormProps {
  user: User
  profile: Profile
  onSuccess?: () => void
}

const PRESET_IMAGES = [
  'https://placeholder.pics/svg/400x200/5865F2-FFFFFF/Gaming',
  'https://placeholder.pics/svg/400x200/43B581-FFFFFF/Community',
  'https://placeholder.pics/svg/400x200/FAA61A-FFFFFF/Tech',
  'https://placeholder.pics/svg/400x200/F04747-FFFFFF/Art',
  'https://placeholder.pics/svg/400x200/9B59B6-FFFFFF/Music',
  'https://placeholder.pics/svg/400x200/E91E63-FFFFFF/Anime',
  'https://placeholder.pics/svg/400x200/FF9800-FFFFFF/Sports',
  'https://placeholder.pics/svg/400x200/607D8B-FFFFFF/Study'
]

export default function TagForm({ user, profile, onSuccess }: TagFormProps) {
  const [formData, setFormData] = useState({
    discordTag: '',
    description: '',
    imageUrl: PRESET_IMAGES[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const supabase = createClient()

  const validateDiscordTag = (tag: string): boolean => {
    // Updated Discord tag format validation
    // Modern format: @username or username (no discriminator)
    // Legacy format: username#1234
    const modernFormat = /^@?[a-zA-Z0-9._]{2,32}$/
    const legacyFormat = /^[a-zA-Z0-9._]{2,32}#[0-9]{4}$/
    
    return modernFormat.test(tag) || legacyFormat.test(tag)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: Record<string, string> = {}
    
    if (!formData.discordTag.trim()) {
      newErrors.discordTag = 'Discord tag is required'
    } else if (!validateDiscordTag(formData.discordTag.trim())) {
      newErrors.discordTag = 'Invalid Discord tag format. Use: username or username#1234'
    }
    
    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Please select an image'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const { error } = await supabase
        .from('tags')
        .insert({
          discord_tag: formData.discordTag.trim(),
          description: formData.description.trim() || null,
          image_url: formData.imageUrl,
          user_id: user.id,
          user_avatar: profile.discord_avatar,
          user_username: profile.discord_username
        })

      if (error) {
        throw error
      }

      toast.success('Tag submitted successfully! 🎉')
      
      // Reset form
      setFormData({
        discordTag: '',
        description: '',
        imageUrl: PRESET_IMAGES[0]
      })
      
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting tag:', error)
      toast.error('Failed to submit tag. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Discord Tag Input */}
      <div>
        <label htmlFor="discordTag" className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Discord Tag *
        </label>
        <input
          type="text"
          id="discordTag"
          value={formData.discordTag}
          onChange={(e) => setFormData(prev => ({ ...prev, discordTag: e.target.value }))}
          placeholder="e.g., @username or username#1234"
          className={`input ${errors.discordTag ? 'border-[var(--error)]' : ''}`}
          disabled={isSubmitting}
        />
        {errors.discordTag && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.discordTag}</p>
        )}
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Enter your Discord username or legacy tag format
        </p>
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Tell us about your Discord server or community..."
          rows={3}
          className="input resize-none"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Optional: Describe your server or community
        </p>
      </div>

      {/* Image Selector */}
      <ImageSelector
        selectedImage={formData.imageUrl}
        onImageSelect={(imageUrl) => setFormData(prev => ({ ...prev, imageUrl }))}
      />
      {errors.imageUrl && (
        <p className="mt-1 text-sm text-[var(--error)]">{errors.imageUrl}</p>
      )}

      {/* Preview */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">Preview</h3>
        <div className="flex items-start gap-3">
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="w-16 h-12 rounded-md object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[var(--foreground)]">
              {formData.discordTag || 'Your Discord Tag'}
            </p>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
              {formData.description || 'Your description will appear here...'}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)]">
              <img
                src={
                  profile.discord_avatar
                    ? `https://cdn.discordapp.com/avatars/${profile.discord_id}/${profile.discord_avatar}.png`
                    : `https://cdn.discordapp.com/embed/avatars/${(parseInt(profile.discord_id, 10) % 5)}.png`
                }
                alt={profile.discord_username}
                className="w-4 h-4 rounded-full"
              />
              <span>{profile.discord_username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-discord flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Tag
            </>
          )}
        </button>
      </div>
    </form>
  )
} 