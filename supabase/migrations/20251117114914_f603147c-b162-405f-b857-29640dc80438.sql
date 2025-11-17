-- Fix RLS policies for policy purchases and claims
-- Allow customers to purchase policies (insert into policy_holders)
CREATE POLICY "Customers can purchase policies"
ON public.policy_holders
FOR INSERT
TO authenticated
WITH CHECK (customer_id IN (
  SELECT id FROM customers WHERE user_id = auth.uid()
));

-- Allow customers to update their own policy holders records
CREATE POLICY "Customers can update own policies"
ON public.policy_holders
FOR UPDATE
TO authenticated
USING (customer_id IN (
  SELECT id FROM customers WHERE user_id = auth.uid()
));

-- Fix claims query - allow customers to view claims by policy_holder_id
DROP POLICY IF EXISTS "Customers can view own claims" ON public.claims;
CREATE POLICY "Customers can view own claims"
ON public.claims
FOR SELECT
TO authenticated
USING (policy_holder_id IN (
  SELECT id FROM policy_holders WHERE customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
));