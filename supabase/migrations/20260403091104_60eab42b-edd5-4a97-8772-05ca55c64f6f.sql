
CREATE TABLE public.state_districts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  coverage INTEGER DEFAULT 0,
  dealers_count INTEGER DEFAULT 0,
  shops_count INTEGER DEFAULT 0,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(state_name, district_name)
);

ALTER TABLE public.state_districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view districts"
ON public.state_districts FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can add districts"
ON public.state_districts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own districts"
ON public.state_districts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own districts"
ON public.state_districts FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_state_districts_updated_at
BEFORE UPDATE ON public.state_districts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
