
CREATE OR REPLACE FUNCTION public.update_shop_inventory_on_delivery()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only run when status changes to 'delivered'
  IF NEW.status = 'delivered' AND (OLD.status IS DISTINCT FROM 'delivered') THEN
    -- Upsert into shop_inventory
    INSERT INTO public.shop_inventory (shop_id, product_id, quantity, price, last_restocked)
    SELECT NEW.shop_id, NEW.product_id, NEW.quantity,
           p.base_price, now()
    FROM public.products p WHERE p.id = NEW.product_id
    ON CONFLICT (shop_id, product_id)
    DO UPDATE SET
      quantity = COALESCE(shop_inventory.quantity, 0) + NEW.quantity,
      last_restocked = now();

    -- Update total_stock on the shop
    UPDATE public.shops
    SET total_stock = COALESCE(total_stock, 0) + NEW.quantity
    WHERE id = NEW.shop_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_inventory_on_delivery
  AFTER UPDATE ON public.distribution_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_shop_inventory_on_delivery();

-- Add unique constraint for upsert if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'shop_inventory_shop_product_unique'
  ) THEN
    ALTER TABLE public.shop_inventory ADD CONSTRAINT shop_inventory_shop_product_unique UNIQUE (shop_id, product_id);
  END IF;
END $$;
