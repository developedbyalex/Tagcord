import { createClient, createAdminClient } from './supabase-server'

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient()
  
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

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  const adminStatus = await isAdmin(user.id)
  if (!adminStatus) {
    throw new Error('Admin access required')
  }

  return user
}

// Admin operations that bypass RLS
export async function adminDeleteTag(tagId: string) {
  const adminSupabase = await createAdminClient()
  
  const { error } = await adminSupabase
    .from('tags')
    .delete()
    .eq('id', tagId)

  return { error }
}

export async function adminGetAllTags() {
  const adminSupabase = await createAdminClient()
  
  const { data, error } = await adminSupabase
    .from('tags')
    .select(`
      *,
      user_profile:profiles(*)
    `)

  return { data, error }
} 