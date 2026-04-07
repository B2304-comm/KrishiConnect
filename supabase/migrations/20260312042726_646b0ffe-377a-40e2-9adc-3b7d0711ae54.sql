
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  reference_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can insert notifications (allow authenticated inserts for now)
CREATE POLICY "Authenticated users can create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Insert sample notifications for the existing user
INSERT INTO public.notifications (user_id, title, message, type) VALUES
  ('f89fa7e7-2d88-49ab-84c3-5be4801880fe', 'Booking Confirmed', 'Your booking #BK047249 for NPK 20:20:20 (5 bags) has been confirmed. Pickup from pihu shop.', 'booking'),
  ('f89fa7e7-2d88-49ab-84c3-5be4801880fe', 'Order Completed', 'Your order #BK804459 for Urea 46% has been successfully completed. Thank you!', 'order'),
  ('f89fa7e7-2d88-49ab-84c3-5be4801880fe', 'Low Stock Alert', 'DAP stock is running low at pihu shop. Only 12 bags remaining. Order soon!', 'stock_alert'),
  ('f89fa7e7-2d88-49ab-84c3-5be4801880fe', 'New Subsidy Available', 'Government subsidy of ₹500/bag on NPK fertilizers is now available. Apply before March 31.', 'subsidy'),
  ('f89fa7e7-2d88-49ab-84c3-5be4801880fe', 'Pickup Reminder', 'Reminder: Your booking #BK047249 is ready for pickup today at pihu shop, krishnanagar.', 'reminder');
