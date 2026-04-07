
-- Drop the overly permissive insert policy
DROP POLICY "Authenticated users can create notifications" ON public.notifications;

-- Create a stricter insert policy
CREATE POLICY "Users can create own notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
