CREATE TABLE public.company_market_coverage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  state_name TEXT NOT NULL,
  coverage INTEGER NOT NULL DEFAULT 0,
  dealers_count INTEGER NOT NULL DEFAULT 0,
  shops_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, state_name)
);

CREATE TABLE public.production_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  assigned_dealer_id UUID NULL REFERENCES public.dealers(id) ON DELETE SET NULL,
  batch_number TEXT NOT NULL UNIQUE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  manufacturing_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT production_batches_expiry_after_manufacturing
    CHECK (expiry_date >= manufacturing_date)
);

ALTER TABLE public.company_market_coverage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company users can insert own company"
ON public.companies FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Company users can manage own market coverage"
ON public.company_market_coverage FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.companies
    WHERE companies.id = company_market_coverage.company_id
      AND companies.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.companies
    WHERE companies.id = company_market_coverage.company_id
      AND companies.user_id = auth.uid()
  )
);

CREATE POLICY "Company users can manage own production batches"
ON public.production_batches FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.companies
    WHERE companies.id = production_batches.company_id
      AND companies.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.companies
    WHERE companies.id = production_batches.company_id
      AND companies.user_id = auth.uid()
  )
);

CREATE TRIGGER update_company_market_coverage_updated_at
BEFORE UPDATE ON public.company_market_coverage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_production_batches_updated_at
BEFORE UPDATE ON public.production_batches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
