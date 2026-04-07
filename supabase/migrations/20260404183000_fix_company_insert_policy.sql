ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Company users can insert own company" ON public.companies;

CREATE POLICY "Company users can insert own company"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
