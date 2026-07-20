-- Add request_date column to purchase_orders and processed_orders

ALTER TABLE public.purchase_orders 
ADD COLUMN IF NOT EXISTS request_date TEXT;

ALTER TABLE public.processed_orders 
ADD COLUMN IF NOT EXISTS request_date TEXT;
