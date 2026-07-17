-- Add DELETE policy for material codes to allow clearing old data
create policy "Anyone can delete material codes"
  on public.material_codes for delete
  using ( true );
