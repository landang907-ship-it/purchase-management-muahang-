# Purchase Filter Improvements — Specification

## 1. Overview
Cải thiện thanh bộ lọc trên trang PurchasePage bằng cách thêm bộ lọc theo trạng thái xử lý, khoảng ngày yêu cầu, và nút xóa toàn bộ bộ lọc. Nhằm giúp người dùng thu hẹp kết quả hiển thị nhanh hơn và dễ thao tác hơn.

## 2. User Stories

### 2.1 Lọc theo trạng thái xử lý
- **Actor**: Nhân viên mua hàng / duyệt đơn
- **Trigger**: Click vào dropdown "T.trg xử lý"
- **Mô tả**: Chọn một trạng thái từ danh sách các giá trị có trong cột `T.trg xử lý` của dữ liệu
- **Kết quả**: Bảng chỉ hiển thị các dòng có trạng thái tương ứng

### 2.2 Lọc theo khoảng ngày yêu cầu
- **Actor**: Nhân viên mua hàng / duyệt đơn
- **Trigger**: Nhập ngày bắt đầu và ngày kết thúc
- **Mô tả**: Chọn khoảng ngày từ cột `Ngày YC`
- **Kết quả**: Bảng chỉ hiển thị các dòng có ngày yêu cầu nằm trong khoảng đã chọn

### 2.3 Xóa toàn bộ bộ lọc
- **Actor**: Nhân viên mua hàng / duyệt đơn
- **Trigger**: Click nút "Xóa lọc"
- **Mô tả**: Reset tất cả bộ lọc (Ng.yêu cầu, T.trg xử lý, Ngày YC) về trạng thái ban đầu
- **Kết quả**: Bảng hiển thị lại toàn bộ dữ liệu đã được lọc theo tab hiện tại

## 3. Acceptance Criteria

- [ ] Dropdown "T.trg xử lý" hiển thị danh sách các giá trị unique từ cột đó
- [ ] Chọn một trạng thái sẽ lọc bảng ngay lập tức
- [ ] Input ngày cho phép chọn ngày bắt đầu và ngày kết thúc
- [ ] Bộ lọc ngày lọc đúng theo giá trị cột `Ngày YC`
- [ ] Nút "Xóa lọc" chỉ hiển thị khi có ít nhất một bộ lọc đang hoạt động
- [ ] Click "Xóa lọc" reset toàn bộ bộ lọc về trạng thái rỗng
- [ ] Các bộ lọc có thể kết hợp với nhau (lọc đồng thời theo nhiều tiêu chí)
- [ ] Bộ lọc hoạt động độc lập với các tab (system, intime, overdue, factory)

## 4. Out of Scope
- Lọc theo nhiều trạng thái cùng lúc (multi-select cho T.trg xử lý)
- Xuất Excel từ kết quả lọc
- Lưu bộ lọc vào localStorage hoặc URL

## 5. UI/UX Constraints
- Thanh bộ lọc phải responsive, không che nội dung chính
- Touch target trên mobile ≥ 36px
- Bộ lọc ngày sử dụng input type="date" native để tương thích di động tốt nhất
- Nút "Xóa lọc" có màu đỏ để dễ nhận biết
