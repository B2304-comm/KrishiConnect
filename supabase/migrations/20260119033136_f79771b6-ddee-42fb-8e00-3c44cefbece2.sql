-- Fix the overly permissive shop insert policy
DROP POLICY IF EXISTS "Anyone can register shop" ON public.shops;

-- Create a more restrictive policy - shops can be registered by anyone but must have valid data
CREATE POLICY "Authenticated users can register shop" ON public.shops 
FOR INSERT 
WITH CHECK (
    -- Allow authenticated users to register shops
    auth.uid() IS NOT NULL
    -- Name and phone must be provided (enforced by table constraints)
);