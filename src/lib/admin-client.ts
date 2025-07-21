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