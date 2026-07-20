-- Thêm Unique Constraint cho bảng purchase_orders để hỗ trợ UPSERT
-- Chạy script này trong SQL Editor của Supabase

-- 1. Xóa dữ liệu cũ (nếu có trùng lặp) để có thể tạo Unique Constraint an toàn
-- Lưu ý: Lệnh này sẽ giữ lại bản ghi mới nhất cho mỗi cặp (user_id, unique_order_key) và xóa các bản ghi cũ.
DELETE FROM public.purchase_orders
WHERE id NOT IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY user_id, unique_order_key ORDER BY created_at DESC) as rnum
        FROM public.purchase_orders
    ) t
    WHERE t.rnum = 1
);

-- 2. Thêm Unique Constraint kết hợp user_id và unique_order_key
ALTER TABLE public.purchase_orders 
ADD CONSTRAINT purchase_orders_user_id_unique_order_key_key UNIQUE (user_id, unique_order_key);
