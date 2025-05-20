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
      cadastral_cache: {
        Row: {
          coordinate_key: string
          data: Json
          id: string
          timestamp: string
        }
        Insert: {
          coordinate_key: string
          data: Json
          id?: string
          timestamp?: string
        }
        Update: {
          coordinate_key?: string
          data?: Json
          id?: string
          timestamp?: string
        }
        Relationships: []
      }
      cadastral_data: {
        Row: {
          api_source: string | null
          cadastral_reference: string | null
          client_id: string | null
          climate_zone: string | null
          created_at: string | null
          id: string
          utm_coordinates: string | null
        }
        Insert: {
          api_source?: string | null
          cadastral_reference?: string | null
          client_id?: string | null
          climate_zone?: string | null
          created_at?: string | null
          id?: string
          utm_coordinates?: string | null
        }
        Update: {
          api_source?: string | null
          cadastral_reference?: string | null
          client_id?: string | null
          climate_zone?: string | null
          created_at?: string | null
          id?: string
          utm_coordinates?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cadastral_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      calculations: {
        Row: {
          after_layers: Json | null
          before_layers: Json | null
          climate_zone: string | null
          created_at: string | null
          id: string
          improvement_percent: number | null
          meets_requirements: boolean | null
          project_id: string | null
          project_type: string | null
          ratio_after: number | null
          ratio_before: number | null
          roof_area: number | null
          surface_area: number | null
          u_value_after: number | null
          u_value_before: number | null
          ventilation_after: number | null
          ventilation_before: number | null
        }
        Insert: {
          after_layers?: Json | null
          before_layers?: Json | null
          climate_zone?: string | null
          created_at?: string | null
          id?: string
          improvement_percent?: number | null
          meets_requirements?: boolean | null
          project_id?: string | null
          project_type?: string | null
          ratio_after?: number | null
          ratio_before?: number | null
          roof_area?: number | null
          surface_area?: number | null
          u_value_after?: number | null
          u_value_before?: number | null
          ventilation_after?: number | null
          ventilation_before?: number | null
        }
        Update: {
          after_layers?: Json | null
          before_layers?: Json | null
          climate_zone?: string | null
          created_at?: string | null
          id?: string
          improvement_percent?: number | null
          meets_requirements?: boolean | null
          project_id?: string | null
          project_type?: string | null
          ratio_after?: number | null
          ratio_before?: number | null
          roof_area?: number | null
          surface_area?: number | null
          u_value_after?: number | null
          u_value_before?: number | null
          ventilation_after?: number | null
          ventilation_before?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calculations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          nif: string | null
          phone: string | null
          projects: number | null
          status: string | null
          type: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          nif?: string | null
          phone?: string | null
          projects?: number | null
          status?: string | null
          type?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          nif?: string | null
          phone?: string | null
          projects?: number | null
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          content: string | null
          date_uploaded: string
          id: string
          last_modified: string
          name: string
          type: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          date_uploaded?: string
          id?: string
          last_modified?: string
          name: string
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          date_uploaded?: string
          id?: string
          last_modified?: string
          name?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          client_id: string | null
          content: string | null
          created_at: string | null
          file_path: string | null
          id: string
          name: string
          project_id: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          client_id?: string | null
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: string
          name: string
          project_id?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: string
          name?: string
          project_id?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string | null
          completion_date: string | null
          created_at: string | null
          id: string
          name: string
          roof_area: number | null
          status: string | null
          surface_area: number | null
          type: string | null
        }
        Insert: {
          client_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          name: string
          roof_area?: number | null
          status?: string | null
          surface_area?: number | null
          type?: string | null
        }
        Update: {
          client_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          name?: string
          roof_area?: number | null
          status?: string | null
          surface_area?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_calculations: {
        Row: {
          calculation_data: Json | null
          client_id: string | null
          date: string
          id: string
          improvement: number | null
          project_id: string | null
          surface: number | null
          type: string | null
        }
        Insert: {
          calculation_data?: Json | null
          client_id?: string | null
          date?: string
          id?: string
          improvement?: number | null
          project_id?: string | null
          surface?: number | null
          type?: string | null
        }
        Update: {
          calculation_data?: Json | null
          client_id?: string | null
          date?: string
          id?: string
          improvement?: number | null
          project_id?: string | null
          surface?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_calculations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_calculations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      template_mappings: {
        Row: {
          created_at: string
          id: string
          mappings: Json
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mappings?: Json
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mappings?: Json
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_mappings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: true
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_jimacoca_email: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
