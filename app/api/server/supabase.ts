export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "farchurch-5-day-quest": {
        Row: {
          address: string | null
          created_at: string
          expiry_at: string | null
          fid: number | null
          id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          expiry_at?: string | null
          fid?: number | null
          id?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          expiry_at?: string | null
          fid?: number | null
          id?: string
        }
        Relationships: []
      }
      metadata: {
        Row: {
          animation_url: string | null
          background_color: string | null
          bottom: string | null
          created_at: string | null
          description: string | null
          external_url: string | null
          face: string | null
          gender: string | null
          hair: string | null
          id: number
          image: string | null
          name: string | null
          owner: string | null
          skin: string | null
          top: string | null
          youtube_url: string | null
        }
        Insert: {
          animation_url?: string | null
          background_color?: string | null
          bottom?: string | null
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          face?: string | null
          gender?: string | null
          hair?: string | null
          id?: number
          image?: string | null
          name?: string | null
          owner?: string | null
          skin?: string | null
          top?: string | null
          youtube_url?: string | null
        }
        Update: {
          animation_url?: string | null
          background_color?: string | null
          bottom?: string | null
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          face?: string | null
          gender?: string | null
          hair?: string | null
          id?: number
          image?: string | null
          name?: string | null
          owner?: string | null
          skin?: string | null
          top?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birthday: string | null
          email: string | null
          email_confirmed_at: string | null
          first_name: string | null
          id: string
          ip_address: string | null
          last_name: string | null
          password: string | null
          updated_at: string | null
          wallet: string | null
        }
        Insert: {
          birthday?: string | null
          email?: string | null
          email_confirmed_at?: string | null
          first_name?: string | null
          id: string
          ip_address?: string | null
          last_name?: string | null
          password?: string | null
          updated_at?: string | null
          wallet?: string | null
        }
        Update: {
          birthday?: string | null
          email?: string | null
          email_confirmed_at?: string | null
          first_name?: string | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          password?: string | null
          updated_at?: string | null
          wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          ip_address: string | null
          name: string | null
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          name?: string | null
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          name?: string | null
          timestamp?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
