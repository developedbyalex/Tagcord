'use client'

import { useState, useEffect, useCallback } from 'react'
import { Tag, Profile } from '@/types/database'
import { adminDeleteTagClient, adminGetAllTagsClient, adminGetAllUsersClient, adminUpdateTagClient } from '@/lib/admin-client'
import toast from 'react-hot-toast'

interface ServerWithUser extends Tag {
  user_profile: Profile
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'servers' | 'users'>('servers')
  const [servers, setServers] = useState<ServerWithUser[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [deletingServer, setDeletingServer] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [editForm, setEditForm] = useState({
    discordTag: '',
    discordIconId: 2,
    discordLink: '',
    categories: [] as string[]
  })

  const ITEMS_PER_PAGE = 10

  const fetchServers = useCallback(async () => {
    setLoading(true)
    
    try {
      const { data, error } = await adminGetAllTagsClient()
      
      if (error) {
        console.error('Error fetching servers:', error)
        toast.error('Failed to fetch servers')
        setLoading(false)
        return
      }

      let filteredData = data || []
      
      // Apply search filter
      if (searchQuery.trim()) {
        filteredData = filteredData.filter(server => 
          server.discord_tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          server.user_username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Apply pagination
      const start = (currentPage - 1) * ITEMS_PER_PAGE
      const end = start + ITEMS_PER_PAGE
      const paginatedData = filteredData.slice(start, end)

      setServers(paginatedData)
      setTotalCount(filteredData.length)
    } catch (error) {
      console.error('Error fetching servers:', error)
      toast.error('Failed to fetch servers')
    }
    
    setLoading(false)
  }, [searchQuery, currentPage])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    
    try {
      const { data, error } = await adminGetAllUsersClient()
      
      if (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to fetch users')
        setLoading(false)
        return
      }

      let filteredData = data || []
      
      // Apply search filter
      if (searchQuery.trim()) {
        filteredData = filteredData.filter(user => 
          user.discord_username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Apply pagination
      const start = (currentPage - 1) * ITEMS_PER_PAGE
      const end = start + ITEMS_PER_PAGE
      const paginatedData = filteredData.slice(start, end)

      setUsers(paginatedData)
      setTotalCount(filteredData.length)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    }
    
    setLoading(false)
  }, [searchQuery, currentPage])

  useEffect(() => {
    if (activeTab === 'servers') {
      fetchServers()
    } else {
      fetchUsers()
    }
  }, [fetchServers, fetchUsers, activeTab])

  const handleDeleteServer = async (serverId: string) => {
    setDeletingServer(serverId)

    try {
      const { error } = await adminDeleteTagClient(serverId)

      if (error) {
        console.error('Error deleting server:', error)
        toast.error('Failed to delete server')
        return
      }

      toast.success('Server deleted successfully')
      setShowDeleteConfirm(null)
      fetchServers() // Refresh the list
    } catch (error) {
      console.error('Error deleting server:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setDeletingServer(null)
    }
  }

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
    const existingTag = servers.find(server => 
      server.discord_tag === editForm.discordTag.trim().toUpperCase() && 
      server.id !== editingTag.id
    )

    if (existingTag) {
      toast.error('This tag name already exists. Please choose a different name.')
      return
    }

    try {
      const { error } = await adminUpdateTagClient(editingTag.id, {
        discord_tag: editForm.discordTag.trim().toUpperCase(),
        discord_icon_id: editForm.discordIconId,
        discord_url: editForm.discordLink.trim(),
        categories: editForm.categories
      })

      if (error) {
        console.error('Error updating tag:', error)
        toast.error('Failed to update tag: ' + (error.message || JSON.stringify(error)))
      } else {
        toast.success('Tag updated successfully!')
        cancelEditing()
        fetchServers() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating tag:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleTabChange = (tab: 'servers' | 'users') => {
    setActiveTab(tab)
    setSearchQuery('')
    setCurrentPage(1)
  }

  const getDiscordAvatarUrl = (discordId: string, avatar: string | null) => {
    if (avatar && avatar !== 'null' && avatar !== '') {
      // If it's already a full URL, use it
      if (avatar.startsWith('http')) {
        return avatar
      }
      // If it's just the avatar hash, construct the URL
      return `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png`
    }
    // Fallback to default Discord avatar
    return `https://cdn.discordapp.com/embed/avatars/${(parseInt(discordId || '0', 10) % 5)}.png`
  }

  const formatUsername = (username: string, discriminator: string | null) => {
    // If discriminator is "0", null, or empty, it means the user has migrated to the new Discord username system
    if (!discriminator || discriminator === "0" || discriminator.trim() === "") {
      return username
    }
    return `${username}#${discriminator}`
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1">
          <button
            onClick={() => handleTabChange('servers')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'servers'
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--hover)]'
            }`}
          >
            Servers ({servers.length})
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--hover)]'
            }`}
          >
            Users ({users.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={activeTab === 'servers' ? "Search servers by tag or username..." : "Search users by username..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 pr-4"
            />
          </div>
          <button type="submit" className="btn-discord">
            Search
          </button>
        </form>
      </div>

      {/* Results Count */}
      <div className="text-sm text-[var(--text-secondary)]">
        {loading ? (
          'Loading...'
        ) : (
          `Showing ${activeTab === 'servers' ? servers.length : users.length} of ${totalCount} ${activeTab === 'servers' ? 'server' : 'user'}${totalCount !== 1 ? 's' : ''}`
        )}
      </div>

      {/* Content */}
      <div className="card">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-[var(--border)] rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : activeTab === 'servers' ? (
          // Servers List
          servers.length === 0 ? (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                No servers found
              </h3>
              <p className="text-[var(--text-secondary)]">
                {searchQuery ? 'Try adjusting your search terms' : 'No servers have been submitted yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {servers.map((server) => (
                <div key={server.id} className="border border-[var(--border)] rounded-lg p-4 hover:border-[var(--accent)] transition-colors">
                  {editingTag?.id === server.id ? (
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
                          {['Art', 'Big Community', 'Business', 'Coding', 'Design', 'Education', 'Entertainment', 'Fashion', 'Fiction', 'Food', 'Fun', 'Fun or Comedy', 'Gaming', 'Health', 'Large Community', 'Memes', 'Music', 'NSFW', 'Other', 'Politics', 'Racing', 'Religion', 'Roleplay', 'Science', 'Small Community', 'Social', 'Sports', 'Technology', 'Travel'].map((category) => {
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
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {server.discord_tag.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-[var(--foreground)]">
                              {server.discord_tag}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Created by <span className="font-medium text-[var(--foreground)]">{server.user_username.replace(/#\d+$/, '')}</span>
                            </p>
                            {server.categories && server.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {server.categories.map((category) => (
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
                        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                          <span>
                            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(server.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span>
                            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(server.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => startEditing(server)}
                          className="px-3 py-2 bg-[var(--accent)] text-white text-sm rounded-lg hover:bg-[#677bc4] transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        
                        <a
                          href={server.discord_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-lg hover:bg-[var(--hover)] transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View
                        </a>
                        
                        {showDeleteConfirm === server.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteServer(server.id)}
                              disabled={deletingServer === server.id}
                              className="px-3 py-2 bg-[var(--error)] text-white text-sm rounded-lg hover:bg-[#e63946] transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              {deletingServer === server.id ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-2 bg-[var(--secondary)] text-[var(--foreground)] text-sm rounded-lg hover:bg-[var(--hover)] transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(server.id)}
                            className="px-3 py-2 bg-[var(--error)] text-white text-sm rounded-lg hover:bg-[#e63946] transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          // Users List
          users.length === 0 ? (
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                No users found
              </h3>
              <p className="text-[var(--text-secondary)]">
                {searchQuery ? 'Try adjusting your search terms' : 'No users have registered yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border border-[var(--border)] rounded-lg p-4 hover:border-[var(--accent)] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={getDiscordAvatarUrl(user.discord_id, user.discord_avatar)}
                          alt={`${user.discord_username}'s avatar`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg text-[var(--foreground)]">
                            {formatUsername(user.discord_username, user.discord_discriminator)}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)]">
                            Discord ID: <span className="font-medium text-[var(--foreground)]">{user.discord_id}</span>
                            {user.is_admin && (
                              <span className="ml-2 px-2 py-1 bg-[var(--accent)] text-white text-xs rounded-full">
                                Admin
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                        <span>
                          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span>
                          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(user.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover)] transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1
                
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 2 + i
                    if (pageNum > totalPages) {
                      pageNum = totalPages - 4 + i
                    }
                  }
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                        : 'bg-[var(--secondary)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover)] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 