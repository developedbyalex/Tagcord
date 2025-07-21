import { createAdminClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const adminSupabase = await createAdminClient()
    
    // Update the user's profile to make them an admin
    const { error } = await adminSupabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId)

    if (error) {
      console.error('Error making user admin:', error)
      return NextResponse.json(
        { error: 'Failed to make user admin' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'User is now an admin' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error making user admin:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 