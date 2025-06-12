import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations
// Initialize supabaseAdmin ONLY on the server
export const supabaseAdmin =
  typeof window === 'undefined' // Check if code is running on the server
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : undefined; // Set to undefined if on the client

// Database Types (updated to match the fixed schema)
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          summary: string
          description: string
          status: "planning" | "active" | "archived"
          project_type: string
          node_id: string
          pod_id: string
          budget: number
          raised: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          description: string
          status?: "planning" | "active" | "archived"
          project_type: string
          node_id: string
          pod_id: string
          budget: number
          raised?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          description?: string
          status?: "planning" | "active" | "archived"
          project_type?: string
          node_id?: string
          pod_id?: string
          budget?: number
          raised?: number
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          name: string
          role: string
          avatar: string | null
          node_id: string
          pod_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          avatar?: string | null
          node_id: string
          pod_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          avatar?: string | null
          node_id?: string
          pod_id?: string
        }
      }
      ai_advisors: {
        Row: {
          id: string
          slug: string
          full_name: string
          role: string
          bio: string
          detailed_bio: string
          avatar: string | null
          specialties: string[] // Fixed: Now properly typed as string array
          is_active: boolean
          created_at: string
          updated_at: string
          sanity_person_id: string | null
        }
        Insert: {
          id?: string
          slug: string
          full_name: string
          role: string
          bio: string
          detailed_bio: string
          avatar?: string | null
          specialties: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
          sanity_person_id?: string | null
        }
        Update: {
          id?: string
          slug?: string
          full_name?: string
          role?: string
          bio?: string
          detailed_bio?: string
          avatar?: string | null
          specialties?: string[]
          is_active?: boolean
          updated_at?: string
          sanity_person_id?: string | null
        }
      }
    }
  }
}
