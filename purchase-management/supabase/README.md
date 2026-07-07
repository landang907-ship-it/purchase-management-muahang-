# 🗄️ Hướng dẫn Setup Supabase Database

## ⚠️ QUAN TRỌNG: Bảng `accounts` bị thiếu!

Khi kiểm tra database ngày 2026-07-04, phát hiện:
- ✅ Bảng `purchase_records`: 5 rows (~1.65 MB)
- ❌ Bảng `accounts`: **KHÔNG TỒN TẠI** → không thể đăng ký/đăng nhập user mới

## 📋 Cách tạo lại bảng `accounts`

### Cách 1: Qua Supabase Dashboard (Khuyến nghị)

1. Mở https://supabase.com/dashboard
2. Chọn project `purchase-management` (URL: `abfrrzuxvbnvizlwpxea`)
3. Sidebar → **SQL Editor** (icon `</>`)
4. Click **"New query"**
5. Copy toàn bộ nội dung file `supabase/migrations/001_create_accounts_table.sql`
6. Paste vào editor → Click **"Run"** (hoặc `Ctrl+Enter`)
7. Kết quả: Bảng `accounts` được tạo với 1 row (admin123)

### Cách 2: Qua psql (cần cài PostgreSQL client)

```bash
psql "postgresql://postgres:Pro1371997@22222@db.abfrrzuxvbnvizlwpxea.supabase.co:5432/postgres" -f supabase/migrations/001_create_accounts_table.sql
```

### Cách 3: Qua Node.js script (nếu DNS không bị chặn)

```bash
npm install pg
node scripts/migrate.mjs
```

## 🔐 Default admin account

- **Username**: `admin123`
- **Password**: `130719197`
- **Language**: `VI`
- **Hash SHA-256**: `d6dd3f3f61dfc39de4531b205e6e790c5f674cb01a2e49caf30dfdd7547bab21`

> ℹ️ admin123 login bypass database qua hardcoded config trong `src/features/auth/services/authConfig.ts`. Bảng `accounts` chỉ cần cho user đăng ký mới qua Register form.

## 📊 Schema

### `accounts`
```sql
id         UUID         PRIMARY KEY DEFAULT gen_random_uuid()
user       TEXT         NOT NULL UNIQUE
password   TEXT         NOT NULL              -- SHA-256 hash
language   TEXT         DEFAULT 'VI' CHECK (language IN ('VI','ZH'))
created_at TIMESTAMPTZ  DEFAULT now()
```

### `purchase_records` (đã có sẵn)
```sql
id          UUID          PRIMARY KEY
user_id     TEXT          -- FK concept to accounts.user
file_name   TEXT
imported_at TIMESTAMPTZ
total_rows  INTEGER
data        JSONB         -- Array of PurchaseRow
```

## ✅ Sau khi chạy migration

Test thử bằng cách:
1. Vào app → Tab đăng ký
2. Đăng ký user mới (vd: `testuser` / `test123`)
3. Sau đó đăng nhập lại với user vừa tạo
4. Vào Supabase Dashboard → Table Editor → `accounts` sẽ thấy row mới

## 🛠️ Scripts hỗ trợ

- `check-db-size.mjs` — Kiểm tra dung lượng database (dùng REST API)
- `check-pooler.mjs`, `test-conn.mjs` — Test kết nối DB (cần DNS resolves)