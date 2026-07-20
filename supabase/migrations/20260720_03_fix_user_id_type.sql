-- Sửa lỗi kiểu dữ liệu: Chuyển user_id từ UUID sang TEXT vì dự án đang dùng username string (VD: 'admin123') thay vì Supabase Auth

-- 1. Xóa các policy RLS cũ (vì RLS cũ dùng auth.uid() vốn chỉ dùng cho Supabase Auth)
DROP POLICY IF EXISTS "Users can view their own batches" ON public.import_batches;
DROP POLICY IF EXISTS "Users can insert their own batches" ON public.import_batches;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.purchase_orders;

-- 2. Tắt RLS tạm thời để không chặn các tác vụ nếu chưa có cơ chế bảo mật (tương tự bảng purchase_records cũ)
ALTER TABLE public.import_batches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders DISABLE ROW LEVEL SECURITY;

-- 3. Gỡ ràng buộc Khóa ngoại (Foreign Key) tới bảng auth.users
ALTER TABLE public.import_batches DROP CONSTRAINT IF EXISTS import_batches_user_id_fkey;
ALTER TABLE public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_user_id_fkey;

-- 4. Đổi kiểu dữ liệu sang TEXT
ALTER TABLE public.import_batches ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE public.purchase_orders ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
