# 🚀 PROJECT_STACK.md – Bộ Skill Bắt Buộc Cho Mọi Dự Án Web

> **File rule chính thức** quy định stack công nghệ **PHẢI DÙNG** cho mọi dự án web trong workspace này.
> Đây là **Single Source of Truth** – mọi dự án mới đều phải tuân thủ.
> Cập nhật lần cuối: **2026-06-11**

---

## ⚠️ NGUYÊN TẮC VÀNG

> 🔒 **"SAU NÀY CHỈ DÙNG BỘ SKILL NÀY ĐỂ LÀM DỰ ÁN"**
>
> Mọi công nghệ, framework, thư viện sử dụng trong dự án web **PHẢI** nằm trong file `SKILLS.md`.
> Các công nghệ **NGOÀI** danh sách → **KHÔNG ĐƯỢỢC PHÉP** sử dụng.

📖 **Xem chi tiết từng skill trong file [`SKILLS.md`](./SKILLS.md)** (cùng thư mục Desktop).

---

## ✅ 1. STACK BẮT BUỘC (CORE)

### 🎯 Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **React** | `^19.0.0` | UI Framework |
| **Vite** | `^6.2.0` | Build tool + Dev server |
| **TypeScript** | `~5.8.2` | Ngôn ngữ chính |
| **Tailwind CSS** | `^4.1.14` | CSS framework (dùng `@tailwindcss/vite`) |
| **Motion** | `^12.23.24` | Animation |
| **Recharts** | `^3.8.1` | Biểu đồ |
| **Lucide React** | `^0.546.0` | Icons |
| **clsx + tailwind-merge** | mới nhất | Helper className |

### 🛠️ DevOps
| Công nghệ | Mục đích |
|-----------|----------|
| **Jenkins** | CI/CD (Declarative Pipeline 4 stages) |
| **GitHub Actions** | CI workflow |
| **Docker** | Multi-stage: `node:20-alpine` → `nginx:alpine` |
| **Nginx** | SPA fallback + security headers |
| **ghcr.io / Docker Hub** | Container registry |

### 🧪 Testing & QA
| Công nghệ | Mục đích |
|-----------|----------|
| **Vitest** | Unit test |
| **@testing-library/react** | Component test |
| **@vitest/coverage-v8** | Coverage |
| **Playwright / Puppeteer** | E2E test |
| **ESLint + Prettier** | Lint + format |
| **TypeScript Compiler** | Type check |

### 🔒 Security
- **`.env` + `.env.example`** – Quản lý secrets (KHÔNG hardcode)
- **`VITE_` prefix** – Biến môi trường client an toàn
- **HTTP Security Headers** – X-Frame-Options, CSP, HSTS, etc.
- **Request ID** – Tracking qua `X-Request-Id`
- **Timeout với AbortController** – 15s mặc định
- **HTTP Error Handling** – 400/401/404/500

### 🗄️ Backend (nếu cần)
- **Node.js 20** + **Express 4.21**
- **Google Gemini AI** (`@google/genai`)
- **Supabase** (Postgres + Auth + Storage)

---

## ❌ 2. STACK BỊ CẤM (DO NOT USE)

> Các công nghệ này **KHÔNG ĐƯỢỢC** sử dụng trong dự án web, kể cả khi có sẵn trong workspace.

### 🏭 Industrial Automation
- ❌ Delta DVP / DOPSoft
- ❌ Mitsubishi GX Works 2
- ❌ Modbus RTU/TCP
- ❌ RS485 / RS232 serial protocol
- ❌ Ladder Logic, Structured Text
- ❌ `.dvp`, `.dpa`, `.gps` project files

### 🔌 IoT / Embedded
- ❌ ESP32 / ESP32-S3 firmware code
- ❌ PlatformIO
- ❌ Arduino `.ino` files
- ❌ FreeRTOS
- ❌ SPI / I2C / UART hardware
- ❌ OTA update cho embedded
- ❌ OLED display driver

### 🤖 Robotics
- ❌ Loona Robot SDK
- ❌ Robot face rendering
- ❌ OpenCV (chỉ dùng cho web: nếu cần xử lý ảnh → dùng thư viện web như `sharp` hoặc backend API)
- ❌ Frame extraction scripts

### 🐍 Standalone Python (chỉ dùng trong project Python riêng)
- ❌ Python scripts cho serial communication
- ❌ Python scripts cho PLC
- ❌ Excel/PDF processing scripts
- ❌ `convert_frames.py`, `excel_to_md.py` (trừ khi chuyển sang Node.js/TypeScript)

### 🗄️ Database khác (không có trong SKILLS.md)
- ❌ MySQL, MongoDB, SQLite, Oracle, SQL Server
- ❌ Firebase, Firestore
- ❌ Neo4j, InfluxDB, Cassandra
- ❌ Custom database drivers

### 🎨 UI Framework khác
- ❌ Vue.js, Angular, Svelte, Solid.js
- ❌ Next.js, Nuxt.js, SvelteKit, Remix (trừ khi user yêu cầu cụ thể)
- ❌ Material-UI, Ant Design, Chakra UI (dùng Tailwind + custom components)
- ❌ Bootstrap, Bulma

### 📦 Build tool khác
- ❌ Webpack, Parcel, Rollup (dùng Vite)
- ❌ Create React App (đã deprecated)

### 🧪 Test framework khác
- ❌ Jest (dùng Vitest)
- ❌ Mocha, Chai, Jasmine
- ❌ Cypress (dùng Playwright)

