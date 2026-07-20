-- Giai đoạn 3: Tính năng Báo cáo Cần gấp (Urgent Requests)
-- Thêm các cột lưu trữ thông tin khẩn cấp vào bảng purchase_orders và processed_orders

ALTER TABLE public.purchase_orders 
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS urgent_reason TEXT,
ADD COLUMN IF NOT EXISTS urgent_image_url TEXT;

ALTER TABLE public.processed_orders 
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS urgent_reason TEXT,
ADD COLUMN IF NOT EXISTS urgent_image_url TEXT;
