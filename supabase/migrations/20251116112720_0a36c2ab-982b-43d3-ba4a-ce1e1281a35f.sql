-- Create enum types for PostgreSQL
CREATE TYPE user_role AS ENUM ('admin', 'agent', 'customer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE policy_type AS ENUM ('health', 'life', 'family');
CREATE TYPE policy_status AS ENUM ('active', 'expired', 'cancelled');
CREATE TYPE payment_frequency AS ENUM ('monthly', 'quarterly', 'annually');
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected', 'processing');
CREATE TYPE payment_type AS ENUM ('premium', 'claim_settlement');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'upi', 'net_banking', 'cash');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE support_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Users table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'customer',
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agents table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialization TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  total_sales DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  aadhar_number TEXT UNIQUE,
  pan_number TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Policies table
CREATE TABLE public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type policy_type NOT NULL,
  description TEXT,
  base_premium DECIMAL(10,2) NOT NULL,
  coverage_amount DECIMAL(12,2) NOT NULL,
  term_years INTEGER NOT NULL,
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 65,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Health Policies table
CREATE TABLE public.health_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  hospital_coverage BOOLEAN DEFAULT true,
  network_hospitals INTEGER DEFAULT 0,
  pre_existing_diseases_covered BOOLEAN DEFAULT false,
  waiting_period_months INTEGER DEFAULT 0,
  UNIQUE(policy_id)
);

-- Life Policies table
CREATE TABLE public.life_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  nominee_relation TEXT,
  maturity_benefit DECIMAL(12,2),
  death_benefit DECIMAL(12,2),
  UNIQUE(policy_id)
);

-- Family Policies table
CREATE TABLE public.family_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  max_dependents INTEGER DEFAULT 4,
  maternity_coverage BOOLEAN DEFAULT false,
  newborn_coverage BOOLEAN DEFAULT false,
  UNIQUE(policy_id)
);

-- Policy Holders table
CREATE TABLE public.policy_holders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  premium_amount DECIMAL(10,2) NOT NULL,
  payment_frequency payment_frequency NOT NULL,
  status policy_status NOT NULL DEFAULT 'active',
  last_payment_date DATE,
  next_payment_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Claims table
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_holder_id UUID NOT NULL REFERENCES public.policy_holders(id) ON DELETE CASCADE,
  claim_amount DECIMAL(12,2) NOT NULL,
  claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
  incident_date DATE NOT NULL,
  incident_description TEXT NOT NULL,
  hospital_name TEXT,
  documents_submitted BOOLEAN DEFAULT false,
  status claim_status NOT NULL DEFAULT 'pending',
  approved_amount DECIMAL(12,2),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_holder_id UUID REFERENCES public.policy_holders(id) ON DELETE SET NULL,
  claim_id UUID REFERENCES public.claims(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_type payment_type NOT NULL,
  payment_method payment_method NOT NULL,
  transaction_id TEXT UNIQUE,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status payment_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Support Queries table
CREATE TABLE public.support_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status support_status NOT NULL DEFAULT 'open',
  priority priority_level NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES public.agents(id),
  response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_holders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for customers
CREATE POLICY "Customers can view own data" ON public.customers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Customers can update own data" ON public.customers FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for agents
CREATE POLICY "Agents can view own data" ON public.agents FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Agents can update own data" ON public.agents FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for policies (everyone can view)
CREATE POLICY "Anyone can view policies" ON public.policies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view health policies" ON public.health_policies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view life policies" ON public.life_policies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view family policies" ON public.family_policies FOR SELECT TO authenticated USING (true);

-- RLS Policies for policy holders
CREATE POLICY "Customers can view own policies" ON public.policy_holders FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);

-- RLS Policies for claims
CREATE POLICY "Customers can view own claims" ON public.claims FOR SELECT USING (
  policy_holder_id IN (
    SELECT ph.id FROM public.policy_holders ph
    JOIN public.customers c ON c.id = ph.customer_id
    WHERE c.user_id = auth.uid()
  )
);
CREATE POLICY "Customers can create claims" ON public.claims FOR INSERT WITH CHECK (
  policy_holder_id IN (
    SELECT ph.id FROM public.policy_holders ph
    JOIN public.customers c ON c.id = ph.customer_id
    WHERE c.user_id = auth.uid()
  )
);

-- RLS Policies for payments
CREATE POLICY "Customers can view own payments" ON public.payments FOR SELECT USING (
  policy_holder_id IN (
    SELECT ph.id FROM public.policy_holders ph
    JOIN public.customers c ON c.id = ph.customer_id
    WHERE c.user_id = auth.uid()
  )
);

-- RLS Policies for support queries
CREATE POLICY "Customers can view own support queries" ON public.support_queries FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);
CREATE POLICY "Customers can create support queries" ON public.support_queries FOR INSERT WITH CHECK (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_policy_holders_updated_at BEFORE UPDATE ON public.policy_holders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_support_queries_updated_at BEFORE UPDATE ON public.support_queries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample policies
INSERT INTO public.policies (name, type, description, base_premium, coverage_amount, term_years) VALUES
('Basic Health Insurance', 'health', 'Comprehensive health coverage with cashless hospitalization', 5000.00, 500000.00, 1),
('Family Floater Plan', 'family', 'Complete family health coverage for up to 6 members', 8000.00, 1000000.00, 1),
('Term Life Insurance', 'life', 'Pure life cover with high sum assured', 12000.00, 5000000.00, 20);