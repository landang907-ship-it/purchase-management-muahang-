# REQUIREMENTS CHECKLIST: 002 — Vercel + Supabase Deployment

Dùng checklist này để rà soát trước khi bắt đầu triển khai.

## Trước khi triển khai

- [ ] **GitHub Account**: Đã có tài khoản GitHub và đăng nhập trên https://github.com
- [ ] **Vercel Account**: Đã có tài khoản Vercel (đăng nhập bằng GitHub)
- [ ] **Repository**: Source code đã push lên GitHub
- [ ] **Build verify**: `npm run build` chạy thành công trên local
- [ ] **Git clean**: Không có thay đổi chưa commit quan trọng
- [ ] **Backup**: Đã backup code ở đâu đó (cloud/USB) phòng trường hợp

## Kiến trúc và Cấu hình

- [ ] **Root Directory**: Đã xác định rõ thư mục gốc là `purchase-management`
- [ ] **Build Command**: Xác nhận `npm run build` hoạt động đúng
- [ ] **Output Directory**: Xác nhận output là `dist`
- [ ] **Dependencies**: `package.json` đã có đủ dependencies cần thiết
- [ ] **TypeScript**: `tsconfig.json` cấu hình đúng cho Vite

## Bảo mật

- [ ] **.gitignore**: File `.env` đã được thêm vào `.gitignore`
- [ ] **No secrets in code**: Không có API key, password, token trong source code
- [ ] **.env.example**: Đã tạo file với danh sách các biến môi trường cần thiết
- [ ] **Public keys only in frontend**: Chỉ đưa public/anon keys vào frontend

## Supabase chuẩn bị

- [ ] **Supabase Project**: Đã tạo project trên https://supabase.com
- [ ] **Project URL**: Đã copy URL vào `.env.example`
- [ ] **Anon Key**: Đã copy anon key vào `.env.example`
- [ ] **Service Role Key**: Đã lưu ở nơi bảo mật (chỉ dùng backend)
- [ ] **RLS Policy**: Hiểu về Row Level Security để bảo mật data sau này

## Cloudflare chuẩn bị (tính năng sau)

- [ ] **Cloudflare Account**: Đã có tài khoản Cloudflare
- [ ] **Images vs R2**: Đã xác định dùng Images hay R2 cho lưu trữ ảnh
- [ ] **Upload flow**: Đã hiểu luồng upload phải qua backend/serverless
- [ ] **Security**: Hiểu không đưa Cloudflare API Token vào frontend

## Vercel Deployment

- [ ] **Import success**: Repository đã được import vào Vercel
- [ ] **First deploy**: Lần deploy đầu tiên thành công
- [ ] **Preview auto**: Preview deployment tự tạo khi push branch mới
- [ ] **Production auto**: Production deploy tự chạy khi merge vào main
- [ ] **Build time**: Thời gian build trên Vercel < 5 phút
- [ ] **Environment Variables**: Đã thêm các biến cần thiết vào Vercel Dashboard

## Kiểm tra sau khi Deploy

- [ ] **Production URL works**: Website mở được từ internet
- [ ] **Mobile test**: Mở được trên điện thoại (4G/5G)
- [ ] **Functionality**: Các chức năng chính vẫn hoạt động
- [ ] **Performance**: Website load nhanh, không có lỗi console
- [ ] **HTTPS**: Website dùng HTTPS (Vercel tự cấp)
- [ ] **Preview URL works**: Preview deployment hoạt động đúng

## Quy trình phát triển

- [ ] **Git workflow**: Đã hiểu quy trình feature branch → PR → merge
- [ ] **Preview first**: Đã quen với việc kiểm tra preview trước khi merge
- [ ] **Rollback plan**: Biết cách promote previous deployment nếu lỗi
- [ ] **Team notification**: Team đã biết về website mới và cách truy cập

## Production Release Policy (QUAN TRỌNG)

**KHÔNG deploy production thường xuyên**. Production release CHỈ thực hiện khi:

- [ ] **Feature freeze**: Tất cả tính năng đang phát triển đã hoàn tất
- [ ] **All previews tested**: Đã test tất cả chức năng trên Preview URLs
- [ ] **Requirements passed**: Đã qua requirements checklist của feature đó
- [ ] **Team approval**: Team đã review và đồng ý release
- [ ] **Not daily workflow**: Hiểu rằng preview deploy là workflow hằng ngày, production deploy KHÔNG phải

### Release Day Checklist

Khi quyết định release production:

- [ ] Chạy `npm run build` local — phải xanh
- [ ] Kiểm tra lại tất cả Preview URLs lần cuối
- [ ] Backup code (git commit + push)
- [ ] Merge PR vào main
- [ ] Monitor website production sau khi deploy
- [ ] Thông báo cho team

## Tài liệu

- [ ] **README.md**: Đã cập nhật với thông tin deploy
- [ ] **constitution.md**: Đã ghi nhận kiến trúc hạ tầng (Vercel + Supabase)
- [ ] **.env.example**: Đã commit lên GitHub với đầy đủ placeholder
- [ ] **Vercel settings**: Các cấu hình quan trọng đã được ghi lại

## Chi phí

- [ ] **Vercel free tier**: Hiểu giới hạn của Vercel Hobby plan (100GB bandwidth, 100 deploys/month)
- [ ] **Supabase free tier**: Hiểu giới hạn của Supabase free (500MB database, 1GB storage)
- [ ] **Cloudflare free tier**: Hiểu giới hạn của Cloudflare Images/R2
- [ ] **Monitor usage**: Biết cách theo dõi usage trên các dịch vụ

## Thông tin liên hệ và Truy cập

- [ ] **Vercel project link**: Đã lưu link Vercel Dashboard
- [ ] **Supabase project link**: Đã lưu link Supabase Dashboard
- [ ] **GitHub repo link**: Đã lưu link GitHub repository
- [ ] **Production URL**: Đã ghi nhận URL production
- [ ] **Access control**: Đã thiết lập ai có quyền deploy trên Vercel
