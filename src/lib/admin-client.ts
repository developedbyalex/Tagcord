import { createClient } from './supabase'

export async function isAdminClient(userId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    return false
  }

  return profile.is_admin || false
}

// Client-side admin operations that use the regular client
export async function adminDeleteTagClient(tagId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId)

  return { error }
}

export async function adminGetAllTagsClient() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('tags')
    .select(`
      *,
      user_profile:profiles(*)
    `)

  return { data, error }
}

export async function adminGetAllUsersClient() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function adminUpdateTagClient(tagId: string, updates: {
  discord_tag?: string
  discord_icon_id?: number
  discord_url?: string
  categories?: string[]
  image_url?: string
}) {
  try {
    const response = await fetch('/api/admin/update-tag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tagId, updates }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to update tag' }
    }

    return { data: result.data, error: null }
  } catch (error) {
    console.error('Error updating tag:', error)
    return { error: 'An unexpected error occurred' }
  }
} 

export async function adminCreateTagClient(tagData: {
  discord_tag: string
  discord_icon_id: number
  discord_url: string
  categories: string[]
  user_id: string
  user_username: string
  user_avatar?: string | null
  description?: string | null
}) {
  try {
    const response = await fetch('/api/admin/create-tag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData),
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to create tag' }
    }

    return { data: result.data, error: null }
  } catch (error) {
    console.error('Error creating tag:', error)
    return { error: 'An unexpected error occurred' }
  }
} 