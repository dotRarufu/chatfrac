export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      category: {
        Row: {
          id: number
          name: string
          result_id: number
          score: number
        }
        Insert: {
          id?: number
          name: string
          result_id: number
          score: number
        }
        Update: {
          id?: number
          name?: string
          result_id?: number
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "category_result_id_fkey"
            columns: ["result_id"]
            referencedRelation: "result"
            referencedColumns: ["id"]
          }
        ]
      }
      result: {
        Row: {
          id: number
          name: string
          post_test: number
          pre_test: number
          school: string
        }
        Insert: {
          id?: number
          name: string
          post_test: number
          pre_test: number
          school: string
        }
        Update: {
          id?: number
          name?: string
          post_test?: number
          pre_test?: number
          school?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          data: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          data?: string | null
          id?: number
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