### 🗂️ State management khác
- ❌ Redux cũ, MobX, Recoil (dùng React Context + useReducer / Zustand)

### 📊 Chart library khác
- ❌ Chart.js, D3.js, Plotly, Highcharts (dùng Recharts)

### 🎬 Animation khác
- ❌ GSAP, Anime.js, Lottie (dùng Motion/Framer Motion)

### 🌐 HTTP Client khác
- ❌ Axios (dùng Fetch API wrapper)

---

## 📋 3. QUY TRÌNH KHỞI TẠO DỰ ÁN MỚI

> Mỗi dự án web mới **BẮT BUỘC** làm theo các bước sau:

```bash
# Bước 1: Khởi tạo project
quick_web_boilerplate.bat <ten_du_an>
cd "New folder"   # hoặc tên folder dự án

# Bước 2: Cài thêm dev dependencies theo SKILLS.md
npm install -D vitest @vitest/coverage-v8 @testing-library/react \
  @testing-library/jest-dom jsdom eslint prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh

# Bước 3: Copy file cấu hình chuẩn từ SKILLS.md
# - vitest.config.ts
# - .eslintrc.cjs
# - .prettierrc
# - .editorconfig
# - .env.example
# - src/vite-env.d.ts
# - src/lib/api.ts
# - src/lib/logger.ts

# Bước 4: Setup CI/CD
# - Jenkinsfile (copy từ template)
# - .github/workflows/ci.yml
# - Dockerfile (multi-stage)
# - nginx.conf

# Bước 5: Viết code theo WEB_RULES.md
# - Component < 300 dòng
# - Mobile-first
# - try/catch + HTTP error code
# - Secret trong .env

# Bước 6: Test + Build
npm run lint:check
npm run test:run
npm run build
docker build -t my-app:1.0 .
```

---

## 🎯 4. CHECKLIST TRƯỚC KHI BÀN GIAO

> Mỗi dự án web **PHẢI** pass hết các tiêu chí dưới:

### Code Quality
- [ ] Tất cả file TypeScript **không có lỗi** khi chạy `tsc --noEmit`
- [ ] ESLint pass với `--max-warnings=0`
- [ ] Prettier format nhất quán
- [ ] Tất cả component React < 300 dòng
- [ ] Không có code chết (unused imports/variables)
- [ ] Props được typing đầy đủ

### Testing
- [ ] Unit test coverage ≥ 70%
- [ ] Tất cả HTTP error path (400/401/404/500) có test
- [ ] Component test cho UI phức tạp
- [ ] E2E test cho flow chính (login, form submit, etc.)

### Security
- [ ] Không có secret nào hardcode trong source
- [ ] File `.env` đã thêm vào `.gitignore`
- [ ] File `.env.example` có đầy đủ template
- [ ] HTTP security headers đầy đủ trong nginx.conf
- [ ] CSP meta tag trong `index.html`

### DevOps
- [ ] `Jenkinsfile` chạy được 4 stages
- [ ] `Dockerfile` build thành công (multi-stage, image < 100MB)
- [ ] `nginx.conf` có SPA fallback + gzip
- [ ] GitHub Actions CI pass
- [ ] Healthcheck endpoint `/healthz` hoạt động

### Performance
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lazy loading cho route lớn
- [ ] Image optimization (WebP, lazy load)
- [ ] Caching strategy cho static assets

### Documentation
- [ ] `README.md` có hướng dẫn cài đặt + chạy + deploy
- [ ] `CHANGELOG.md` được cập nhật
- [ ] JSDoc/TSDoc cho function public
- [ ] OG tags + meta description trong `index.html`

---

## 🔄 5. KHI NÀO CẬP NHẬT STACK

Điều kiện để thêm công nghệ mới vào `SKILLS.md`:
1. ✅ Đã dùng thành công trong ít nhất **2 dự án thực tế**
2. ✅ Có cộng đồng lớn, được maintain tích cực
3. ✅ Tương thích tốt với React 19 + Vite 6 + TypeScript
4. ✅ Không xung đột với skill hiện có
5. ✅ Có tài liệu tiếng Việt/Anh rõ ràng

Quy trình cập nhật:
1. Thêm công nghệ mới vào `SKILLS.md` (mục phù hợp)
2. Cập nhật `package.json` với phiên bản chính thức
3. Test trong 1 dự án pilot
4. Nếu ổn định → mặc định dùng cho dự án tiếp theo

---

## 📌 6. TÓM TẮT

```
STACK WEB CHÍNH THỨC:
├─ Frontend  : React 19 + Vite 6 + TypeScript + Tailwind v4
├─ Backend   : Node.js 20 + Express 4.21 (nếu cần)
├─ AI        : Google Gemini (@google/genai)
├─ DevOps    : Jenkins + GitHub Actions + Docker + Nginx
├─ Testing   : Vitest + Testing Library + Playwright
├─ Security  : .env + VITE_ prefix + HTTP headers + CSP
├─ State     : React Context + useReducer (mặc định)
├─ HTTP      : Fetch API wrapper (custom)
├─ Chart     : Recharts
├─ Icons     : Lucide React
└─ Animation : Motion (Framer Motion)
```

> 💡 **Tip:** In file này ra dán cạnh màn hình hoặc bookmark nhanh trong IDE. Mỗi khi bắt đầu dự án mới, đọc lại file này trước!

---

*File này có hiệu lực từ ngày 2026-06-11. Mọi dự án web sau ngày này đều phải tuân thủ.*
