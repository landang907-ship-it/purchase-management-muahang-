# 📓 SKILLS.md – Web Development

> Notepad tổng hợp **toàn bộ kỹ năng & công nghệ liên quan đến phát triển Web** của bạn.
> Cập nhật: **2026-06-11**

---

## 🌐 1. Frontend Web Development

### Core Stack
- **HTML5 / CSS3 / JavaScript (ES6+)** – Nền tảng web
- **TypeScript 5.8** – Ngôn ngữ chính
- **React 19** – UI Framework
- **Vite 6** – Build tool & Dev server
- **Tailwind CSS v4** – Utility-first CSS (Vite plugin `@tailwindcss/vite`)
- **PostCSS + Autoprefixer** – CSS processing
- **Motion (Framer Motion)** – Animation
- **Recharts 3.8** – Biểu đồ, visualization
- **Lucide React** – Bộ icon SVG
- **clsx + tailwind-merge** – Helper gộp className

### Patterns & Best Practices
- Component-Driven Architecture
- TypeScript Props typing
- File < 300 dòng
- Mobile-First Responsive (sm/md/lg/xl)
- SPA (Single Page Application)
- HMR (Hot Module Replacement)
- Custom Hooks pattern
- Render props / HOC

---

## 🛠️ 2. DevOps & CI/CD cho Web

### CI/CD Platforms
- **Jenkins** – Declarative Pipeline (4 stages: Checkout → Build → Test → Package)
- **GitHub Actions** – CI workflow với 3 jobs (test → build → docker)

### Container & Web Server
- **Docker** – Multi-stage build
  - Stage 1: `node:20-alpine` (builder)
  - Stage 2: `nginx:alpine` (runner)
- **Docker Compose** – Multi-container orchestration
- **Nginx** – Reverse proxy, SPA fallback, gzip, security headers, healthcheck
- **`.dockerignore`** – Tối ưu build context

### Build & Artifact
- **Docker Hub / GitHub Container Registry (ghcr.io)** – Image registry
- **Artifact upload** – Coverage report, dist folder
- **Build optimization** – Code splitting, tree-shaking, minification

---

## 🧪 3. Testing & Quality Assurance

### Testing
- **Vitest 2.1** – Unit test framework
- **jsdom** – DOM environment cho test
- **@testing-library/react 16** – React component testing
- **@testing-library/jest-dom** – Custom matchers
- **@vitest/coverage-v8** – Code coverage với V8 engine

### E2E & UI Testing
- **Puppeteer/Playwright** – Headless browser testing
- **Visual regression** – Screenshot comparison
- **Console error monitoring** – `check_ui_errors.js`

### Code Quality
- **ESLint 8.57** – Linter (React + TypeScript + Hooks)
- **Prettier 3.4** – Code formatter
- **EditorConfig** – Editor consistency
- **TypeScript Compiler (tsc --noEmit)** – Type checking
- **Husky + lint-staged** (potential) – Pre-commit hooks

---

## 🔒 4. Web Security

### Best Practices
- **Environment Variables** – Quản lý qua `.env`, `.env.example`
- **VITE_ prefix** – Biến public an toàn cho client
- **.gitignore** – Loại trừ `.env*`, `node_modules/`, `dist/`, `coverage/`
- **Secrets management** – Không hard-code API key

