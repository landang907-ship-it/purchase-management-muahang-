# Project Constitution — Purchase Management

## 1. Mission
Xây dựng ứng dụng web giúp nhân viên nội bộ kiểm tra đơn mua hàng một cách
nhanh chóng, rõ ràng và thuận tiện. Ứng dụng cho phép nhập dữ liệu đơn mua
hàng từ file Excel/SAP, tìm kiếm, lọc và xem trạng thái đơn theo vai trò người
dùng, đặc biệt hỗ trợ nhân viên theo dõi đơn của mình trên máy tính hoặc
điện thoại trong mạng LAN.

## 2. Core Principles
1. **Feature-first**: mỗi nghiệp vụ (auth, purchase, …) là một *feature* độc lập,
   chứa UI, hooks, services, model, types. Không để feature này lẫn vào feature khác.
2. **Shared là shared, không hơn**: `src/shared/` chỉ chứa thứ thật sự dùng chung
   (Toast, cn utility, ...). Mọi thứ nghi ngờ dùng chung → đặt vào feature trước.
3. **No magic**: cấu hình (alias, env, role) đều nằm trong `services/` của feature,
   có type rõ ràng. Không hardcode URL/role trong component.
4. **Vietnamese-first**: header Excel tiếng Việt có dấu phải được chuẩn hoá
   (NFD + remove diacritics + đ→d) trước khi mapping. Luôn test với file thật.
5. **Mobile-friendly**: layout responsive, touch target ≥ 36px, filter mở được
   bằng một tay trên điện thoại.
6. **Build phải xanh**: `npm run build` là nguồn sự thật. Nếu build đỏ → dừng,
   sửa, rồi mới tính tiếp.

## 3. Tech Stack (locked)
- Vite 6.4.x
- React 19 + TypeScript (strict)
- Tailwind CSS v4
- framer-motion (animation nhẹ)
- xlsx (SheetJS) cho Excel

## 4. Forbidden
- ❌ Đặt file trong `src/components/` (đã lỗi thời, dùng `src/features/*/ui/`).
- ❌ Import giữa hai feature mà không qua `shared/`.
- ❌ Commit `.env` thật — chỉ commit `.env.example`.
- ❌ Thêm dependency mới mà chưa cập nhật `package.json` + khóa version.

## 5. Roles (SAP)
| Role | Quyền |
|------|-------|
| `ZPR_PUR_PUR` | Mua hàng — toàn quyền xem/lọc Excel |
| `ZPR_PUR_REQ` | Yêu cầu — chỉ xem đơn của mình |
| `ZPR_PUR_APP` | Duyệt — xem + filter nâng cao |

## 7. Specification Versioning
- Mọi tính năng mới phải có thư mục riêng trong `.specify/specs/`.
- Tên thư mục phải theo format:
  `v<major>.<minor>.<patch>-<sequence>-<feature-slug>`.
- Ví dụ: `v1.1.0-002-export-report`.
- `spec.md` ghi yêu cầu nghiệp vụ.
- `plan.md` ghi kế hoạch kỹ thuật.
- `tasks.md` ghi danh sách việc cần làm.
- `checklists/requirements.md` dùng để rà soát yêu cầu trước khi triển khai.

## 8. Documentation is Mandatory
- Mọi cập nhật tính năng mới, thay đổi hành vi, thay đổi UI/UX hoặc thay đổi logic nghiệp vụ **đều phải được ghi lại** trong tài liệu dự án.
- **Không được** chỉ sửa code mà bỏ qua tài liệu.
- Mỗi tính năng/thay đổi phải tạo thư mục riêng trong `.specify/specs/` theo format:
  `v<major>.<minor>.<patch>-<sequence>-<feature-slug>`.
- Thư mục phải chứa đầy đủ:
  - `spec.md` — mô tả yêu cầu nghiệp vụ, Acceptance Criteria.
  - `plan.md` — mô tả hướng triển khai kỹ thuật, file liên quan.
  - `tasks.md` — checklist công việc đã làm/chưa làm.
  - `checklists/requirements.md` — rà soát yêu cầu trước triển khai.
- Nếu thay đổi ảnh hưởng người dùng cuối, **phải cập nhật** `CHANGELOG.md` hoặc tạo nếu chưa có.

## 9. Definition of Done
- [ ] Spec.md có đầy đủ mục *Acceptance Criteria* và *Out of Scope*.
- [ ] tasks.md liệt kê từng task với checkbox.
- [ ] Mọi tính năng/thay đổi mới đã được ghi vào đúng thư mục `.specify/specs/`.
- [ ] Nếu thay đổi ảnh hưởng người dùng cuối, đã cập nhật `CHANGELOG.md`.
- [ ] Build xanh, preview server chạy được trên LAN (0.0.0.0:4173).
- [ ] Mở được từ điện thoại qua IP LAN và thấy dữ liệu thật.
