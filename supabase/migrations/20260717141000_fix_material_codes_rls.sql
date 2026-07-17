-- Fix RLS for material codes to allow public access (matching processed_orders table)
drop policy if exists "Authenticated users can view material codes" on public.material_codes;
drop policy if exists "Authenticated users can insert material codes" on public.material_codes;
drop policy if exists "Authenticated users can update material codes" on public.material_codes;

create policy "Anyone can view material codes"
  on public.material_codes for select
  using ( true );

create policy "Anyone can insert material codes"
  on public.material_codes for insert
  with check ( true );

create policy "Anyone can update material codes"
  on public.material_codes for update
  using ( true )
  with check ( true );
