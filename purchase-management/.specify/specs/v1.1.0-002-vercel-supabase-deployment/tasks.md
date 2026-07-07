# TASKS: 002 — Vercel + Supabase Deployment

## Phase 1: Chuẩn bị Repository

- [ ] Tạo GitHub repository mới (nếu chưa có)
- [ ] Push toàn bộ code hiện tại lên GitHub
- [ ] Kiểm tra `.gitignore` có `.env`
- [ ] Không có file `.env` trong repository

## Phase 2: Kết nối Vercel

- [ ] Đăng nhập Vercel bằng tài khoản GitHub
- [ ] Import repository "purchase-management" vào Vercel
- [ ] Cấu hình Root Directory: `purchase-management`
- [ ] Cấu hình Build Command: `npm run build`
- [ ] Cấu hình Output Directory: `dist`
- [ ] Cấu hình Install Command: `npm install`
- [ ] Nhấn Deploy lần đầu
- [ ] Chờ Vercel build và deploy thành công

## Phase 3: Xác minh Deploy

- [ ] Mở URL production: `https://purchase-management.vercel.app`
- [ ] Kiểm tra website load đúng
- [ ] Kiểm tra trên điện thoại (mạng 4G/5G, không phải Wi-Fi LAN)
- [ ] Kiểm tra trên trình duyệt khác (Chrome, Edge, Safari)

## Phase 4: Test Preview Deploy (Preview Workflow)

- [ ] Tạo branch mới: `git checkout -b test/preview-deploy`
- [ ] Thêm một thay đổi nhỏ (ví dụ: sửa text trong README)
- [ ] Commit và push branch lên GitHub
- [ ] Mở Vercel Dashboard → xem Preview Deployment
- [ ] Click vào Preview URL → kiểm tra website
- [ ] Đã hiểu: Preview deploy LUÔN LUÔN chạy khi push branch
- [ ] **KHÔNG merge vào main ngay** — chỉ test preview thôi

## Phase 5: Cập nhật tài liệu

- [ ] Cập nhật `.env.example` với các biến môi trường:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_CLOUDFLARE_ACCOUNT_ID` (comment là "sau này")
  - `VITE_CLOUDFLARE_IMAGES_DELIVERY_URL` (comment là "sau này")
- [ ] Cập nhật `README.md` với hướng dẫn deploy
- [ ] Cập nhật `constitution.md` thêm Infrastructure section (nếu cần)

## Phase 6: Thiết lập Supabase Project (chuẩn bị, chưa code thật)

- [ ] Tạo Supabase project
- [ ] Copy Project URL vào `.env.example`
- [ ] Copy Anon Key vào `.env.example` (public, an toàn)
- [ ] Thêm env vars vào Vercel Dashboard (Production + Preview + Development)
- [ ] Không commit `.env` thật

## Phase 7: Production Release (CHỈ KHI MỌI TÍNH NĂNG ĐÃ SẴN SÀNG)

**QUAN TRỌNG**: Phase này chỉ thực hiện khi tất cả tính năng đã hoàn tất, KHÔNG phải bước thường ngày.

#### 7.1. Điều kiện để Production Release

- [ ] Tất cả tính năng đang phát triển đã hoàn tất
- [ ] Đã test tất cả chức năng trên Preview URLs
- [ ] Đã qua Production Release Checklist (plan.md mục 5.3)
- [ ] Team đồng ý release

#### 7.2. Thực hiện Release

- [ ] Chạy `npm run build` local — phải xanh
- [ ] Merge Pull Request vào main
- [ ] Vercel tự deploy Production
- [ ] Kiểm tra website production
- [ ] Thông báo cho team

#### 7.3. Sau Release

- [ ] Xoá các branch đã merge
- [ ] Monitor website trong 24h đầu

## Phase 8: Ghi nhận thông tin Deploy

- [ ] Ghi lại Production URL
- [ ] Ghi lại Vercel Project ID
- [ ] Ghi lại Supabase Project URL
- [ ] Ghi lại GitHub Repository URL
- [ ] Thông báo cho team về website mới
