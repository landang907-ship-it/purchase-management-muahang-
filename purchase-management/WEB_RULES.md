# 🎨 QUY TẮC LẬP TRÌNH WEB CHUYÊN NGHIỆP

> Bộ quy tắc bắt buộc áp dụng cho mọi dự án Web trong phiên làm việc này.
> Cập nhật lần cuối: 06/2026

---

## 📚 HỆ THỐNG RULE (đọc theo thứ tự)

| # | File | Vai trò |
|---|------|---------|
| 1 | **[`PROJECT_STACK.md`](./PROJECT_STACK.md)** | 🚀 **Rule chính thức** – Stack bắt buộc & cấm. Đọc file này **TRƯỚC TIÊN**. |
| 2 | **[`SKILLS.md`](./SKILLS.md)** | 📖 Danh sách skill/technology được phép dùng. Mọi lib PHẢI có trong file này. |
| 3 | **[`WEB_RULES.md`](./WEB_RULES.md)** (file này) | 🎨 Quy tắc code style, security, error handling, mobile-first. |

> 🔒 **Nguyên tắc vàng:** *"Sau này chỉ dùng bộ skill trong `SKILLS.md` để làm dự án"*.
> Mọi công nghệ ngoài danh sách → **KHÔNG ĐƯỢỢC PHÉP** sử dụng.

---

## 1. Component-Driven Development
- **Bắt buộc** chia nhỏ UI thành các component độc lập, có thể tái sử dụng.
- Mỗi component phải nằm trong **một file riêng** và **dưới 300 dòng code**.
- Props phải được định kiểu rõ ràng (TypeScript `interface` / `type`).
- Component phải **pure** (không phụ thuộc trạng thái toàn cục nếu không cần).

## 2. Responsive Design First (Mobile-First)
- **Bắt buộc** thiết kế layout mượt mà trên **Mobile trước**.
- Sử dụng các breakpoint Tailwind theo thứ tự:
  - `sm:` (≥ 640px) — tablet nhỏ / mobile ngang
  - `md:` (≥ 768px) — tablet
  - `lg:` (≥ 1024px) — laptop / desktop
  - `xl:` (≥ 1280px) — desktop lớn
- **Không** viết CSS phá vỡ layout ở bất kỳ kích thước nào.
- Test trên ít nhất 3 viewport: 375×667, 768×1024, 1366×768.

## 3. Strict Security
- **Tuyệt đối không** hardcode các giá trị nhạy cảm vào source code:
  - API Key
  - Token Github
  - Connection String của Supabase / Database
- Mọi secret phải được đặt trong file `.env`:
  ```
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_ANON_KEY=...
  GITHUB_TOKEN=...
  ```
- File `.env` phải được thêm vào `.gitignore` ngay từ đầu dự án.
- Truy cập biến môi trường **chỉ** qua tiền tố hợp lệ (`VITE_`, `NEXT_PUBLIC_`, `REACT_APP_`...).
- **Không** commit file `.env` hoặc `.env.local` lên Git.

## 4. Error Handling chuẩn HTTP
- **Mọi** hàm gọi API hoặc truy vấn Database phải được bọc trong khối `try / catch`.
- Phải trả về mã HTTP Code chuẩn:
  | Code | Ý nghĩa |
  |------|---------|
  | `400` | Bad Request — dữ liệu đầu vào không hợp lệ |
  | `401` | Unauthorized — chưa xác thực / token sai |
  | `404` | Not Found — không tìm thấy tài nguyên |
  | `500` | Internal Server Error — lỗi hệ thống |
- Frontend phải hiển thị thông báo lỗi thân thiện cho người dùng (không chỉ `console.error`).
- Ghi log lỗi có **timestamp**, **endpoint**, **request id** để dễ truy vết.

## 5. Hot-Reloading Monitoring
- Khi chạy dev server ngầm bằng `npm run dev`, **bắt buộc** theo dõi log CLI liên tục trong **5 giây đầu tiên** sau khi khởi động.
- Mục tiêu: phát hiện **crash ngầm** hoặc lỗi biên dịch ngay từ đầu.
- Nếu server crash:
  1. Dừng tiến trình ngay.
  2. Đọc log lỗi.
  3. Sửa lỗi → khởi động lại → quan sát lại 5 giây.
- Không bao giờ để dev server chạy nền mà không kiểm tra trạng thái.

---

## 📌 Quy trình bắt buộc khi nhận task Web

1. **Phân tích** yêu cầu → xác định component, layout, API.
2. **Khởi tạo** project bằng `quick_web_boilerplate.bat <ten_du_an>`.
3. **Thiết kế Mobile-First** → responsive dần lên desktop.
4. **Bảo mật** → secret vào `.env`, `.env` vào `.gitignore`.
5. **Code component** → tách nhỏ, định kiểu props, dưới 300 dòng.
6. **Xử lý lỗi** → `try/catch` + HTTP code chuẩn.
7. **Chạy dev server** → quan sát log 5 giây → fix nếu crash.
8. **Test UI** bằng `check_ui_errors.js` → xem log console + screenshot.

---

*Áp dụng cho mọi dự án React / Vite / NextJS / Node.js trong workspace này.*
