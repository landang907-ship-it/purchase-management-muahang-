-- ============================================================
-- Migration 001: Create accounts table for authentication
-- ============================================================
-- HOW TO RUN:
--   1. Vào https://supabase.com/dashboard
--   2. Chọn project "purchase-management" (abfrrzuxvbnvizlwpxea)
--   3. Vào SQL Editor (icon </> ở sidebar)
--   4. New Query → Paste toàn bộ nội dung file này → Run (Ctrl+Enter)
-- ============================================================

-- 1. Drop if exists (clean recreate)
DROP TABLE IF EXISTS public.accounts CASCADE;

-- 2. Create accounts table
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user" TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,  -- SHA-256 hash (64 hex chars)
    language TEXT NOT NULL DEFAULT 'VI' CHECK (language IN ('VI', 'ZH')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create index on user column (fast login lookup)
CREATE INDEX IF NOT EXISTS idx_accounts_user ON public.accounts ("user");

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies (if recreate)
DROP POLICY IF EXISTS "Allow anon SELECT" ON public.accounts;
DROP POLICY IF EXISTS "Allow anon INSERT" ON public.accounts;
DROP POLICY IF EXISTS "Allow anon UPDATE" ON public.accounts;
DROP POLICY IF EXISTS "Allow anon DELETE" ON public.accounts;

-- 6. RLS policies (allow anon for demo)
CREATE POLICY "Allow anon SELECT" ON public.accounts
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon INSERT" ON public.accounts
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon UPDATE" ON public.accounts
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon DELETE" ON public.accounts
    FOR DELETE TO anon USING (true);

-- 7. Grant permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.accounts TO anon;

-- 8. (Optional) Insert default admin with correct SHA-256 hash of "130719197"
-- SHA-256("130719197") = d6dd3f3f61dfc39de4531b205e6e790c5f674cb01a2e49caf30dfdd7547bab21
-- NOTE: admin123/130719197 login bypasses DB via hardcoded validateCredentials(),
--       so this INSERT is OPTIONAL. Only needed if you want admin in DB too.
INSERT INTO public.accounts ("user", password, language)
VALUES (
    'admin123',
    'd6dd3f3f61dfc39de4531b205e6e790c5f674cb01a2e49caf30dfdd7547bab21',
    'VI'
)
ON CONFLICT ("user") DO NOTHING;

-- 9. Verify result
SELECT
    "user",
    language,
    LENGTH(password) AS hash_length,
    created_at
FROM public.accounts
ORDER BY created_at DESC;

-- ============================================================
-- Expected output: 1 row (admin123 / VI)
-- ============================================================