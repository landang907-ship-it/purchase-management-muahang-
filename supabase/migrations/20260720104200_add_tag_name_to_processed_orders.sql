-- Add tag_name to processed_orders to support workshop filtering
alter table public.processed_orders add column if not exists tag_name text;
