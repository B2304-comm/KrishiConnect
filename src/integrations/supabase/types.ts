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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      company_dealers: {
        Row: {
          company_id: string
          created_at: string
          dealer_id: string
          id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          dealer_id: string
          id?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          dealer_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_dealers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_dealers_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      company_market_coverage: {
        Row: {
          company_id: string
          coverage: number
          created_at: string
          id: string
          shops_count: number
          state_name: string
          updated_at: string
          dealers_count: number
        }
        Insert: {
          company_id: string
          coverage?: number
          created_at?: string
          id?: string
          shops_count?: number
          state_name: string
          updated_at?: string
          dealers_count?: number
        }
        Update: {
          company_id?: string
          coverage?: number
          created_at?: string
          id?: string
          shops_count?: number
          state_name?: string
          updated_at?: string
          dealers_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_market_coverage_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_inventory: {
        Row: {
          dealer_id: string
          id: string
          product_id: string
          quantity: number | null
        }
        Insert: {
          dealer_id: string
          id?: string
          product_id: string
          quantity?: number | null
        }
        Update: {
          dealer_id?: string
          id?: string
          product_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_inventory_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      dealers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          name: string
          phone: string | null
          region: string
          total_inventory: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          name: string
          phone?: string | null
          region: string
          total_inventory?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          name?: string
          phone?: string | null
          region?: string
          total_inventory?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          reviewed_at: string | null
          reviewed_by: string | null
          role: string
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role: string
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role?: string
          status?: string
        }
        Relationships: []
      }
      distribution_requests: {
        Row: {
          created_at: string
          dealer_id: string
          expected_delivery: string | null
          id: string
          notes: string | null
          priority: string | null
          product_id: string
          quantity: number
          request_number: string
          shop_id: string
          status: Database["public"]["Enums"]["distribution_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dealer_id: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          product_id: string
          quantity: number
          request_number: string
          shop_id: string
          status?: Database["public"]["Enums"]["distribution_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dealer_id?: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          product_id?: string
          quantity?: number
          request_number?: string
          shop_id?: string
          status?: Database["public"]["Enums"]["distribution_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "distribution_requests_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribution_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribution_requests_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_bookings: {
        Row: {
          booking_number: string
          created_at: string
          farmer_id: string
          id: string
          pickup_date: string | null
          product_id: string
          qr_code: string | null
          quantity: number
          shop_id: string
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          booking_number: string
          created_at?: string
          farmer_id: string
          id?: string
          pickup_date?: string | null
          product_id: string
          qr_code?: string | null
          quantity: number
          shop_id: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          booking_number?: string
          created_at?: string
          farmer_id?: string
          id?: string
          pickup_date?: string | null
          product_id?: string
          qr_code?: string | null
          quantity?: number
          shop_id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_bookings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_bookings_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          reference_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          reference_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          base_price: number
          created_at: string
          description: string | null
          id: string
          name: string
          unit: string | null
        }
        Insert: {
          base_price: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          unit?: string | null
        }
        Update: {
          base_price?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          unit?: string | null
        }
        Relationships: []
      }
      production_batches: {
        Row: {
          assigned_dealer_id: string | null
          batch_number: string
          company_id: string
          created_at: string
          expiry_date: string
          id: string
          manufacturing_date: string
          notes: string | null
          product_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          assigned_dealer_id?: string | null
          batch_number: string
          company_id: string
          created_at?: string
          expiry_date: string
          id?: string
          manufacturing_date: string
          notes?: string | null
          product_id: string
          quantity: number
          updated_at?: string
        }
        Update: {
          assigned_dealer_id?: string | null
          batch_number?: string
          company_id?: string
          created_at?: string
          expiry_date?: string
          id?: string
          manufacturing_date?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_batches_assigned_dealer_id_fkey"
            columns: ["assigned_dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_batches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shop_inventory: {
        Row: {
          id: string
          last_restocked: string | null
          price: number
          product_id: string
          quantity: number | null
          shop_id: string
        }
        Insert: {
          id?: string
          last_restocked?: string | null
          price: number
          product_id: string
          quantity?: number | null
          shop_id: string
        }
        Update: {
          id?: string
          last_restocked?: string | null
          price?: number
          product_id?: string
          quantity?: number | null
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_inventory_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string
          created_at: string
          dealer_id: string | null
          email: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          name: string
          owner_name: string
          phone: string
          rating: number | null
          status: Database["public"]["Enums"]["shop_status"] | null
          total_stock: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string
          dealer_id?: string | null
          email?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          name: string
          owner_name: string
          phone: string
          rating?: number | null
          status?: Database["public"]["Enums"]["shop_status"] | null
          total_stock?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          dealer_id?: string | null
          email?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          name?: string
          owner_name?: string
          phone?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["shop_status"] | null
          total_stock?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shops_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      state_districts: {
        Row: {
          coverage: number | null
          created_at: string
          dealers_count: number | null
          district_name: string
          id: string
          shops_count: number | null
          state_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          coverage?: number | null
          created_at?: string
          dealers_count?: number | null
          district_name: string
          id?: string
          shops_count?: number | null
          state_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          coverage?: number | null
          created_at?: string
          dealers_count?: number | null
          district_name?: string
          id?: string
          shops_count?: number | null
          state_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_read: boolean | null
          message: string | null
          product_id: string
          shop_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          product_id: string
          shop_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          product_id?: string
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_alerts_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "farmer" | "shop" | "dealer" | "company"
      distribution_status:
        | "pending"
        | "approved"
        | "shipped"
        | "delivered"
        | "rejected"
      order_status: "pending" | "ready" | "completed" | "cancelled"
      shop_status: "pending" | "approved" | "rejected"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["farmer", "shop", "dealer", "company"],
      distribution_status: [
        "pending",
        "approved",
        "shipped",
        "delivered",
        "rejected",
      ],
      order_status: ["pending", "ready", "completed", "cancelled"],
      shop_status: ["pending", "approved", "rejected"],
    },
  },
} as const