### HTTP Security Headers
- `X-Frame-Options: SAMEORIGIN` – Chống clickjacking
- `X-Content-Type-Options: nosniff` – Chống MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` – Privacy
- `X-XSS-Protection: 1; mode=block` – XSS protection
- `Content-Security-Policy` – CSP meta tag
- `Strict-Transport-Security` (HSTS) – HTTPS only

### Runtime Security
- **Request ID** – Tracking qua header `X-Request-Id`
- **HTTP Error Handling** – 400/401/404/500 với try/catch
- **Timeout với AbortController** – 15s mặc định
- **CORS** – Cross-origin policy
- **JWT / OAuth2** – Authentication
- **Input sanitization** – XSS prevention
- **Rate limiting** – DDoD protection

---

## 🗄️ 5. Backend & API cho Web

### Server
- **Node.js 20** – JavaScript runtime
- **Express 4.21** – Web framework
- **RESTful API** – GET/POST/PUT/PATCH/DELETE
- **Middleware pattern** – Auth, logging, CORS

### API Patterns
- **Fetch API wrapper** – Centralized HTTP client
- **Request/Response logging** – Có timestamp, request-id
- **Error propagation** – Custom `ApiError` interface
- **Retry logic** – Auto-retry với exponential backoff
- **Pagination** – Cursor-based / offset-based
- **API versioning** – `/api/v1/`, `/api/v2/`

### Database & BaaS
- **Google Gemini AI** (`@google/genai`) – Generative AI integration
- **Supabase** – Backend-as-a-Service (Postgres + Auth + Storage)
- **PostgreSQL** – SQL database
- **Redis** (potential) – Cache

---

## 🤖 6. AI Integration cho Web

- **Google Generative AI (Gemini)** – LLM API integration
- **Streaming responses** – Real-time AI output
- **Prompt engineering** – Effective AI interaction
- **MCP Servers** đã cấu hình:
  - `notebooks` – Jupyter notebook
  - `visualization` – Data viz tools
  - `github` – GitHub API
  - `supabase-postgres` – Database MCP
  - `brave-search` – Web search MCP

### 📄 MarkItDown (Microsoft) – File → Markdown cho LLM
- **Repo**: [microsoft/markitdown](https://github.com/microsoft/markitdown) – 150k+ ⭐, MIT License, Python
- **Mục đích**: Chuyển đổi nhiều định dạng file (PDF, Office, hình ảnh, audio…) sang **Markdown** để nạp vào LLM / RAG pipeline
- **Cài đặt**:
  ```bash
  pip install 'markitdown[all]'         # Full features
  pip install 'markitdown[pdf]'         # Chỉ PDF
  pip install 'markitdown[docx]'        # Chỉ Word
  pip install 'markitdown[pptx]'        # Chỉ PowerPoint
  pip install 'markitdown[xlsx]'        # Chỉ Excel
  pip install 'markitdown[audio-transcription]'  # Whisper
  ```
- **CLI**:
  ```bash
  markitdown path-to-file.pdf > document.md
  markitdown lecture.mp3 > notes.md
  ```
- **Python API**:
  ```python
  from markitdown import MarkItDown
  md = MarkItDown(enable_plugins=False)
  result = md.convert("test.xlsx")
  print(result.text_content)
  ```
- **Định dạng hỗ trợ**: PDF, PowerPoint (.pptx), Word (.docx), Excel (.xlsx/.xls), Hình ảnh (EXIF + OCR), Audio (EXIF + Whisper transcription), HTML, CSV, JSON, XML, ZIP, EPub, YouTube URLs, Outlook (.msg)
- **Optional extras**: `[pptx]`, `[docx]`, `[xlsx]`, `[xls]`, `[pdf]`, `[outlook]`, `[az-doc-intel]`, `[az-content-understanding]`, `[audio-transcription]`, `[youtube-transcription]`
- **Tích hợp Azure**: Hỗ trợ **Azure Document Intelligence** & **Azure Content Understanding** cho OCR nâng cao
- **Plugins**: Hệ thống plugin mở rộng (mặc định tắt vì bảo mật)
- **Docker**: Image chính thức `mcr.microsoft.com/markitdown` (chạy file untrusted an toàn)
- **Use case**: Tiền xử lý dữ liệu cho **RAG**, indexing knowledge base, nạp tài liệu vào LLM context
- ⚠️ **Bảo mật**: Cài `markitdown[all]` nâng cao khả năng tấn công → dùng Docker/sandbox cho file untrusted

---

## 📝 7. Documentation & SEO

### Documentation
- **Markdown** – README, CHANGELOG, documentation
- **Keep a Changelog** format
- **Semantic Versioning** (SemVer)
- **JSDoc / TSDoc** – Code documentation
- **Storybook** (potential) – Component documentation

### SEO & Meta
- **OG tags** – Open Graph cho social sharing
- **Twitter Card** – Twitter preview
- **Meta description, keywords** – SEO optimization
- **Favicon, apple-touch-icon** – Branding
- **robots.txt, sitemap.xml** – Crawler instructions
- **JSON-LD structured data** – Rich snippets
- **Canonical URL** – Duplicate content prevention

### PWA (Progressive Web App)
- **Service Worker** – Offline support
- **Web App Manifest** – Installable app
- **Theme color, color-scheme** – Native look
- **Mobile web app capable** – iOS/Android UX

---

## 💻 8. Development Environment

### IDEs & Editors
- **Antigravity IDE** (Primary)
- **Visual Studio Code**
- Extensions: ESLint, Prettier, Tailwind IntelliSense, React DevTools

### Browser DevTools
- **Chrome DevTools** – Performance, Network, Console
- **React DevTools** – Component inspection
- **Lighthouse** – Performance audit
- **Network throttling** – Test slow connections

### CLI Tools
- `git` – Version control
- `npm` / `yarn` / `pnpm` – Package managers
- `npx` – Execute packages
- `curl` – HTTP testing
- `node` – Runtime
- `code` – VSCode CLI

### OS
- **Windows 10**
- **Default shell**: `cmd.exe` / PowerShell
- **OneDrive sync** – Cloud backup

---

## 🔄 9. Version Control (Git)

### Workflow
- **Git** – VCS chính
- **GitHub** – Remote repository
- **Branching strategy**:
  - `main` – Production
  - `develop` – Development
  - `feature/*` – Feature branches
  - `hotfix/*` – Urgent fixes
  - `release/*` – Release prep

### Best Practices
- **Conventional Commits** – `feat:`, `fix:`, `chore:`, `docs:`
- **Semantic Versioning** – `MAJOR.MINOR.PATCH`
- **Pull Request reviews** – Code review
- **Git hooks** – Pre-commit, pre-push
- **.gitignore** – Loại trừ file không cần commit

---

## 🎯 10. Architectural Patterns cho Web

### Design Patterns
- **Component Pattern** – React components
- **Container/Presenter Pattern** – Logic vs UI separation
- **Custom Hooks Pattern** – Reusable logic
- **HOC (Higher-Order Component)**
- **Render Props**
- **Provider Pattern** – Context API
- **Observer Pattern** – State management

### State Management
- **React Context** – Built-in state sharing
- **useState / useReducer** – Local state
- **Zustand / Jotai** (potential) – Lightweight state
- **Redux Toolkit** (potential) – Complex state
- **React Query / TanStack Query** – Server state
- **SWR** (potential) – Data fetching

### Architecture Styles
- **SPA (Single Page Application)**
- **SSR (Server-Side Rendering)** – Next.js, Remix
- **SSG (Static Site Generation)** – Vite SSG, Astro
- **JAMstack** – JavaScript + APIs + Markup
- **Micro-frontend** (potential)
- **Monorepo** – pnpm workspaces, Turborepo

### CI/CD Patterns
- **Pipeline Pattern** (Jenkins/GitHub Actions)
- **Wrapper Pattern** (API wrapper, Logger)
- **Builder Pattern** (Multi-stage Docker)
- **MVC/MVVM** (React + state)

---

## 📦 11. NPM Packages đang dùng

### Production
- `react@^19.0.0`, `react-dom@^19.0.0`
- `@google/genai@^1.29.0`
- `@tailwindcss/vite@^4.1.14`
- `@vitejs/plugin-react@^5.0.4`
- `clsx@^2.1.1`, `tailwind-merge@^3.5.0`
- `dotenv@^17.2.3`
- `express@^4.21.2`
- `lucide-react@^0.546.0`
- `motion@^12.23.24`
- `recharts@^3.8.1`

### Development
- `vite@^6.2.0`, `vitest@^2.1.8`
- `typescript@~5.8.2`, `tsx@^4.21.0`
- `@types/express`, `@types/node`
- `eslint@^8.57.0` + `@typescript-eslint/*` + `eslint-plugin-react*`
- `prettier@^3.4.2`
- `jsdom@^25.0.1`
- `@vitest/coverage-v8@^2.1.8`
- `@testing-library/react@^16.3.0`, `@testing-library/jest-dom`

### Có thể bổ sung (nếu cần)
- `react-router-dom` – Routing
- `react-hook-form` + `zod` – Form + validation
- `@tanstack/react-query` – Server state
- `zustand` – Lightweight state
- `i18next` + `react-i18next` – Đa ngôn ngữ
- `dayjs` / `date-fns` – Date handling
- `axios` – HTTP client (alternative to fetch)

---

## 🎨 12. Design Systems & UI Resources (mới thêm 2026-06-11)

> Tham khảo curated từ repo [`alexpate/awesome-design-systems`](https://github.com/alexpate/awesome-design-systems) (25k+ ⭐, 1,604 forks, The Unlicense)

### Định nghĩa
Design system = tập tài liệu về nguyên tắc, best practices, UI library, pattern library, voice & tone để hướng dẫn team xây dựng sản phẩm số.

### Hệ thống tag đánh giá (4 tiêu chí)
- **Components** – Có UI library/pattern code
- **Voice & Tone** – Hướng dẫn ngôn ngữ, giọng điệu
- **Designers Kit** – File Figma/Sketch cho designer
- **Source code** – Open source

### 🏢 Big Tech / Enterprise (chuẩn công nghiệp)
- **Google Material Design** – Hệ sinh thái phổ biến nhất
- **Microsoft Fluent UI** – Design system Microsoft
- **Apple Human Interface Guidelines** – Cho hệ sinh thái Apple
- **AWS Cloudscape** – Cho cloud services
- **IBM Carbon** – Design system doanh nghiệp lâu đời
- **Adobe Spectrum** – Cho sản phẩm Adobe
- **Oracle Redwood** – Design system mới nhất Oracle
- **SAP Fiori** – Cho SAP

### 🛒 SaaS / E-commerce (production-grade)
- **Shopify Polaris** – Được đánh giá cao nhất về documentation
- **Salesforce Lightning** – Hệ sinh thái Salesforce
- **Atlassian Design System** – Jira, Confluence, Trello
- **GitHub Primer** – Design system GitHub
- **GitLab Pajamas** – Design system GitLab
- **HubSpot Canvas** – Cho HubSpot
- **Twilio Paste** – Cho Twilio
- **Workday Canvas** – Cho Workday
- **Zendesk Garden** – Cho Zendesk

### ⚛️ Open Source UI Libraries (React/JS) – Có thể dùng ngay
- **Ant Design** – UI library lớn nhất từ Alibaba 🇨🇳
- **Chakra UI** – React UI library phổ biến
- **Radix UI** – Headless UI components
- **Mantine** – React components library đầy đủ
- **Shadcn/ui** – Copy-paste components (xu hướng 2024+)
- **Blueprint** (Palantir) – Cho data-dense UIs
- **Evergreen** (Segment) – Out-of-box React UI
- **Semi Design** (DouyinFE) – UI library Trung Quốc
- **Shoelace** – Web components
- **Bumbag UI** – React UI library

### 🏛️ Government / Public Sector (tham khảo tiêu chuẩn)
- **U.S. Web Design System (USWDS)** – Liên bang Mỹ
- **GOV.UK Design System** – Vương quốc Anh
- **NASA Web Design System** – NASA
- **French Government DSFR** – Chính phủ Pháp
- **Singapore Government Design System** – Singapore
- **Italia Design System** – Ý
- **Korea Design System** – Hàn Quốc

### 🚗 Ngành đặc thù (case study UI/UX)
- **Audi UI Kit, Porsche Design System** – Automotive
- **Alaska Airlines Auro** – Hàng không
- **Decathlon Vitamin** – Bán lẻ thể thao
- **Siemens iX** – Công nghiệp
- **Telefónica Mística** – Viễn thông

### 📚 Cách sử dụng hiệu quả
| Mục đích | Nguồn nên tham khảo |
|---|---|
| **Học chuẩn design system** | Material Design, Polaris, Carbon |
| **Tìm React UI library open source** | Chakra UI, Radix, Mantine, Shadcn/ui |
| **Xây dựng design system riêng** | Polaris, Carbon (taxonomy rõ ràng) |
| **Benchmark UI patterns** | GitHub Primer, Atlassian |
| **Học accessibility & voice** | GOV.UK, USWDS |

### 🔗 Tài nguyên bổ sung
- 🌐 Website tổng hợp: [designsystems.com](https://designsystems.com/)
- 📦 Tổng hợp UI components: [shadcn/ui](https://ui.shadcn.com/)
- 📊 So sánh: [designsystemssurvey.com](https://designsystemssurvey.com/)
- 📖 Sách: *Design Systems* by Alla Kholmatova

> ⚠️ **Lưu ý**: Một số dự án "open source" có license giới hạn → luôn check license trước khi dùng commercial. Repo này hiện **không có design system của Việt Nam** (cơ hội đóng góp!).

---

## 🌏 13. Ngôn ngữ

- 🇻🇳 **Tiếng Việt** (Native)
- 🇬🇧 **English** (Technical documentation, code)

---

## 🏆 14. Soft Skills (Web Dev)

- ✅ **End-to-End ownership** – Code → CI/CD → Deploy → Monitor
- ✅ **Documentation** – README, CHANGELOG, inline JSDoc
- ✅ **Security mindset** – Secrets, headers, sanitization
- ✅ **Quality first** – Testing, linting, type-checking
- ✅ **Performance** – Bundle size, lazy loading, caching
- ✅ **Accessibility (a11y)** – ARIA, semantic HTML, keyboard nav
- ✅ **Responsive Design** – Mobile-first, cross-browser
- ✅ **Automation** – Jenkins, GitHub Actions, npm scripts
- ✅ **Design thinking** – Hiểu & áp dụng design system

---

## 📌 15. Tóm tắt nhanh (1 dòng)

```
Web Developer Full-stack:
Frontend  → React 19, Vite 6, TypeScript, Tailwind v4
Backend   → Node.js, Express, REST API
AI        → Google Gemini, MCP servers, MarkItDown (file→MD)
DevOps    → Jenkins, GitHub Actions, Docker, Nginx
Testing   → Vitest, Testing Library, Playwright
Security  → HTTP headers, CSP, request-id, env vars
UI/DS     → Polaris, Carbon, Material, Ant Design, Chakra UI, Shadcn/ui
```

**Antigravity Web Project** (motion + perf + modern framework):
- Motion    → CSS3 3D transforms, Framer Motion, GSAP, Lottie/Rive
- Framework → Astro (islands), Next.js (SSR/SSG/App Router)
- Perf      → Code splitting, WebP/AVIF, lazy load, tree-shaking
- DevOps    → Jenkinsfile 4-stage, multi-stage Docker (node→nginx)

---

## 🎯 16. Web Development Workflow (Best Practice)

```
1. Plan    → Define user stories, components, API contracts
2. Design  → Figma + Design System reference, mobile-first wireframes
3. Code    → React + TS + Tailwind, components <300 dòng
4. Test    → Vitest unit + Playwright E2E
5. Lint    → ESLint + Prettier + tsc --noEmit
6. Build   → Vite production build → dist/
7. Docker  → Multi-stage: node:20 → nginx:alpine
8. CI/CD   → Jenkins / GitHub Actions
9. Deploy  → Container registry → Production
10. Monitor → Error tracking, analytics, performance
```

### 📄 Tiền xử lý dữ liệu cho AI/LLM (MarkItDown)
```
Khi cần nạp tài liệu (PDF/Word/Excel/Audio/YouTube) vào LLM hoặc RAG:
1. Thu thập file (PDF, DOCX, XLSX, MP3, URL YouTube, v.v.)
2. Convert → Markdown: `markitdown file.pdf > doc.md`  (hoặc dùng Python API)
3. Làm sạch MD (loại bỏ header/footer, nhiễu)
4. Chunk + Embed → Vector DB (Pinecone / Chroma / pgvector)
5. Truy vấn LLM qua RAG (kèm context từ MD)
6. Đánh giá chất lượng retrieval + generation
```

---

## 🌌 17. Antigravity Web Project - Developer Skills (mới thêm 2026-06-11)

> Bộ kỹ năng chuyên sâu cho dự án web hiệu năng cao: motion design, tối ưu bundle, framework hiện đại, CI/CD chuẩn production.

### 🎨 17.1. Front-end & Motion Skills

#### CSS3 Nâng cao & 3D Transforms
- Sử dụng thành thạo `transform: rotateX / rotateY / rotateZ`, `perspective`, `translateZ` để tạo hiệu ứng 3D, card lật, hero parallax.
- Kết hợp `transition` + `cubic-bezier()` để chuyển động mượt mà.
- Ứng dụng `backdrop-filter: blur()` cho UI glassmorphism.
- CSS Grid + Flexbox nâng cao cho layout responsive phức tạp.
- `clip-path` & `mask` để tạo shape độc đáo.

#### Motion Libraries
- **Framer Motion** – Animation declarative cho React (AnimatePresence, layout animations, gestures).
- **GSAP** – Animation timeline mạnh mẽ, scroll-trigger, morphSVG.
- **Lottie / Rive** – Animation vector từ After Effects / Rive Editor.
- **AutoAnimate** – Animation layout tự động đơn giản.

#### Tailwind CSS
- Cấu hình `tailwind.config.ts` với theme tùy chỉnh.
- `@apply`, `@layer`, custom plugin.
- JIT (Just-In-Time) mode, arbitrary values: `bg-[#1a1a1a]`.

### ⚡ 17.2. Performance & Weight Optimization

#### Bundle Splitting
- **Code splitting** theo route (React.lazy, dynamic import).
- **Vendor chunk** tách riêng React, UI lib.
- **Tree-shaking** để loại dead code.
- Sử dụng **Vite/Rollup** chunks analyzer để kiểm tra.

#### Asset Optimization
- **Hình ảnh**: Chuyển sang **WebP / AVIF** (giảm 30-50% size).
- **SVG sprite** cho icon, inline SVG cho hình nhỏ.
- **Lazy loading** với `loading="lazy"` hoặc IntersectionObserver.
- **Responsive images** với `srcset`, `picture`.
- **Font subsetting** + `font-display: swap`.

#### Clean HTML
- Loại bỏ thẻ HTML thừa, semantic HTML5.
- Tối ưu Critical CSS, defer non-critical CSS.
- Preload / Prefetch tài nguyên quan trọng.

### 🛠️ 17.3. Core Tech Stack

#### Framework
- **Astro** – Multi-page, content-driven, partial hydration, islands architecture.
- **Next.js** – SSR/SSG, App Router, Server Components.

#### JavaScript Evolution
| Phiên bản | Đặc điểm chính |
|---|---|
| **ES5** | `var`, function declaration, prototype |
| **ES6 (2015)** | `let`/`const`, arrow function, class, template literal, destructuring, Promise |
| **ES7 (2016)** | `Array.includes`, `**` (exponent) |
| **ES8 (2017)** | `async/await`, `Object.values/entries` |
| **ES9 (2018)** | Rest/spread, `Promise.finally`, async iteration |
| **ES10 (2019)** | `Array.flat/flatMap`, `Object.fromEntries` |
| **ES11 (2020)** | Optional chaining `?.`, Nullish coalescing `??`, BigInt |
| **ES12 (2021)** | `String.replaceAll`, logical assignment, `Promise.any` |
| **ES13 (2022)** | Top-level `await`, class fields, `Array.at` |
| **ES14 (2023)** | `Array.findLast`, `toSorted`, `toReversed` |

#### Git/GitHub
- **Git**: `clone`, `commit`, `branch`, `merge`, `rebase`, `cherry-pick`, `stash`.
- **GitHub**: Pull Request, Issues, Actions, Releases, Code Review, branch protection.
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.

### 🚀 17.4. DevOps & CI/CD

#### Jenkinsfile
- Declarative pipeline với 4 stages: `Checkout → Build → Test → Package`.
- Tích hợp Docker build, push image lên registry.
- Cron trigger, webhook từ GitHub.

#### Docker
- **Multi-stage build**:
  - Stage 1: `node:20-alpine` (builder – npm ci, build)
  - Stage 2: `nginx:alpine` (runner – serve dist/)
- **Image optimization**: alpine base, .dockerignore, layer caching.
- **Docker Compose** cho môi trường dev (web + db + cache).
- **Healthcheck** trong Dockerfile.
- **Registry**: Docker Hub, GitHub Container Registry (ghcr.io).

---

## 📜 18. Antigravity Web Project - LUẬT DỰ ÁN (mới thêm 2026-06-11)

> 🚨 **BẮT BUỘC**: Mỗi khi lập trình viên yêu cầu viết code web, AI **phải tuân thủ tuyệt đối** bộ luật & công nghệ dưới đây.

### ⚖️ 18.1. 4 Quy tắc vàng

| # | Luật | Mục đích |
|---|---|---|
| 1️⃣ | **Chỉ dùng Tailwind CSS** để viết giao diện | Nhất quán style, tận dụng JIT, tối ưu bundle |
| 2️⃣ | **Luôn thêm hiệu ứng lơ lửng (Floating / 3D Transform)** cho nút bấm & card | Tạo cảm giác sống động, "antigravity" UX |
| 3️⃣ | **Code cực kỳ tối giản, sạch sẽ** để tối ưu hiệu năng (**Zero-Weight**) | Bundle size nhỏ, tải nhanh, Lighthouse cao |
| 4️⃣ | **Tuyệt đối KHÔNG tự ý cài thêm thư viện nặng** nếu không có trong `skills.md` | Tránh phình bundle, dễ bảo trì |

### 🎨 18.2. Chỉ dùng Tailwind CSS
- ✅ Mọi style phải viết bằng utility class của Tailwind (kể cả hover, focus, active, dark mode).
- ✅ Custom theme qua `tailwind.config.ts` (extend colors, fonts, animations).
- ✅ Dùng `@apply` trong `index.css` cho component-classes lặp lại nhiều lần.
- ❌ KHÔNG viết file `.css`/`.scss` riêng cho component (trừ `index.css` global).
- ❌ KHÔNG dùng styled-components, emotion, CSS-in-JS.

```html
<!-- ✅ ĐÚNG -->
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
  Click
</button>

<!-- ❌ SAI -->
<button style="padding:8px 16px; background:#2563eb; color:#fff;">Click</button>
```

### 🪐 18.3. Floating / 3D Transform - bắt buộc cho nút & card

#### Buttons
```tsx
<button class="
  px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold
  transform transition-all duration-300 ease-out
  hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50
  active:translate-y-0 active:scale-95
  perspective-1000
">
  Mua ngay
</button>
```

#### Cards
```tsx
<div class="
  bg-white rounded-2xl p-6 shadow-lg
  transform transition-transform duration-500
  hover:-translate-y-2 hover:rotate-x-2 hover:shadow-2xl
  preserve-3d
">
  ...
</div>
```

#### CSS3 nâng cao hỗ trợ (xem Section 17.1)
- `transform: rotateX / rotateY / translateZ`
- `perspective` + `transform-style: preserve-3d`
- `cubic-bezier()` cho easing tự nhiên
- `backdrop-filter: blur()` cho glassmorphism

### 🪶 18.4. Zero-Weight Code Style

#### Nguyên tắc
- **Component < 300 dòng** → tách nhỏ nếu dài hơn
- **Không dead code** → xoá import/biến không dùng
- **Không comment thừa** → chỉ comment giải thích "tại sao", không "cái gì"
- **Inline event handler** nhỏ; handler phức tạp → tách hàm có tên
- **Tránh re-render** với `React.memo`, `useMemo`, `useCallback` cho list lớn
- **Dùng SVG inline** thay vì icon library nặng (trừ `lucide-react` đã có trong stack)

#### Performance budget
- **JS bundle** mục tiêu: < 200 KB gzip
- **CSS bundle**: < 30 KB
- **Lighthouse Performance**: ≥ 90
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

```tsx
// ✅ ĐÚNG - tối giản
export const Button = ({ onClick, children }: Props) => (
  <button onClick={onClick} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:-translate-y-1 transition">
    {children}
  </button>
);

// ❌ SAI - thừa prop, type yếu, không memo
export const Button = (props: any) => {
  const handleClick = (e: any) => { /* ... */ props.onClick(e); };
  return <button style={{ padding: '8px 16px' }} onClick={handleClick}>{props.children}</button>;
};
```

### 📦 18.5. Stack được phép dùng (whitelist)

> Chỉ cài thêm package nếu **có tên trong danh sách dưới** hoặc **Section 11**.

| Loại | Package được dùng |
|---|---|
| **UI framework** | React 19, Vite 6, Tailwind v4 |
| **Animation** | motion (Framer Motion), GSAP, Lottie, AutoAnimate |
| **Icon** | lucide-react |
| **Chart** | recharts |
| **State** | React Context, useState/useReducer, Zustand, Jotai |
| **Server state** | @tanstack/react-query, SWR |
| **Form** | react-hook-form, zod |
| **Router** | react-router-dom |
| **i18n** | i18next, react-i18next |
| **Date** | dayjs, date-fns |
| **HTTP** | native `fetch` (ưu tiên) hoặc `axios` |
| **AI** | @google/genai (Gemini) |
| **Test** | vitest, @testing-library/*, playwright, puppeteer |
| **Lint/Format** | eslint, prettier |

### 🚫 18.6. Stack bị cấm (blacklist) - trừ khi được duyệt

| ❌ Package | Lý do thay thế |
|---|---|
| styled-components, emotion, @stitches/* | Tailwind đủ dùng |
| moment.js | dayjs/date-fns nhẹ hơn 90% |
| lodash (toàn bộ) | dùng `lodash-es` hoặc native ES |
| Ant Design / Material-UI | xây dựng custom + Tailwind |
| jquery | không cần trong React |
| chart.js (canvas) | recharts (SVG) nhẹ & đẹp hơn |
| three.js, @react-three/fiber | tốn 500KB+ → dùng SVG/CSS 3D |
| framer-motion-mock, gsap-mock | dev-time only, không cần |

### ✅ 18.7. Checklist trước khi commit code web

- [ ] Tất cả style dùng Tailwind (không file CSS riêng)?
- [ ] Mỗi button/card có hiệu ứng floating / 3D transform?
- [ ] Component < 300 dòng, không có dead code/comment thừa?
- [ ] Không cài package mới ngoài whitelist (Section 18.5)?
- [ ] `npm run build` thành công, không warning?
- [ ] Lighthouse Performance ≥ 90 trên local?
- [ ] Test responsive ở 3 breakpoint: sm (640), md (768), lg (1024)?

---

> 💡 **Tip:** File này là **Web Dev Cheat Sheet** của bạn. Dùng làm reference khi onboarding vào dự án mới, training junior, hoặc update CV/portfolio.
> Bao gồm: Web stack chính + **Antigravity Web Project** (motion, perf, Astro/Next.js, Jenkins, Docker) + **Luật dự án (Section 18)**.
> Cập nhật mỗi khi học thêm công nghệ web mới!
