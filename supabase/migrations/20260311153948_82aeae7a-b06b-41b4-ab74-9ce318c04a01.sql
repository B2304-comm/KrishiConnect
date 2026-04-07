
-- Allow public read access to farmer_bookings for testing
CREATE POLICY "Public can view all bookings for testing" ON public.farmer_bookings FOR SELECT USING (true);
