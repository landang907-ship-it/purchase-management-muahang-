-- Giai đoạn 1: Chuẩn hóa Database
-- Chạy script này trong SQL Editor của Supabase

-- 1. Tạo bảng import_batches để lưu thông tin về lần upload
CREATE TABLE public.import_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_rows INTEGER NOT NULL DEFAULT 0
);

-- Bật RLS cho import_batches
ALTER TABLE public.import_batches ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and insert their own batches
CREATE POLICY "Users can view their own batches" ON public.import_batches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own batches" ON public.import_batches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Tạo bảng purchase_orders để lưu chi tiết từng dòng
CREATE TABLE public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES public.import_batches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pr_number TEXT,          -- Yc.m.hàng
    item_no TEXT,            -- Vật tư
    description TEXT,        -- Văn bản ngắn
    requester TEXT,          -- Ng.yêu cầu
    quantity NUMERIC,        -- Số lượng
    unit TEXT,               -- Đơn vị đo lường
    status TEXT,             -- T.trg xử lý
    tag_name TEXT,           -- TAG-NAME
    unique_order_key TEXT,   -- Hash hoặc kết hợp pr_number + item_no
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật RLS cho purchase_orders
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and insert their own orders
CREATE POLICY "Users can view their own orders" ON public.purchase_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.purchase_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.purchase_orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Tạo Index để truy vấn nhanh
CREATE INDEX idx_purchase_orders_batch_id ON public.purchase_orders(batch_id);
CREATE INDEX idx_purchase_orders_unique_key ON public.purchase_orders(unique_order_key);
CREATE INDEX idx_purchase_orders_user_id ON public.purchase_orders(user_id);
CREATE INDEX idx_import_batches_user_id ON public.import_batches(user_id);
