# SPEC: 002 — Vercel + Supabase Deployment

## 1. Overview

Thiết lập hạ tầng triển khai production để website có thể online trên internet
thông qua Vercel. Việc deploy lên internet chỉ được thực hiện khi mọi tính năng
cần thiết đã sẵn sàng, đã kiểm tra xong và build ổn định. Deploy là bước cuối
cùng của một phiên bản (release phase), không phải task phát triển hằng ngày.

Đồng thời chuẩn bị sẵn kiến trúc kết nối Supabase để phục vụ các tính năng
database trong các version tiếp theo.

## 2. User Stories

- **As a** Developer, **I want** push code to GitHub and see the website
  updated automatically **so that** I don't have to manually deploy.

- **As a** Employee, **I want** access the purchase management app from
  anywhere on the internet **so that** I can check my orders without being
  in the office.

- **As a** Developer, **I want** environment variables stored securely in
  Vercel **so that** secrets are not exposed in source code.

## 3. Architecture

```
┌─────────────────────────────────────────────────────────┐
│  GitHub Repository                                      │
│  purchase-management/                                   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ (Chỉ khi release: merge vào main)
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Vercel — Production Deployment                          │
│  - npm install                                          │
│  - npm run build                                        │
│  - Deploy to CDN                                        │
│  - Environment Variables                                 │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ (Chỉ khi release thật sự)
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Internet — https://purchase-management.vercel.app       │
└─────────────────────────────────────────────────────────┘

Supabase (version sau)
┌─────────────────────────────────────────────────────────┐
│  - Database: orders, users, logs                         │
│  - Auth: authentication                                   │
└─────────────────────────────────────────────────────────┘

Cloudflare Images (tính năng sau)
┌─────────────────────────────────────────────────────────┐
│  - Lưu hình ảnh / chứng từ đơn mua hàng                │
│  - CDN delivery                                          │
└─────────────────────────────────────────────────────────┘
```

## 4. Environments

| Environment | Branch    | URL                             | Purpose                         |
|-------------|-----------|---------------------------------|---------------------------------|
| Production  | `main`    | purchase-management.vercel.app | Website chính thức — CHỈ deploy khi release |
| Preview     | `*` other | *.vercel.app                   | Test kiểm tra trước khi merge  |

## 5. Acceptance Criteria

- [ ] Repository được kết nối với Vercel thông qua GitHub integration.
- [ ] Push lên branch khác → Vercel tạo preview deployment tự động (để kiểm tra).
- [ ] Build command: `npm run build` chạy thành công trên Vercel.
- [ ] Root Directory được đặt đúng: `purchase-management`.
- [ ] Output Directory: `dist`.
- [ ] `.env.example` đã được cập nhật với các biến môi trường cần thiết.
- [ ] Không có secret key nào bị commit vào repository.
- [ ] **CHỈ deploy production lên internet khi mọi tính năng đã sẵn sàng.**
- [ ] Website production truy cập được từ internet (test trên điện thoại/máy khác).

## 6. Release Policy

### Khi nào được deploy production?

**Deploy lên internet (production) CHỈ được thực hiện khi:**

1. Mọi tính năng theo spec/version đã hoàn thành.
2. `npm run build` chạy xanh trên local.
3. Kiểm tra giao diện và nghiệp vụ xong.
4. Checklist kiểm thử đã hoàn tất.
5. Build đã verify bằng Vercel preview deployment.
6. Người dùng hoặc người phụ trách xác nhận release.

**KHÔNG BAO GIỜ deploy production khi:**

- Còn đang phát triển tính năng mới.
- Build đang lỗi hoặc chưa verify.
- Chưa kiểm tra trên preview deployment.
- Nghiệp vụ chưa hoàn thiện.

### Preview vs Production

| Loại      | Khi nào | Mục đích                              |
|-----------|---------|---------------------------------------|
| Preview   | Luôn luôn khi push branch | Kiểm tra trước khi merge |
| Production | Chỉ khi release | Website thật cho người dùng cuối |

## 7. Out of Scope

- Cấu hình custom domain (có thể làm sau).
- Cấu hình CI/CD pipeline khác (Jenkins, GitHub Actions).
- Upload hình ảnh lên Cloudflare (làm ở version sau).
- Kết nối thật với Supabase backend (chuẩn bị kiến trúc, chưa code).

## 7. Technical Notes

### Vercel Configuration

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: purchase-management
```

### Environment Variables (sẽ thêm sau khi có Supabase)

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Repository Structure

```text
purchase-management/
├── .env.example      ← chỉ commit file này
├── .gitignore        ← không commit .env
├── vercel.json       ← cấu hình Vercel (nếu cần)
└── src/
```

### Git Workflow — Preview (luôn làm)

```text
1. Tạo branch mới: feature/xxx
2. Sửa code
3. npm run build (kiểm tra local)
4. Commit + Push
5. Vercel tạo preview deployment
6. Kiểm tra preview → OK
7. Tạo Pull Request
```

### Git Workflow — Production Release (chỉ khi sẵn sàng)

```text
1. Đảm bảo mọi tính năng đã hoàn thành
2. Build xanh: npm run build
3. Kiểm tra trên preview deployment
4. Review code qua Pull Request
5. Merge Pull Request vào main
6. Vercel tự deploy production
7. Kiểm tra website production trên internet
8. Thông báo cho người dùng
```

## 8. Deployment Checklist (trước khi release production)

- [ ] Mọi tính năng theo spec đã hoàn thành
- [ ] `npm run build` xanh trên local
- [ ] Kiểm tra giao diện và nghiệp vụ
- [ ] Kiểm tra trên Vercel preview deployment
- [ ] Không có secret key trong source code
- [ ] `.env.example` đã cập nhật đầy đủ
- [ ] Review code qua Pull Request
- [ ] Người phụ trách xác nhận release
- [ ] Merge vào main
- [ ] Production deploy tự động
- [ ] Kiểm tra website production trên internet
- [ ] Thông báo cho người dùng

## 9. Related Specs

- v1.0.0-001-purchase-management — Bản hiện tại
- v1.2.0-003-supabase-order-database — Kết nối Supabase sau
- v1.3.0-004-cloudflare-image-storage — Upload ảnh sau
