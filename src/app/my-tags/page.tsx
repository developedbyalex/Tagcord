'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Tag } from '@/types/database'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function MyTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [editForm, setEditForm] = useState({
    discordTag: '',
    discordIconId: 2,
    discordLink: '',
    categories: [] as string[]
  })

  const supabase = createClient()

  const fetchUserTags = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tags:', error)
        toast.error('Failed to load your tags')
      } else {
        setTags(data || [])
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        redirect('/auth/login')
      }
      fetchUserTags()
    }
    checkAuth()
  }, [supabase])

  const startEditing = (tag: Tag) => {
    setEditingTag(tag)
    setEditForm({
      discordTag: tag.discord_tag,
      discordIconId: tag.discord_icon_id,
      discordLink: tag.discord_url || '',
      categories: tag.categories || []
    })
  }

  const cancelEditing = () => {
    setEditingTag(null)
    setEditForm({
      discordTag: '',
      discordIconId: 2,
      discordLink: '',
      categories: []
    })
  }

  const saveTag = async () => {
    if (!editingTag) return

    // Validation
    if (!editForm.discordTag.trim()) {
      toast.error('Tag name is required')
      return
    }
    if (!editForm.discordLink.trim()) {
      toast.error('Discord link is required')
      return
    }
    if (editForm.categories.length === 0) {
      toast.error('Please select at least one category')
      return
    }

    // Check if tag name already exists (excluding current tag)
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('discord_tag', editForm.discordTag.trim().toUpperCase())
      .neq('id', editingTag.id)
      .single()

    if (existingTag) {
      toast.error('This tag name already exists. Please choose a different name.')
      return
    }

    // Fetch user and profile for required fields
    const { data: { user } } = await supabase.auth.getUser()
    let profile = null
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = profileData
    }

    // Update the tag with all required fields
    const { error } = await supabase
      .from('tags')
      .update({
        discord_tag: editForm.discordTag.trim().toUpperCase(),
        discord_icon_id: editForm.discordIconId,
        discord_url: editForm.discordLink.trim(),
        categories: editForm.categories,
        user_id: user?.id,
        user_username: profile?.discord_username || '',
        user_avatar: profile?.discord_avatar || '',
        image_url: editingTag.image_url // keep the existing image_url
      })
      .eq('id', editingTag.id)

    if (error) {
      console.error('Error updating tag:', error)
      toast.error('Failed to update tag: ' + (error.message || JSON.stringify(error)))
    } else {
      toast.success('Tag updated successfully!')
      cancelEditing()
      fetchUserTags() // Refresh the list
    }
  }

  const deleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId)

    if (error) {
      console.error('Error deleting tag:', error)
      toast.error('Failed to delete tag')
    } else {
      toast.success('Tag deleted successfully!')
      fetchUserTags() // Refresh the list
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Loading your tags...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            My Tags
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage your Discord community tags
          </p>
        </div>

        {/* Tags List */}
        {tags.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-[var(--secondary)] rounded-full flex items-center justify-center">
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
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              No tags yet
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              You haven&apos;t submitted any Discord tags yet.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[#677bc4] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Your First Tag
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tags.map((tag) => (
              <div key={tag.id} className="bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-6">
                {editingTag?.id === tag.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">Edit Tag</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={saveTag}
                          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[#677bc4] transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--hover)] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          Tag Name *
                        </label>
                        <input
                          type="text"
                          value={editForm.discordTag}
                          onChange={(e) => setEditForm(prev => ({ ...prev, discordTag: e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4) }))}
                          className="input"
                          maxLength={4}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          Discord Link *
                        </label>
                        <input
                          type="url"
                          value={editForm.discordLink}
                          onChange={(e) => setEditForm(prev => ({ ...prev, discordLink: e.target.value }))}
                          className="input"
                          placeholder="https://discord.gg/..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Categories * (up to 3)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Gaming', 'Coding', 'Design', 'Small Community', 'Music', 'Art', 'Education', 'Technology', 'Social', 'Business', 'Entertainment', 'Sports', 'Health', 'Travel', 'Food', 'Fashion', 'Science', 'Politics', 'Religion', 'Other'].map((category) => {
                          const isSelected = editForm.categories.includes(category)
                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setEditForm(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
                                } else if (editForm.categories.length < 3) {
                                  setEditForm(prev => ({ ...prev, categories: [...prev.categories, category] }))
                                }
                              }}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                isSelected
                                  ? 'bg-[var(--accent)] text-white'
                                  : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]'
                              }`}
                            >
                              {category}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://discordresources.com/img/guilds/${tag.discord_icon_id}.svg`}
                        alt={`${tag.discord_tag} icon`}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">
                          {tag.discord_tag}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {tag.discord_url}
                        </p>
                        {tag.categories && tag.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tag.categories.map((category) => (
                              <span
                                key={category}
                                className="inline-block px-2 py-1 bg-[var(--accent)]/20 text-[var(--accent)] rounded-md text-xs font-medium"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[var(--error)] mt-1">
                            ⚠️ No categories assigned - required
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(tag)}
                        className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[#677bc4] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTag(tag.id)}
                        className="px-4 py-2 bg-[var(--error)]/20 text-[var(--error)] rounded-lg hover:bg-[var(--error)]/30 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 