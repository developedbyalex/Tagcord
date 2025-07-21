export interface Database {
  public: {
    Tables: {
      tags: {
        Row: {
          id: string
          created_at: string
          discord_tag: string
          discord_icon_id: number
          discord_url: string | null
          description: string | null
          image_url: string
          user_id: string
          user_avatar: string | null
          user_username: string
        }
        Insert: {
          id?: string
          created_at?: string
          discord_tag: string
          discord_icon_id: number
          discord_url?: string | null
          description?: string | null
          image_url: string
          user_id: string
          user_avatar?: string | null
          user_username: string
        }
        Update: {
          id?: string
          created_at?: string
          discord_tag?: string
          discord_icon_id?: number
          discord_url?: string | null
          description?: string | null
          image_url?: string
          user_id?: string
          user_avatar?: string | null
          user_username?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          discord_id: string
          discord_username: string
          discord_avatar: string | null
          discord_discriminator: string | null
          is_admin: boolean
        }
        Insert: {
          id: string
          created_at?: string
          discord_id: string
          discord_username: string
          discord_avatar?: string | null
          discord_discriminator?: string | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          discord_id?: string
          discord_username?: string
          discord_avatar?: string | null
          discord_discriminator?: string | null
          is_admin?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tag = Database['public']['Tables']['tags']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type InsertTag = Database['public']['Tables']['tags']['Insert']
export type InsertProfile = Database['public']['Tables']['profiles']['Insert'] 