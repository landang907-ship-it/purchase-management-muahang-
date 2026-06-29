# 📦 Quản Lý Mua Hàng – Xưởng Bánh Gạo

> Ứng dụng web React 19 + Vite 6 + TypeScript + Tailwind v4 để đọc file Excel SAP, lọc các dòng có `TAG-NAME = VN005922` và hiển thị trên giao diện mobile-first (iPhone X → iPhone 17 Pro Max).

---

## ✨ Tính năng

- 📥 **Import file Excel** (`.xlsx`, `.xls`, `.csv`) từ nút **NHẬP FILE** hoặc kéo thả vào trang.
- 🏷️ **Lọc tự động** các dòng có `TAG-NAME = VN005922` (Xưởng Bánh Gạo – Want Want VN).
- 📊 **4 tab** dữ liệu: `Hệ thống` / `Đúng hạn` / `Quá hạn` / `Xưởng`.
- 🎨 **Status badge** màu sắc theo trạng thái (xanh / cam / đỏ / xanh dương / xám).
- 📱 **Mobile-first** với `safe-area-inset-*` cho iPhone notch.
- ✨ **Floating 3D buttons** theo quy tắc Antigravity (hover translate-y + scale + shadow).
- 🔄 **Drag & drop** file Excel trực tiếp lên trang.
- 🧪 **Unit test** với Vitest + Testing Library.

---

## 🛠️ Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Framework        | **React 19** `^19.0.0`              |
| Build tool       | **Vite 6** `^6.2.0`                 |
| Language         | **TypeScript 5.8**                  |
| Styling          | **Tailwind CSS v4** `^4.1.14`       |
| Animation        | **Motion 12** `^12.23.24`           |
| Icons            | **Lucide React** `^0.546.0`         |
| Excel parsing    | **SheetJS (xlsx)** `^0.18.5`        |
| Class utils      | `clsx` + `tailwind-merge`           |
| Testing          | Vitest + Testing Library + jsdom    |

---

## 🚀 Cài đặt & chạy

```bash
# 1. Cài dependencies
npm install

# 2. Chạy dev server (http://localhost:5173)
npm run dev

# 3. Build production
npm run build

# 4. Preview build
npm run preview

# 5. Test
npm run test:run

# 6. Lint + format
npm run lint
npm run format
```

---

## 📁 Cấu trúc thư mục

```
purchase-management/
├── src/
│   ├── components/        # React components (mỗi file < 300 dòng)
│   │   ├── Header.tsx
│   │   ├── TabNav.tsx
│   │   ├── StatusBar.tsx
│   │   ├── DataTable.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── NoResults.tsx
│   │   └── Toast.tsx
│   ├── lib/               # Business logic + helpers
│   │   ├── cn.ts          # clsx + tailwind-merge helper
│   │   ├── date.ts        # Excel date + overdue helpers
│   │   ├── excel.ts       # Excel parser (SheetJS)
│   │   └── status.ts      # Status → badge variant
│   ├── types/
│   │   └── purchase.ts    # Shared types
│   ├── test/
│   │   └── setup.ts       # Vitest setup
│   ├── App.tsx            # Root component
│   ├── main.tsx           # React entry
│   └── index.css          # Tailwind v4 @theme + base
├── index.html             # Vite entry HTML
├── vite.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile             # Multi-stage Node → nginx
├── nginx.conf
├── Jenkinsfile
└── README.md
```

---

## 🐳 Docker

```bash
docker build -t purchase-management .
docker run -p 8080:80 purchase-management
# Mở http://localhost:8080
```

---

## 📐 Quy tắc Antigravity (SKILLS.md §18)

- ✅ **Chỉ dùng Tailwind CSS** – không CSS module, không styled-components.
- ✅ **Mọi button/card PHẢI có floating 3D effect** (`hover:-translate-y-1 hover:scale-105` + shadow lớn).
- ✅ **Component < 300 dòng** code.
- ✅ **Zero-weight code** – không function/component thừa.
- ✅ **Mobile-first** với iPhone X (375×812) làm baseline.
- ✅ **Safe-area-inset-*** cho iOS notch.

---

## 📜 License

Internal use only – Want Want Việt Nam.
