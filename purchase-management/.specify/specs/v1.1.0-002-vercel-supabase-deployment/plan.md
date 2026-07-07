# PLAN: 002 — Vercel + Supabase Deployment

## 1. Mục tiêu

Thiết lập CI/CD tự động với Vercel để website luôn online trên internet.
Chuẩn bị kiến trúc kết nối Supabase cho các version tiếp theo.

## 2. Target State

```text
GitHub Repository
      │
      │ push code
      ▼
┌─────────────────────────────────────────────────────────┐
│ Vercel                                                     │
│ - Auto-deploy on push                                     │
│ - Build: npm run build                                    │
│ - Output: dist/                                           │
│ - Env vars securely stored                                │
└─────────────────────────────────────────────────────────┘
      │
      │ website live
      ▼
https://purchase-management.vercel.app
```

## 3. Chuẩn bị trước khi deploy

### 3.1. Đưa code lên GitHub

Nếu chưa có repository GitHub:

```bash
# 1. Khởi tạo git (nếu chưa có)
cd purchase-management
git init

# 2. Thêm remote
git remote add origin https://github.com/<username>/purchase-management.git

# 3. Commit tất cả file
git add .
git commit -m "Initial commit"

# 4. Push lên GitHub
git branch -M main
git push -u origin main
```

### 3.2. Kết nối Vercel với GitHub

```text
1. Truy cập https://vercel.com
2. Đăng nhập / Tạo tài khoản
3. Click "Add New..." → "Project"
4. Import GitHub repository "purchase-management"
5. Cấu hình Project:
   - Framework Preset: Vite
   - Root Directory: purchase-management
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install
6. Click "Deploy"
```

### 3.3. Cấu hình Environment Variables (từ từ thêm sau)

Hiện tại chưa cần biến môi trường vì chưa kết nối Supabase.

Khi cần, thêm trong Vercel Dashboard:

```text
Settings → Environment Variables
```

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### 3.4. Tạo vercel.json (nếu cần)

Tạo file `purchase-management/vercel.json` nếu muốn cấu hình thêm:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

Thực tế Vercel tự detect Vite, nên file này có thể không cần thiết.

## 4. Cập nhật .env.example

File `.env.example` phải liệt kê tất cả biến môi trường mà dự án sẽ dùng:

```env
# Supabase (dùng cho version sau)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Cloudflare Images (dùng cho version sau)
VITE_CLOUDFLARE_ACCOUNT_ID=your-account-id
VITE_CLOUDFLARE_IMAGES_DELIVERY_URL=https://imagedelivery.net/...
```

Đảm bảo:

- `.gitignore` có `.env`
- Không bao giờ commit `.env` thật

## 5. Workflow Deploy

### 5.1. Preview Workflow (LUÔN LUÔN)

```text
1. git checkout -b feature/ten-tinh-nang
2. Sửa code trong branch
3. Chạy npm run build (verify local)
4. git add . && git commit -m "feat: mô tả tính năng"
5. git push origin feature/ten-tinh-nang
6. Vercel tự tạo Preview Deployment
7. Kiểm tra preview URL: https://purchase-management-git-feature-ten-tinh-nang.vercel.app
8. Kiểm tra kỹ chức năng trên preview
9. Tạo Pull Request vào main
```

### 5.2. Production Release Workflow (CHỈ KHI MỌI TÍNH NĂNG ĐÃ SẴN SÀNG)

Production deploy KHÔNG phải là bước thường ngày. Chỉ thực hiện khi:

- Tất cả tính năng đang phát triển đã hoàn tất
- Đã test kỹ trên preview
- Đã qua rà soát yêu cầu (requirements checklist)
- Team đồng ý release

```text
1. Chạy Production Release Checklist (xem bên dưới)
2. Merge Pull Request vào main
3. Vercel deploy Production
4. Kiểm tra website production
5. Thông báo cho team
```

### 5.3. Production Release Checklist

Trước khi merge PR vào `main` (deploy production):

