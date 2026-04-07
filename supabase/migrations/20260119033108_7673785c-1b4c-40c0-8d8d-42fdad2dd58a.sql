-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('farmer', 'shop', 'dealer', 'company');

-- Create enum for shop status
CREATE TYPE public.shop_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'ready', 'completed', 'cancelled');

-- Create enum for distribution request status
CREATE TYPE public.distribution_status AS ENUM ('pending', 'approved', 'shipped', 'delivered', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Create dealers table
CREATE TABLE public.dealers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    total_inventory INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create shops table (with dealer connection and approval workflow)
CREATE TABLE public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dealer_id UUID REFERENCES public.dealers(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    status shop_status DEFAULT 'pending',
    rating DECIMAL(2, 1) DEFAULT 0,
    total_stock INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    unit TEXT DEFAULT 'bag',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create shop_inventory table
CREATE TABLE public.shop_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    last_restocked TIMESTAMPTZ DEFAULT now(),
    UNIQUE (shop_id, product_id)
);

-- Create farmer_bookings table
CREATE TABLE public.farmer_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT UNIQUE NOT NULL,
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    pickup_date TIMESTAMPTZ,
    status order_status DEFAULT 'pending',
    qr_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create stock_alerts table
CREATE TABLE public.stock_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT NOT NULL, -- 'low_stock', 'out_of_stock', 'restocked'
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create distribution_requests table (shop orders from dealer)
CREATE TABLE public.distribution_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE NOT NULL,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
    dealer_id UUID REFERENCES public.dealers(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL,
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    expected_delivery TIMESTAMPTZ,
    status distribution_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create dealer_inventory table
CREATE TABLE public.dealer_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID REFERENCES public.dealers(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 0,
    UNIQUE (dealer_id, product_id)
);

-- Create companies table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create company_dealers table (company's connected dealers)
CREATE TABLE public.company_dealers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    dealer_id UUID REFERENCES public.dealers(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (company_id, dealer_id)
);

-- Insert default products
INSERT INTO public.products (name, description, base_price) VALUES
('NPK 20:20:20', 'Balanced fertilizer for all crops', 850),
('Urea 46%', 'High nitrogen content fertilizer', 875),
('DAP', 'Di-ammonium phosphate fertilizer', 1250),
('MOP', 'Muriate of Potash', 920),
('SSP', 'Single Super Phosphate', 680);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_dealers ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dealers_updated_at BEFORE UPDATE ON public.dealers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farmer_bookings_updated_at BEFORE UPDATE ON public.farmer_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_distribution_requests_updated_at BEFORE UPDATE ON public.distribution_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate booking number function
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_number := 'BK' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_booking_number BEFORE INSERT ON public.farmer_bookings FOR EACH ROW EXECUTE FUNCTION public.generate_booking_number();

-- Generate distribution request number function
CREATE OR REPLACE FUNCTION public.generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.request_number := 'DR' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_request_number BEFORE INSERT ON public.distribution_requests FOR EACH ROW EXECUTE FUNCTION public.generate_request_number();

-- RLS Policies

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles: Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Products: Everyone can view products
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Shops: Public can view approved shops, dealers can view all in their network
CREATE POLICY "Anyone can view approved shops" ON public.shops FOR SELECT USING (status = 'approved');
CREATE POLICY "Dealers can view all shops" ON public.shops FOR SELECT USING (public.has_role(auth.uid(), 'dealer'));
CREATE POLICY "Anyone can register shop" ON public.shops FOR INSERT WITH CHECK (true);
CREATE POLICY "Dealers can update shops" ON public.shops FOR UPDATE USING (public.has_role(auth.uid(), 'dealer'));
CREATE POLICY "Shop owners can update own shop" ON public.shops FOR UPDATE USING (auth.uid() = user_id);

-- Shop inventory: Public can view, shop owners can modify
CREATE POLICY "Anyone can view shop inventory" ON public.shop_inventory FOR SELECT USING (true);
CREATE POLICY "Shop owners can modify inventory" ON public.shop_inventory FOR ALL USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = shop_inventory.shop_id AND shops.user_id = auth.uid())
);

-- Dealers: Public can view dealers
CREATE POLICY "Anyone can view dealers" ON public.dealers FOR SELECT USING (true);
CREATE POLICY "Dealers can update own record" ON public.dealers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can register as dealer" ON public.dealers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Dealer inventory: Dealers can view and manage their own
CREATE POLICY "Dealers can view own inventory" ON public.dealer_inventory FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.dealers WHERE dealers.id = dealer_inventory.dealer_id AND dealers.user_id = auth.uid())
);
CREATE POLICY "Dealers can modify own inventory" ON public.dealer_inventory FOR ALL USING (
    EXISTS (SELECT 1 FROM public.dealers WHERE dealers.id = dealer_inventory.dealer_id AND dealers.user_id = auth.uid())
);

-- Farmer bookings: Farmers can view and create their own, shops can view theirs
CREATE POLICY "Farmers can view own bookings" ON public.farmer_bookings FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Shops can view their bookings" ON public.farmer_bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = farmer_bookings.shop_id AND shops.user_id = auth.uid())
);
CREATE POLICY "Farmers can create bookings" ON public.farmer_bookings FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Shops can update booking status" ON public.farmer_bookings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = farmer_bookings.shop_id AND shops.user_id = auth.uid())
);

-- Stock alerts: Related shops and farmers can view
CREATE POLICY "Anyone can view stock alerts" ON public.stock_alerts FOR SELECT USING (true);
CREATE POLICY "Shops can create alerts" ON public.stock_alerts FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = stock_alerts.shop_id AND shops.user_id = auth.uid())
);

-- Distribution requests: Shops and dealers can view related
CREATE POLICY "Shops can view own requests" ON public.distribution_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = distribution_requests.shop_id AND shops.user_id = auth.uid())
);
CREATE POLICY "Dealers can view their requests" ON public.distribution_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.dealers WHERE dealers.id = distribution_requests.dealer_id AND dealers.user_id = auth.uid())
);
CREATE POLICY "Shops can create requests" ON public.distribution_requests FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = distribution_requests.shop_id AND shops.user_id = auth.uid())
);
CREATE POLICY "Dealers can update request status" ON public.distribution_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.dealers WHERE dealers.id = distribution_requests.dealer_id AND dealers.user_id = auth.uid())
);

-- Companies: Company users can view and manage
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Company users can update own" ON public.companies FOR UPDATE USING (auth.uid() = user_id);

-- Company dealers: Companies can manage their dealers
CREATE POLICY "Anyone can view company dealers" ON public.company_dealers FOR SELECT USING (true);
CREATE POLICY "Companies can manage dealers" ON public.company_dealers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.companies WHERE companies.id = company_dealers.company_id AND companies.user_id = auth.uid())
);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.shops;
ALTER PUBLICATION supabase_realtime ADD TABLE public.distribution_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.farmer_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_alerts;