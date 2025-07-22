import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { tagId, updates } = await request.json()
    
    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      )
    }

    // Try regular client first
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // First, check if the tag exists
    const { data: existingTag, error: fetchError } = await supabase
      .from('tags')
      .select('*')
      .eq('id', tagId)
      .single()

    if (fetchError || !existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }
    
    // Ensure required fields are set with defaults if not provided
    const completeUpdates = {
      ...updates,
      image_url: updates.image_url || 'https://placeholder.pics/svg/400x200/5865F2-FFFFFF/Tagcord'
    }
    
    // Ensure categories is properly handled as an array
    if (updates.categories !== undefined) {
      completeUpdates.categories = Array.isArray(updates.categories) ? updates.categories : []
    }
    
    const { data, error } = await supabase
      .from('tags')
      .update(completeUpdates)
      .eq('id', tagId)
      .select('*')

    if (error) {
      console.error('Error updating tag:', error)
      return NextResponse.json(
        { error: 'Failed to update tag' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data, message: 'Tag updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 