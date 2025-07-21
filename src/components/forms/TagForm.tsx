'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/types/database'
import DiscordIconSelector from './DiscordIconSelector'
import CategorySelector, { Category } from './CategorySelector'
import toast from 'react-hot-toast'

interface TagFormProps {
  user: User
  profile: Profile
}



export default function TagForm({ user, profile }: TagFormProps) {
  const [formData, setFormData] = useState({
    discordTag: '',
    discordIconId: 2, // Default to first available icon
    discordLink: ''
  })
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const supabase = createClient()

  const validateDiscordTag = (tag: string): boolean => {
    // Discord tag validation: 1-4 characters, alphanumeric only
    const discordTagFormat = /^[a-zA-Z0-9]{1,4}$/
    return discordTagFormat.test(tag)
  }

  const validateDiscordLink = (link: string): boolean => {
    // Discord invite link validation - supports both discord.gg and discord.com
    const discordLinkPattern = /^https:\/\/(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9-]+$/
    return discordLinkPattern.test(link)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: Record<string, string> = {}
    
    if (!formData.discordTag.trim()) {
      newErrors.discordTag = 'Discord tag is required'
    } else if (!validateDiscordTag(formData.discordTag.trim())) {
      newErrors.discordTag = 'Discord tag must be 1-4 characters (letters and numbers only)'
    }

    if (!formData.discordLink.trim()) {
      newErrors.discordLink = 'Discord link is required'
    } else if (!validateDiscordLink(formData.discordLink.trim())) {
      newErrors.discordLink = 'Please enter a valid Discord invite link (https://discord.gg/...)'
    }

    if (selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one category'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Check if tag already exists
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('discord_tag', formData.discordTag.trim().toUpperCase())
        .single()

      if (existingTag) {
        setErrors({ discordTag: 'This tag already exists. Please choose a different tag.' })
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase
        .from('tags')
        .insert({
          discord_tag: formData.discordTag.trim().toUpperCase(),
          discord_icon_id: formData.discordIconId,
          discord_url: formData.discordLink.trim(),
          description: null,
          image_url: 'https://placeholder.pics/svg/400x200/5865F2-FFFFFF/Tagcord',
          user_id: user.id,
          user_avatar: profile.discord_avatar,
          user_username: profile.discord_username,
          categories: selectedCategories
        })

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Database error occurred')
      }

      toast.success('Tag submitted successfully! 🎉')
      
      // Reset form
      setFormData({
        discordTag: '',
        discordIconId: 2,
        discordLink: ''
      })
      setSelectedCategories([])
      
      // Redirect to tags page after successful submission
      setTimeout(() => {
        window.location.href = '/tags'
      }, 1000)
    } catch (error) {
      console.error('Error submitting tag:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit tag. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Discord Icon Selector */}
      <DiscordIconSelector
        selectedIconId={formData.discordIconId}
        onIconSelect={(iconId) => setFormData(prev => ({ ...prev, discordIconId: iconId }))}
      />

      {/* Discord Tag Input */}
      <div>
        <label htmlFor="discordTag" className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Tag Name *
        </label>
        <input
          type="text"
          id="discordTag"
          value={formData.discordTag}
          onChange={(e) => {
            // Only allow alphanumeric characters and limit to 4 characters
            const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4)
            setFormData(prev => ({ ...prev, discordTag: value }))
          }}
          placeholder="ABC1"
          className={`input ${errors.discordTag ? 'border-[var(--error)]' : ''}`}
          disabled={isSubmitting}
          maxLength={4}
        />
        {errors.discordTag && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.discordTag}</p>
        )}
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          1-4 characters: letters and numbers only
        </p>
      </div>

      {/* Discord Link Input */}
      <div>
        <label htmlFor="discordLink" className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Discord Link *
        </label>
        <input
          type="url"
          id="discordLink"
          value={formData.discordLink}
          onChange={(e) => setFormData(prev => ({ ...prev, discordLink: e.target.value }))}
          placeholder="https://discord.gg/your-invite"
          className={`input ${errors.discordLink ? 'border-[var(--error)]' : ''}`}
          disabled={isSubmitting}
        />
        {errors.discordLink && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.discordLink}</p>
        )}
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Your Discord server invite link (discord.gg or discord.com/invite)
        </p>
      </div>

      {/* Category Selector */}
      <CategorySelector
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        disabled={isSubmitting}
      />
      {errors.categories && (
        <p className="mt-1 text-sm text-[var(--error)]">{errors.categories}</p>
      )}

            {/* Tag Preview */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-6">
        <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">Preview</h3>
        <div className="bg-[#2b2d31] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <img
              src={`https://discordresources.com/img/guilds/${formData.discordIconId}.svg`}
              alt={`Discord Icon ${formData.discordIconId}`}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-grow min-w-0">
              <span className="font-semibold text-lg text-white">
                {formData.discordTag.toUpperCase() || 'ABCD'}
              </span>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedCategories.map((category) => (
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