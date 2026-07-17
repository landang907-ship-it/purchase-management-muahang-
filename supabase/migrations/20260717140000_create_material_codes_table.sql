-- Create table for material codes
create table if not exists public.material_codes (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.material_codes enable row level security;

-- Allow all authenticated users to view material codes
create policy "Authenticated users can view material codes"
  on public.material_codes for select
  using ( auth.role() = 'authenticated' );

-- Allow all authenticated users to insert/update material codes
create policy "Authenticated users can insert material codes"
  on public.material_codes for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authenticated users can update material codes"
  on public.material_codes for update
  using ( auth.role() = 'authenticated' )
  with check ( auth.role() = 'authenticated' );
