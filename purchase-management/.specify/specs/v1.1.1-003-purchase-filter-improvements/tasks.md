# Purchase Filter Improvements — Task Checklist

## Implementation

- [x] Tạo StatusFilter.tsx — dropdown lọc T.trg xử lý
- [x] Tạo DateRangeFilter.tsx — input ngày inline (thay vì dropdown)
- [x] Thêm state selectedStatus, dateFrom, dateTo trong PurchasePage.tsx
- [x] Thêm statusOptions useMemo trong PurchasePage.tsx
- [x] Cập nhật visibleRows filter logic cho selectedStatus
- [x] Cập nhật visibleRows filter logic cho dateFrom/dateTo
- [x] Thêm hasAnyFilter computed value
- [x] Thêm clearAllFilters function
- [x] Render StatusFilter trong filter bar UI
- [x] Render DateRangeFilter trong filter bar UI
- [x] Render nút "Xóa lọc" khi hasAnyFilter === true

## Testing

- [ ] Test lọc theo một trạng thái cụ thể
- [ ] Test lọc theo khoảng ngày
- [ ] Test kết hợp nhiều bộ lọc cùng lúc
- [ ] Test nút "Xóa lọc" reset về ban đầu
- [ ] Test trên mobile (iOS Safari, Android Chrome)
- [ ] Test build: `npm run build` thành công

## Documentation

- [x] Cập nhật constitution.md — thêm luật Documentation is Mandatory
- [x] Tạo spec.md cho tính năng
- [x] Tạo plan.md cho tính năng
- [x] Tạo tasks.md cho tính năng
- [ ] Cập nhật CHANGELOG.md

## Deployment

- [ ] Chạy `npm run build` kiểm tra
- [ ] Commit code với message rõ ràng
- [ ] Deploy lên môi trường test
- [ ] Verify trên thiết bị thật
