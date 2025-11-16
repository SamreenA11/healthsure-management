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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          commission_rate: number | null
          created_at: string
          full_name: string
          id: string
          phone: string
          specialization: string | null
          total_sales: number | null
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string
          full_name: string
          id?: string
          phone: string
          specialization?: string | null
          total_sales?: number | null
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          specialization?: string | null
          total_sales?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          approved_amount: number | null
          claim_amount: number
          claim_date: string
          created_at: string
          documents_submitted: boolean | null
          hospital_name: string | null
          id: string
          incident_date: string
          incident_description: string
          policy_holder_id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["claim_status"]
          updated_at: string
        }
        Insert: {
          approved_amount?: number | null
          claim_amount: number
          claim_date?: string
          created_at?: string
          documents_submitted?: boolean | null
          hospital_name?: string | null
          id?: string
          incident_date: string
          incident_description: string
          policy_holder_id: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
        }
        Update: {
          approved_amount?: number | null
          claim_amount?: number
          claim_date?: string
          created_at?: string
          documents_submitted?: boolean | null
          hospital_name?: string | null
          id?: string
          incident_date?: string
          incident_description?: string
          policy_holder_id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_policy_holder_id_fkey"
            columns: ["policy_holder_id"]
            isOneToOne: false
            referencedRelation: "policy_holders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          aadhar_number: string | null
          address: string | null
          agent_id: string | null
          city: string | null
          created_at: string
          date_of_birth: string
          full_name: string
          id: string
          pan_number: string | null
          phone: string
          pincode: string | null
          state: string | null
          user_id: string
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          agent_id?: string | null
          city?: string | null
          created_at?: string
          date_of_birth: string
          full_name: string
          id?: string
          pan_number?: string | null
          phone: string
          pincode?: string | null
          state?: string | null
          user_id: string
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          agent_id?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string
          full_name?: string
          id?: string
          pan_number?: string | null
          phone?: string
          pincode?: string | null
          state?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_policies: {
        Row: {
          id: string
          maternity_coverage: boolean | null
          max_dependents: number | null
          newborn_coverage: boolean | null
          policy_id: string
        }
        Insert: {
          id?: string
          maternity_coverage?: boolean | null
          max_dependents?: number | null
          newborn_coverage?: boolean | null
          policy_id: string
        }
        Update: {
          id?: string
          maternity_coverage?: boolean | null
          max_dependents?: number | null
          newborn_coverage?: boolean | null
          policy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_policies_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: true
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      health_policies: {
        Row: {
          hospital_coverage: boolean | null
          id: string
          network_hospitals: number | null
          policy_id: string
          pre_existing_diseases_covered: boolean | null
          waiting_period_months: number | null
        }
        Insert: {
          hospital_coverage?: boolean | null
          id?: string
          network_hospitals?: number | null
          policy_id: string
          pre_existing_diseases_covered?: boolean | null
          waiting_period_months?: number | null
        }
        Update: {
          hospital_coverage?: boolean | null
          id?: string
          network_hospitals?: number | null
          policy_id?: string
          pre_existing_diseases_covered?: boolean | null
          waiting_period_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_policies_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: true
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      life_policies: {
        Row: {
          death_benefit: number | null
          id: string
          maturity_benefit: number | null
          nominee_relation: string | null
          policy_id: string
        }
        Insert: {
          death_benefit?: number | null
          id?: string
          maturity_benefit?: number | null
          nominee_relation?: string | null
          policy_id: string
        }
        Update: {
          death_benefit?: number | null
          id?: string
          maturity_benefit?: number | null
          nominee_relation?: string | null
          policy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "life_policies_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: true
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          claim_id: string | null
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          policy_holder_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
        }
        Insert: {
          amount: number
          claim_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          policy_holder_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          claim_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_type?: Database["public"]["Enums"]["payment_type"]
          policy_holder_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_policy_holder_id_fkey"
            columns: ["policy_holder_id"]
            isOneToOne: false
            referencedRelation: "policy_holders"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          base_premium: number
          coverage_amount: number
          created_at: string
          description: string | null
          id: string
          max_age: number | null
          min_age: number | null
          name: string
          term_years: number
          type: Database["public"]["Enums"]["policy_type"]
        }
        Insert: {
          base_premium: number
          coverage_amount: number
          created_at?: string
          description?: string | null
          id?: string
          max_age?: number | null
          min_age?: number | null
          name: string
          term_years: number
          type: Database["public"]["Enums"]["policy_type"]
        }
        Update: {
          base_premium?: number
          coverage_amount?: number
          created_at?: string
          description?: string | null
          id?: string
          max_age?: number | null
          min_age?: number | null
          name?: string
          term_years?: number
          type?: Database["public"]["Enums"]["policy_type"]
        }
        Relationships: []
      }
      policy_holders: {
        Row: {
          created_at: string
          customer_id: string
          end_date: string
          id: string
          last_payment_date: string | null
          next_payment_date: string | null
          payment_frequency: Database["public"]["Enums"]["payment_frequency"]
          policy_id: string
          premium_amount: number
          start_date: string
          status: Database["public"]["Enums"]["policy_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          end_date: string
          id?: string
          last_payment_date?: string | null
          next_payment_date?: string | null
          payment_frequency: Database["public"]["Enums"]["payment_frequency"]
          policy_id: string
          premium_amount: number
          start_date: string
          status?: Database["public"]["Enums"]["policy_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          end_date?: string
          id?: string
          last_payment_date?: string | null
          next_payment_date?: string | null
          payment_frequency?: Database["public"]["Enums"]["payment_frequency"]
          policy_id?: string
          premium_amount?: number
          start_date?: string
          status?: Database["public"]["Enums"]["policy_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_holders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_holders_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: []
      }
      support_queries: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string
          id: string
          message: string
          priority: Database["public"]["Enums"]["priority_level"]
          resolved_at: string | null
          response: string | null
          status: Database["public"]["Enums"]["support_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id: string
          id?: string
          message: string
          priority?: Database["public"]["Enums"]["priority_level"]
          resolved_at?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["support_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          message?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          resolved_at?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["support_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_queries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_queries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      claim_status: "pending" | "approved" | "rejected" | "processing"
      payment_frequency: "monthly" | "quarterly" | "annually"
      payment_method:
        | "credit_card"
        | "debit_card"
        | "upi"
        | "net_banking"
        | "cash"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      payment_type: "premium" | "claim_settlement"
      policy_status: "active" | "expired" | "cancelled"
      policy_type: "health" | "life" | "family"
      priority_level: "low" | "medium" | "high" | "urgent"
      support_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "admin" | "agent" | "customer"
      user_status: "active" | "inactive" | "suspended"
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
      claim_status: ["pending", "approved", "rejected", "processing"],
      payment_frequency: ["monthly", "quarterly", "annually"],
      payment_method: [
        "credit_card",
        "debit_card",
        "upi",
        "net_banking",
        "cash",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      payment_type: ["premium", "claim_settlement"],
      policy_status: ["active", "expired", "cancelled"],
      policy_type: ["health", "life", "family"],
      priority_level: ["low", "medium", "high", "urgent"],
      support_status: ["open", "in_progress", "resolved", "closed"],
      user_role: ["admin", "agent", "customer"],
      user_status: ["active", "inactive", "suspended"],
    },
  },
} as const
