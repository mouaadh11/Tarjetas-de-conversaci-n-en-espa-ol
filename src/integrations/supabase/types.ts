export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string;
          appointment_time: string;
          client_email: string;
          client_name: string;
          client_phone: string;
          created_at: string;
          id: string;
          service_id: string;
          status: string;
          stylist_id: string;
          updated_at: string;
        };
        Insert: {
          appointment_date: string;
          appointment_time: string;
          client_email: string;
          client_name: string;
          client_phone: string;
          created_at?: string;
          id?: string;
          service_id: string;
          status: string;
          stylist_id: string;
          updated_at?: string;
        };
        Update: {
          appointment_date?: string;
          appointment_time?: string;
          client_email?: string;
          client_name?: string;
          client_phone?: string;
          created_at?: string;
          id?: string;
          service_id?: string;
          status?: string;
          stylist_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_stylist_id_fkey";
            columns: ["stylist_id"];
            isOneToOne: false;
            referencedRelation: "stylists";
            referencedColumns: ["id"];
          }
        ];
      };
      cards: {
        Row: {
          category: string | null;
          created_at: string;
          english_text: string | null;
          id: string;
          russian_text: string | null;
          spanish_text: string;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          english_text?: string | null;
          id?: string;
          russian_text?: string | null;
          spanish_text: string;
          user_id: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          english_text?: string | null;
          id?: string;
          russian_text?: string | null;
          spanish_text?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          created_at: string;
          description: string;
          duration: number;
          id: string;
          image_url: string | null;
          name: string;
          price: number;
        };
        Insert: {
          created_at?: string;
          description: string;
          duration: number;
          id?: string;
          image_url?: string | null;
          name: string;
          price: number;
        };
        Update: {
          created_at?: string;
          description?: string;
          duration?: number;
          id?: string;
          image_url?: string | null;
          name?: string;
          price?: number;
        };
        Relationships: [];
      };
      stylists: {
        Row: {
          bio: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          name: string;
          specialties: string[] | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name: string;
          specialties?: string[] | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          specialties?: string[] | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_random_card: {
        Args: Record<PropertyKey, never>;
        Returns: {
          category: string | null;
          created_at: string;
          english_text: string | null;
          id: string;
          russian_text: string | null;
          spanish_text: string;
          user_id: string;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
