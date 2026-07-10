-- Alter existing accounts table to support roles and profiles
ALTER TABLE public.accounts
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user',
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone('utc'::text, now()) NOT NULL;

-- Turn on Row Level Security (if not already enabled)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Note: Since they use a custom auth mechanism, we don't have auth.uid(). 
-- We will handle roles at the application level (in the React Context) for now, 
-- or we can create a secure API endpoint. For the MVP of User Management, 
-- we just need the columns in the database.
