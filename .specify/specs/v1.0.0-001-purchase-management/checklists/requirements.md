# REQUIREMENTS CHECKLIST: 001 — Purchase Management

## Functional Requirements
- [ ] Excel file upload works (drag & drop or click)
- [ ] Vietnamese header parsing correct (Đã tạo, Ng.yêu cầu, v.v.)
- [ ] All columns display: STT, Đơn hàng, Ngày đặt, Mã NCC, Tên NCC,
  Người yêu cầu, Ngày yêu cầu, Đơn giá, Số lượng, Thành tiền, Đơn hàng, Đã tạo
- [ ] Filter multi-select "Người yêu cầu" works
- [ ] Search within filter works
- [ ] Select all / Clear all works
- [ ] Filter results update table immediately
- [ ] Role-based access: ZPR_PUR_PUR sees all, ZPR_PUR_REQ sees own only
- [ ] Role selection on login page works

## Non-Functional Requirements
- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors on load
- [ ] Responsive: works on mobile (< 640px)
- [ ] Touch targets ≥ 36px on mobile
- [ ] Preview server on 0.0.0.0:4173
- [ ] Accessible from LAN via IP address
- [ ] Loading overlay shows during Excel parsing
- [ ] Empty state shown when no data
- [ ] No results state shown when filter returns empty

## Security Requirements
- [ ] No hardcoded credentials in source
- [ ] .env not committed (only .env.example)
- [ ] Role check is client-side only (documented limitation)

## Performance Requirements
- [ ] Page loads < 3s on desktop
- [ ] Excel parse < 5s for 1000 rows
- [ ] Filter updates < 100ms (client-side)
