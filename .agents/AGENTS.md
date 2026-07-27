# 🤖 AGENTS.md – Project Behavioral Rules & Guidelines

## 🛡️ LUẬT BẮT BUỘC: TRÁNH TRẮNG MÀN HÌNH KHI UPDATE (ANTI-WHITE-SCREEN SAFEGUARD RULE)

> **Hiệu lực**: Áp dụng bắt buộc cho mọi đợt cập nhật, refactor, hoặc update tính năng mới trên ứng dụng (Mobile & Desktop).

1. **Bọc ErrorBoundary ở cấp Root và Component con:**
   - Mọi ứng dụng React phải có `<ErrorBoundary>` bọc toàn bộ Router và các cụm giao diện chính.
   - Khi xảy ra lỗi JavaScript hoặc nạp dữ liệu thất bại, không bao giờ được phép unmount toàn bộ giao diện thành trang trắng (Blank screen), mà phải hiển thị Fallback UI bảo vệ kèm nút "Tải lại trang".

2. **Xử lý State và Async Fetching an toàn:**
   - Khi cập nhật dữ liệu ngầm (background polling / real-time WebSocket / auto-refresh), giữ nguyên state cũ (stale data) hoặc hiển thị skeleton/loading overlay mỏng thay vì trả về `null` hoặc `undefined` làm crash giao diện.

3. **Chạy kiểm thử compile/build song song trước khi Deploy:**
   - Luôn chạy `npm run build` hoặc `tsc --noEmit` để đảm bảo không có lỗi Syntax/Type gây crash ứng dụng khi khởi chạy trên môi trường thực tế (Vercel/Production).
