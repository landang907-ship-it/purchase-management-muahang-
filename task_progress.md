# Task Progress – Merge 2 projects thành 1

## Kiến trúc mới (1 Vite project duy nhất)
- `purchase-management/` là gốc
- `src/components/login/` – SiteHeader, SapButton, FormField, SiteFooter
- `src/components/purchase/` – Header, TabNav, StatusBar, DataTable, EmptyState, LoadingOverlay, NoResults
- `src/components/shared/Toast.tsx` – unified (default | info | success | warning | error)
- `src/hooks/useAuth.ts` – localStorage-based auth
- `src/App.tsx` – conditional render Login | Purchase

## Steps
- [x] Tạo folder structure (hooks, components/login, components/purchase, components/shared)
- [ ] Di chuyển purchase components → components/purchase/
- [ ] Copy SAP components → components/login/
- [ ] Tạo hooks/useAuth.ts
- [ ] Tạo components/shared/Toast.tsx (unified)
- [ ] Tạo components/login/LoginPage.tsx
- [ ] Tạo components/purchase/PurchasePage.tsx
- [ ] Refactor App.tsx với conditional render
- [ ] Thêm nút logout vào Header.tsx
- [ ] Merge index.css (purchase + SAP tokens)
- [ ] Merge index.html (purchase + SAP meta)
- [ ] Merge vite.config.ts (chunks + port 5173)
- [ ] Xóa sap-login-website/
- [ ] Xóa legacy css/ js/
- [ ] Run npm install + build + dev verify
