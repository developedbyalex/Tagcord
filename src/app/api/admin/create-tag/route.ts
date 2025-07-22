import { createAdminClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const tagData = await request.json()
    
    if (!tagData.discord_tag || !tagData.discord_url || !tagData.user_id || !tagData.user_username) {
      return NextResponse.json(
        { error: 'Missing required fields: discord_tag, discord_url, user_id, user_username' },
        { status: 400 }
      )
    }

    const adminSupabase = await createAdminClient()
    
    const { data, error } = await adminSupabase
      .from('tags')
      .insert({
        ...tagData,
        image_url: tagData.image_url || 'https://placeholder.pics/svg/400x200/5865F2-FFFFFF/Tagcord'
      })
      .select()

    if (error) {
      console.error('Error creating tag:', error)
      return NextResponse.json(
        { error: 'Failed to create tag' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data, message: 'Tag created successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 