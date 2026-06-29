# SPEC: 001 — Purchase Management

## 1. Overview
Ứng dụng web hỗ trợ nhân viên kiểm tra đơn mua hàng nội bộ. Người dùng có thể
nhập dữ liệu từ file Excel/SAP, tìm kiếm, lọc theo người yêu cầu/trạng thái/ngày,
và xem thông tin đơn hàng một cách nhanh chóng. Hệ thống phân quyền theo SAP
role để nhân viên chỉ xem dữ liệu phù hợp với vai trò của mình, đồng thời hỗ trợ
truy cập trên điện thoại qua mạng LAN.

## 2. User Stories
- **As a** Purchaser (ZPR_PUR_PUR), **I want** upload an Excel file and see
  all purchase requests in a filterable table **so that** I can quickly find
  and manage orders.
- **As a** Requester (ZPR_PUR_REQ), **I want** to only see my own requests
  **so that** I can track my submissions without seeing others' data.
- **As a** Approver (ZPR_PUR_APP), **I want** to filter by multiple requesters
  simultaneously **so that** I can batch-review requests.
- **As a** Mobile user, **I want** to open the app via LAN IP on my phone
  **so that** I can check order status while away from my desk.

## 3. Acceptance Criteria
- [ ] File Excel với header tiếng Việt (có dấu) được parse đúng — test với
  file thật từ SAP.
- [ ] Bảng dữ liệu hiển thị tất cả columns: STT, Đơn hàng, Ngày đặt, Mã nhà
  cung cấp, Tên nhà cung cấp, Người yêu cầu, Ngày yêu cầu, Đơn giá, Số lượng,
  Thành tiền, Đơn hàng, Đã tạo.
- [ ] Filter multi-select "Người yêu cầu" với search + select all/clear all.
- [ ] Responsive: mobile (< 640px) hiển thị 1-2 columns, tablet 3-4, desktop all.
- [ ] Preview server chạy trên 0.0.0.0:4173, mở được từ điện thoại.
- [ ] Build `npm run build` không lỗi TypeScript.

## 4. Out of Scope
- Tạo/sửa/xoá đơn mua hàng (CRUD).
- Export dữ liệu ra Excel/PDF.
- Xác thực thật với SAP backend.
- Dark mode / theming.
- Real-time collaboration.

## 5. Technical Notes
- Excel parse: normalize Vietnamese diacritics (NFD → strip, đ→d) trước map header.
- Multi-select filter: AnimatePresence + framer-motion, checkboxes với search input.
- Role check: localStorage key `sap_role`, compare với whitelist trong
  `authConfig.ts`. Production: thay bằng SSO/OAuth.

## 6. Related Specs
- (none yet — first spec)
