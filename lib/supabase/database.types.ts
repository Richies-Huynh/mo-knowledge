export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      branding: {
        Row: {
          art_style: string | null
          brand_colors: string[] | null
          fonts: string[] | null
          id: string
          knowledge_base_id: string
          logos: string[] | null
          writing_style: string | null
        }
        Insert: {
          art_style?: string | null
          brand_colors?: string[] | null
          fonts?: string[] | null
          id?: string
          knowledge_base_id: string
          logos?: string[] | null
          writing_style?: string | null
        }
        Update: {
          art_style?: string | null
          brand_colors?: string[] | null
          fonts?: string[] | null
          id?: string
          knowledge_base_id?: string
          logos?: string[] | null
          writing_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branding_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: true
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      company_foundation: {
        Row: {
          alt_company_names: string[] | null
          business_model: string | null
          company_name: string | null
          company_role: string | null
          id: string
          knowledge_base_id: string
          legal_entity_type: string | null
          main_address: string | null
          overview: string | null
          service_locations: string[] | null
          website: string | null
          year_founded: number | null
        }
        Insert: {
          alt_company_names?: string[] | null
          business_model?: string | null
          company_name?: string | null
          company_role?: string | null
          id?: string
          knowledge_base_id: string
          legal_entity_type?: string | null
          main_address?: string | null
          overview?: string | null
          service_locations?: string[] | null
          website?: string | null
          year_founded?: number | null
        }
        Update: {
          alt_company_names?: string[] | null
          business_model?: string | null
          company_name?: string | null
          company_role?: string | null
          id?: string
          knowledge_base_id?: string
          legal_entity_type?: string | null
          main_address?: string | null
          overview?: string | null
          service_locations?: string[] | null
          website?: string | null
          year_founded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_foundation_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: true
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      key_person: {
        Row: {
          description: string | null
          gender: string | null
          id: string
          knowledge_base_id: string
          name: string | null
          role: string | null
          title: string | null
        }
        Insert: {
          description?: string | null
          gender?: string | null
          id?: string
          knowledge_base_id: string
          name?: string | null
          role?: string | null
          title?: string | null
        }
        Update: {
          description?: string | null
          gender?: string | null
          id?: string
          knowledge_base_id?: string
          name?: string | null
          role?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "key_person_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      market: {
        Row: {
          buyers: string | null
          channel: string | null
          customer_needs: string | null
          funnels: string[] | null
          id: string
          ideal_persona: string | null
          industry_groupings: string | null
          knowledge_base_id: string
          suppliers: string[] | null
        }
        Insert: {
          buyers?: string | null
          channel?: string | null
          customer_needs?: string | null
          funnels?: string[] | null
          id?: string
          ideal_persona?: string | null
          industry_groupings?: string | null
          knowledge_base_id: string
          suppliers?: string[] | null
        }
        Update: {
          buyers?: string | null
          channel?: string | null
          customer_needs?: string | null
          funnels?: string[] | null
          id?: string
          ideal_persona?: string | null
          industry_groupings?: string | null
          knowledge_base_id?: string
          suppliers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "market_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: true
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      offering: {
        Row: {
          feature: string | null
          id: string
          knowledge_base_id: string
          pricing: string | null
          service: string | null
          type: string | null
        }
        Insert: {
          feature?: string | null
          id?: string
          knowledge_base_id: string
          pricing?: string | null
          service?: string | null
          type?: string | null
        }
        Update: {
          feature?: string | null
          id?: string
          knowledge_base_id?: string
          pricing?: string | null
          service?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offering_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      online_presence: {
        Row: {
          facebook: string | null
          id: string
          instagram: string | null
          knowledge_base_id: string
          linked_in: string | null
          other: string[] | null
          twitter: string | null
        }
        Insert: {
          facebook?: string | null
          id?: string
          instagram?: string | null
          knowledge_base_id: string
          linked_in?: string | null
          other?: string[] | null
          twitter?: string | null
        }
        Update: {
          facebook?: string | null
          id?: string
          instagram?: string | null
          knowledge_base_id?: string
          linked_in?: string | null
          other?: string[] | null
          twitter?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "online_presence_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: true
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      positioning: {
        Row: {
          founding_story: string | null
          id: string
          knowledge_base_id: string
          pitch: string | null
        }
        Insert: {
          founding_story?: string | null
          id?: string
          knowledge_base_id: string
          pitch?: string | null
        }
        Update: {
          founding_story?: string | null
          id?: string
          knowledge_base_id?: string
          pitch?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positioning_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: true
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_knowledge_base: { Args: { payload: Json }; Returns: string }
      insert_knowledge_base_profiles: {
        Args: { kb_id: string; payload: Json }
        Returns: undefined
      }
      update_knowledge_base: {
        Args: { kb_id: string; payload: Json }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