- [ ] Tất cả tính năng đang phát triển đã hoàn tất
- [ ] Đã test tất cả chức năng trên preview URL
- [ ] Đã qua requirements checklist trong `.specify/specs/*/checklists/requirements.md`
- [ ] Không có lỗi console trên trình duyệt
- [ ] Build local thành công: `npm run build`
- [ ] Team đã review code và đồng ý release
- [ ] Đã backup code ở đâu đó

### 5.2. Quy trình sửa lỗi

```text
1. git checkout -b fix/moi-loi
2. Sửa lỗi
3. npm run build (verify)
4. git commit -m "fix: mô tả lỗi"
5. Push + tạo PR
6. Kiểm tra preview
7. Merge → Production deploy
```

### 5.3. Quy tắc quan trọng

- **Không bao giờ push trực tiếp vào `main`** — luôn qua PR để có preview.
- **Luôn chạy `npm run build` trước khi commit** — đảm bảo build xanh.
- **Branch preview tự xoá** sau khi merge PR (Vercel tự làm).

## 6. Kiến trúc Supabase (chuẩn bị, chưa code)

### 6.1. Supabase Project

1. Truy cập https://supabase.com
2. Tạo project mới
3. Copy các thông tin:

```text
Project URL: https://xxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (chỉ dùng backend, không đưa vào frontend)
```

### 6.2. Cấu trúc thư mục chuẩn bị

```text
src/
├── shared/
│   └── services/
│       └── supabaseClient.ts   ← client Supabase (chuẩn bị trước)
│
src/features/
├── purchase/
│   ├── services/
│   │   ├── excel.ts
│   │   ├── status.ts
│   │   └── purchaseRepository.ts  ← sau này kết nối Supabase
│   └── ...
```

### 6.3. Supabase Client Template

File `src/shared/services/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Nhưng lưu ý: hiện tại chưa cần tạo file này vì chưa dùng Supabase.
Chỉ tạo khi bắt đầu version v1.2.0-003-supabase-order-database.

## 7. Kiến trúc Cloudflare Images (tính năng sau)

### 7.1. Cloudflare Options

| Service           | Phù hợp cho                    | Lưu ý                              |
|-------------------|--------------------------------|-------------------------------------|
| Cloudflare Images | Lưu ảnh đơn giản, ít dung lượng | Có plan miễn phí                   |
| Cloudflare R2     | Lưu file lớn, video            | Miễn phí 10GB/month               |

### 7.2. Luồng Upload (sau này)

```text
User chọn ảnh trong web/app
        ↓
Frontend gọi API route (Vercel Serverless)
        ↓
API dùng Cloudflare API Token (secret)
        ↓
Upload ảnh lên Cloudflare Images/R2
        ↓
Cloudflare trả về image URL
        ↓
Lưu URL vào Supabase
        ↓
Frontend hiển thị ảnh từ Cloudflare CDN
```

### 7.3. Security

- **Không đưa Cloudflare API Token vào frontend**
- **Dùng Vercel API Routes / Serverless Functions** để upload
- **Chỉ dùng biến môi trường server-side** cho secret keys

## 8. Rollback Plan

Nếu deploy lỗi:

```text
1. Truy cập Vercel Dashboard → Deployments
2. Tìm deployment gần nhất đang chạy tốt
3. Click "..." → "Promote to Production"
4. Website quay về version trước
```

Nếu build lỗi trên Vercel:

```text
1. Kiểm tra log build trên Vercel
2. Sửa lỗi local: npm run build
3. Commit + push lại
4. Vercel tự build lại
```

## 9. Risks

| Risk | Mitigation |
|------|------------|
| Build lỗi trên Vercel do env thiếu | Thêm env vars trong Vercel Dashboard |
| Preview deploy chậm | Chờ 1-2 phút, Vercel cache có thể gây delay |
| Supabase quota hết | Monitor usage trong Supabase Dashboard |
| Git branch conflict | Dùng PR workflow, không push thẳng vào main |

## 10. Definition of Done

- [ ] Website online tại `*.vercel.app`
- [ ] Push lên `main` → production tự deploy trong < 3 phút
- [ ] Push lên branch → preview tự deploy
- [ ] Không có secret key trong source code
- [ ] `.env.example` có đầy đủ các biến môi trường sẽ dùng
- [ ] Developer hiểu quy trình deploy qua Git workflow
