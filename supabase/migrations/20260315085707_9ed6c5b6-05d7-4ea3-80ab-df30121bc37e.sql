CREATE POLICY "Shop owners can view own shops"
ON public.shops FOR SELECT
TO public
USING (auth.uid() = user_id);