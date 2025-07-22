import { createAdminClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { tagId } = await request.json()
    
    console.log('TEST: Attempting to update tag:', tagId)
    
    const adminSupabase = await createAdminClient()
    
    // First check if tag exists
    const { data: existing, error: fetchError } = await adminSupabase
      .from('tags')
      .select('id, discord_tag, categories')
      .eq('id', tagId)
      .single()
    
    console.log('TEST: Existing tag:', existing, 'Error:', fetchError)
    
    if (!existing) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }
    
    // Try updating just the categories field
    const testCategories = ['Gaming', 'Test']
    const { data, error } = await adminSupabase
      .from('tags')
      .update({ categories: testCategories })
      .eq('id', tagId)
      .select('*')
    
    console.log('TEST: Update result - data:', data, 'error:', error)
    
    return NextResponse.json({
      success: true,
      originalCategories: existing.categories,
      newCategories: testCategories,
      updateResult: data,
      error: error
    })
  } catch (error) {
    console.error('TEST: Error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error },
      { status: 500 }
    )
  }
} 