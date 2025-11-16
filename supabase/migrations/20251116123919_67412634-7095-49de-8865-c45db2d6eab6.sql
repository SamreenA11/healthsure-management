-- Seed sample policies

-- Health Policy 1
INSERT INTO policies (id, name, type, description, base_premium, coverage_amount, term_years, min_age, max_age)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Basic Health Cover', 'health', 'Comprehensive health insurance with cashless hospitalization', 5000, 500000, 1, 18, 65),
  ('22222222-2222-2222-2222-222222222222', 'Premium Health Shield', 'health', 'Premium health coverage with pre-existing disease cover', 12000, 1000000, 1, 18, 70),
  ('33333333-3333-3333-3333-333333333333', 'Term Life Assurance', 'life', 'Pure term life insurance with high coverage', 8000, 5000000, 20, 18, 60),
  ('44444444-4444-4444-4444-444444444444', 'Family Floater Plan', 'family', 'Complete family health coverage with maternity benefits', 15000, 1500000, 1, 18, 65);

-- Health policy details
INSERT INTO health_policies (policy_id, hospital_coverage, network_hospitals, pre_existing_diseases_covered, waiting_period_months)
VALUES
  ('11111111-1111-1111-1111-111111111111', true, 5000, false, 24),
  ('22222222-2222-2222-2222-222222222222', true, 8000, true, 12);

-- Life policy details
INSERT INTO life_policies (policy_id, death_benefit, maturity_benefit, nominee_relation)
VALUES
  ('33333333-3333-3333-3333-333333333333', 5000000, 0, 'Spouse/Child/Parent');

-- Family policy details  
INSERT INTO family_policies (policy_id, max_dependents, maternity_coverage, newborn_coverage)
VALUES
  ('44444444-4444-4444-4444-444444444444', 6, true, true);