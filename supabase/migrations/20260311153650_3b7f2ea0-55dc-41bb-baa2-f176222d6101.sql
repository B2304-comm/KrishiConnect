
-- Fix farmer_bookings: drop RESTRICTIVE policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Farmers can view own bookings" ON public.farmer_bookings;
DROP POLICY IF EXISTS "Farmers can create bookings" ON public.farmer_bookings;
DROP POLICY IF EXISTS "Shops can update booking status" ON public.farmer_bookings;
DROP POLICY IF EXISTS "Shops can view their bookings" ON public.farmer_bookings;

CREATE POLICY "Farmers can view own bookings" ON public.farmer_bookings FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers can create bookings" ON public.farmer_bookings FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Shops can update booking status" ON public.farmer_bookings FOR UPDATE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = farmer_bookings.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Shops can view their bookings" ON public.farmer_bookings FOR SELECT USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = farmer_bookings.shop_id AND shops.user_id = auth.uid()));

-- Fix shops: drop RESTRICTIVE policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can view approved shops" ON public.shops;
DROP POLICY IF EXISTS "Authenticated users can register shop" ON public.shops;
DROP POLICY IF EXISTS "Dealers can update shops" ON public.shops;
DROP POLICY IF EXISTS "Dealers can view all shops" ON public.shops;
DROP POLICY IF EXISTS "Shop owners can update own shop" ON public.shops;

CREATE POLICY "Anyone can view approved shops" ON public.shops FOR SELECT USING (status = 'approved'::shop_status);
CREATE POLICY "Authenticated users can register shop" ON public.shops FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Dealers can update shops" ON public.shops FOR UPDATE USING (has_role(auth.uid(), 'dealer'::app_role));
CREATE POLICY "Dealers can view all shops" ON public.shops FOR SELECT USING (has_role(auth.uid(), 'dealer'::app_role));
CREATE POLICY "Shop owners can update own shop" ON public.shops FOR UPDATE USING (auth.uid() = user_id);

-- Fix products: drop RESTRICTIVE and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Fix dealers
DROP POLICY IF EXISTS "Anyone can view dealers" ON public.dealers;
DROP POLICY IF EXISTS "Dealers can update own record" ON public.dealers;
DROP POLICY IF EXISTS "Users can register as dealer" ON public.dealers;

CREATE POLICY "Anyone can view dealers" ON public.dealers FOR SELECT USING (true);
CREATE POLICY "Dealers can update own record" ON public.dealers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can register as dealer" ON public.dealers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Fix user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix remaining tables
DROP POLICY IF EXISTS "Anyone can view stock alerts" ON public.stock_alerts;
DROP POLICY IF EXISTS "Shops can create alerts" ON public.stock_alerts;
CREATE POLICY "Anyone can view stock alerts" ON public.stock_alerts FOR SELECT USING (true);
CREATE POLICY "Shops can create alerts" ON public.stock_alerts FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM shops WHERE shops.id = stock_alerts.shop_id AND shops.user_id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can view shop inventory" ON public.shop_inventory;
DROP POLICY IF EXISTS "Shop owners can modify inventory" ON public.shop_inventory;
CREATE POLICY "Anyone can view shop inventory" ON public.shop_inventory FOR SELECT USING (true);
CREATE POLICY "Shop owners can modify inventory" ON public.shop_inventory FOR ALL USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = shop_inventory.shop_id AND shops.user_id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can view companies" ON public.companies;
DROP POLICY IF EXISTS "Company users can update own" ON public.companies;
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Company users can update own" ON public.companies FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view company dealers" ON public.company_dealers;
DROP POLICY IF EXISTS "Companies can manage dealers" ON public.company_dealers;
CREATE POLICY "Anyone can view company dealers" ON public.company_dealers FOR SELECT USING (true);
CREATE POLICY "Companies can manage dealers" ON public.company_dealers FOR ALL USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = company_dealers.company_id AND companies.user_id = auth.uid()));

DROP POLICY IF EXISTS "Dealers can view own inventory" ON public.dealer_inventory;
DROP POLICY IF EXISTS "Dealers can modify own inventory" ON public.dealer_inventory;
CREATE POLICY "Dealers can view own inventory" ON public.dealer_inventory FOR SELECT USING (EXISTS (SELECT 1 FROM dealers WHERE dealers.id = dealer_inventory.dealer_id AND dealers.user_id = auth.uid()));
CREATE POLICY "Dealers can modify own inventory" ON public.dealer_inventory FOR ALL USING (EXISTS (SELECT 1 FROM dealers WHERE dealers.id = dealer_inventory.dealer_id AND dealers.user_id = auth.uid()));

DROP POLICY IF EXISTS "Dealers can view their requests" ON public.distribution_requests;
DROP POLICY IF EXISTS "Dealers can update request status" ON public.distribution_requests;
DROP POLICY IF EXISTS "Shops can create requests" ON public.distribution_requests;
DROP POLICY IF EXISTS "Shops can view own requests" ON public.distribution_requests;
CREATE POLICY "Dealers can view their requests" ON public.distribution_requests FOR SELECT USING (EXISTS (SELECT 1 FROM dealers WHERE dealers.id = distribution_requests.dealer_id AND dealers.user_id = auth.uid()));
CREATE POLICY "Dealers can update request status" ON public.distribution_requests FOR UPDATE USING (EXISTS (SELECT 1 FROM dealers WHERE dealers.id = distribution_requests.dealer_id AND dealers.user_id = auth.uid()));
CREATE POLICY "Shops can create requests" ON public.distribution_requests FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM shops WHERE shops.id = distribution_requests.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Shops can view own requests" ON public.distribution_requests FOR SELECT USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = distribution_requests.shop_id AND shops.user_id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can submit demo request" ON public.demo_requests;
DROP POLICY IF EXISTS "Company users can update demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Company users can view demo requests" ON public.demo_requests;
CREATE POLICY "Anyone can submit demo request" ON public.demo_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Company users can update demo requests" ON public.demo_requests FOR UPDATE USING (has_role(auth.uid(), 'company'::app_role));
CREATE POLICY "Company users can view demo requests" ON public.demo_requests FOR SELECT USING (has_role(auth.uid(), 'company'::app_role));
