# Purchase Filter Improvements — Requirements Checklist

## Pre-implementation Review

- [x] Yêu cầu nghiệp vụ đã được mô tả rõ ràng trong spec.md
- [x] Đã xác định các file cần tạo/sửa
- [x] Đã kiểm tra không trùng lặp với feature hiện có
- [x] Đã xác định các ràng buộc kỹ thuật (Tech stack: Vite, React, Tailwind)

## Functional Requirements

- [x] FR-001: Người dùng có thể lọc theo cột T.trg xử lý (single-select)
- [x] FR-002: Người dùng có thể lọc theo khoảng ngày từ cột Ngày YC
- [x] FR-003: Người dùng có thể xóa toàn bộ bộ lọc bằng một click
- [x] FR-004: Các bộ lọc có thể kết hợp với nhau
- [x] FR-005: Bộ lọc hoạt động đồng thời với tab filtering

## Non-functional Requirements

- [x] NFR-001: Giao diện responsive trên mobile (touch target ≥ 36px)
- [x] NFR-002: Thao tác nhập liệu bộ lọc dễ dàng (sử dụng input native type="date")
- [x] NFR-003: Build thành công với TypeScript strict mode
- [x] NFR-004: Không ảnh hưởng đến tính năng hiện có (tab navigation, file import)

## UI/UX Review

- [x] Đã kiểm tra màu sắc, typography, spacing theo design system
- [x] Dropdown filter có placeholder rõ ràng
- [x] Nút "Xóa lọc" có màu đỏ để dễ nhận biết
- [x] Không có lỗi overflow trên màn hình nhỏ

## Code Quality

- [x] Props có type rõ ràng
- [x] Không có any type không kiểm soát
- [x] Logic lọc được tách riêng trong useMemo
- [x] Component không có side effect không cần thiết
