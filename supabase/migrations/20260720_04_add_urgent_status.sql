-- Add urgent_status column to track urgent lifecycle phase

ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS urgent_status TEXT DEFAULT 'pending';

-- Migrate existing data: if is_urgent is true, keep it 'pending'. If false, set it to NULL or keep it 'pending' (but it won't matter since is_urgent=false).
UPDATE public.purchase_orders SET urgent_status = 'pending' WHERE is_urgent = true;
