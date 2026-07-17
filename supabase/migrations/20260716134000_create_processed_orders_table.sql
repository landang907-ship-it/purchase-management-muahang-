-- Create table for processed/disappeared orders
create table if not exists public.processed_orders (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  pr_number text not null,
  item_no text,
  description text,
  requester text,
  quantity text,
  unit text,
  status text,
  disappeared_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.processed_orders enable row level security;

create policy "Users can view their own processed orders"
  on public.processed_orders for select
  using ( true );

create policy "Users can insert their own processed orders"
  on public.processed_orders for insert
  with check ( true );
