# Changelog — Purchase Management

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] — 2026-06-27

### Added
- Thêm hỗ trợ **đa ngôn ngữ** (i18n) cho trang quản lý mua hàng: tiếng Việt (VI) và tiếng Trung (ZH).
- Khi user chọn ngôn ngữ **ZH** lúc đăng nhập, toàn bộ giao diện sẽ hiển thị tiếng Trung.
- Thêm tính năng **Tìm nhanh** – tìm kiếm trong cột "Văn bản ngắn".
- Bỏ ngôn ngữ EN khỏi LOGON LANGUAGE (chỉ còn VI và ZH).

### Files Changed
- `src/i18n/index.ts` (new)
- `src/i18n/useTranslation.ts` (new)
- `src/features/purchase/ui/QuickSearch.tsx` (new)
- `src/features/purchase/ui/Header.tsx` (modified)
- `src/features/purchase/ui/TabNav.tsx` (modified)
- `src/features/purchase/ui/StatusFilter.tsx` (modified)
- `src/features/purchase/ui/RequesterFilter.tsx` (modified)
- `src/features/purchase/ui/DateRangeFilter.tsx` (modified)
- `src/features/purchase/ui/EmptyState.tsx` (modified)
- `src/features/purchase/ui/NoResults.tsx` (modified)
- `src/features/purchase/ui/PurchasePage.tsx` (modified)
- `src/features/auth/ui/LoginPage.tsx` (modified)

---

## [1.1.1] — 2026-06-25

### Added
- Thêm bộ lọc **T.trg xử lý** (StatusFilter) — dropdown single-select để lọc theo trạng thái xử lý.
- Thêm bộ lọc **Ngày YC** (DateRangeFilter) — input date inline để lọc khoảng ngày yêu cầu.
- Thêm nút **"Xóa lọc"** — reset tất cả bộ lọc cùng lúc, chỉ hiển thị khi có bộ lọc đang hoạt động.
- Cải thiện **DateRangeFilter** từ dạng dropdown sang input ngày native để dễ thao tác hơn trên mobile.

### Changed
- Nâng cấp thanh bộ lọc từ 1 bộ lọc (Ng.yêu cầu) lên 3 bộ lọc kết hợp được với nhau.

### Files Changed
- `src/features/purchase/ui/StatusFilter.tsx` (new)
- `src/features/purchase/ui/DateRangeFilter.tsx` (new)
- `src/features/purchase/ui/PurchasePage.tsx` (modified)

---

## [1.1.0] — 2026-06-20

### Added
- Triển khai deployment Vercel + Supabase theo spec `v1.1.0-002-vercel-supabase-deployment`.
- Cấu hình CI/CD với GitHub Actions.
- Thêm environment variables cho Vercel.

### Changed
- Cập nhật cấu hình build cho production.

---

## [1.0.0] — 2026-06-15

### Added
- Trang đăng nhập với xác thực SAP (mock).
- Trang quản lý mua hàng (PurchasePage) với import Excel.
- Tabs navigation: System, In-time, Overdue, Factory.
- Bộ lọc **Ng.yêu cầu** (multi-select dropdown).
- DataTable hiển thị dữ liệu với scroll ngang.
- Toast notifications cho các thao tác.
- Responsive layout cho mobile.
