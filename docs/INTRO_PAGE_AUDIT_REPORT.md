# Báo cáo audit trang “Giới thiệu chung”

**Phạm vi:** audit read-only các file trực tiếp tham gia render trang `gioi-thieu` trong workspace.
**Thời điểm audit:** 2026-08-23.
**Cam kết audit:** không sửa code/UI trong quá trình khảo sát. File này chỉ lưu kết quả audit.

## 1. Framework, version và tooling

`frontend/package.json` xác định frontend là SPA React/Vite:

- React `19.2.8`, React DOM `19.2.8`.
- Vite `8.2.0`, `@vitejs/plugin-react` `6.0.4`, ESM (`"type": "module"`).
- TypeScript `6.0.2`; script typecheck hiện chỉ chạy cho map: `tsc -p tsconfig.map.json --noEmit`.
- Three stack: `three 0.185.1`, `@react-three/fiber 9.7.0`, `@react-three/drei 10.7.8`, Zustand `5.0.15`.
- Icons: `lucide-react 1.31.0`.
- Scripts: `dev: vite`, `build: npm run typecheck:map && vite build`, `preview: vite preview`.
- Không có script test/lint trong `package.json`.

`frontend/index.html:24` tải `/src/main.jsx`.

## 2. Entry, route và component tree

### Entry và thứ tự tải stylesheet

- `frontend/src/main.jsx:4` — `import './styles.css';`
- `frontend/src/main.jsx:5` — `import './styles/intro.css';`
- `frontend/src/main.jsx:35–37` — `createRoot(...).render(<StrictMode><AppErrorBoundary><App /></...>)`.

### Route

- `frontend/src/App.jsx:9–15` — danh sách route/nav; route Intro là `gioi-thieu`.
- `frontend/src/App.jsx:53–55` — `currentRoute()` lấy pathname, bỏ slash cuối, fallback về `gioi-thieu`.
- `frontend/src/App.jsx:65–103` — `App`; route không hợp lệ được đưa về `gioi-thieu`.
- `frontend/src/App.jsx:105–132` — `Header`; nút “Giới thiệu chung” gọi `goTo('gioi-thieu')`.

Không dùng React Router; điều hướng dùng History API.

### Component tree thực tế

```text
App (65)
└─ activeRoute === 'gioi-thieu' → IntroPage (133)
   ├─ section.intro-hero
   │  ├─ .hero-media → /assets/map/map_tech_hero.png
   │  └─ .site-container.hero-inner → .hero-copy
   └─ .intro-content-flow.tech-bg
      ├─ StrategicContent (236)
      │  ├─ ContextContent (293)
      │  ├─ MissionVisionContent (341)
      │  └─ KeyTasksAccordion (363)
      └─ IntroClosingSection (219)
         ├─ OrganizationChart (156)
         │  └─ lightbox
         └─ MilestoneSection (205)
```

Các mapping icon:

- `App.jsx:18` — `introMissionIcons`.
- `App.jsx:25` — `introTaskIcons`.

Dữ liệu nội dung runtime:

- `frontend/src/content/introContent.js:2–119` — `introContent`.
- `:3` — context/bối cảnh.
- `:27` — mission/vision/core values.
- `:69` — key tasks.
- `:120` — `introTabs`.

## 3. File cần cung cấp nguyên văn cho AI patch UI

AI thực hiện patch UI cần nhận **toàn bộ nội dung nguyên văn**, không chỉ snippet, của các file sau:

| Mức độ | File | Lý do |
|---|---|---|
| Bắt buộc | `frontend/src/App.jsx` | DOM JSX, className, route, lightbox, hero, milestone, tab và accordion. |
| Bắt buộc | `frontend/src/styles/intro.css` | Lớp Intro import sau, override cuối cho nhiều selector. |
| Bắt buộc | `frontend/src/styles.css` | Base hero và legacy contract có selector trùng; nhiều property vẫn được kế thừa. |
| Bắt buộc | `frontend/src/styles/tokens.css` | Color, typography, spacing/container và dark-theme tokens. |
| Bắt buộc | `frontend/src/main.jsx` | Xác định thứ tự import quyết định cascade. |
| Khi đổi copy/tab | `frontend/src/content/introContent.js` | Data của context, mission/vision và accordion. |
| Khi cần bảo toàn copy | `docs/UET_INTRO_OFFICIAL_SOURCE.md` | Nguồn nội dung mà `introContent.js` ghi nhận. |
| Debug startup | `frontend/index.html` | Root/fallback và entry script; không trực tiếp tạo Intro UI. |

Không cần dùng `YouthUnionPage.jsx`, `youthUnionContent.js` hoặc `youth-union.css` cho patch Intro; chúng không render tại route `gioi-thieu`.

### Cascade cần chú ý

1. `styles.css` được import trước, `styles/intro.css` import sau. `intro.css` chỉ thắng cho những property mà nó thực sự khai báo.
2. `styles.css` có nhiều lớp rule Intro:
   - Hero base: `styles.css:39–54`.
   - Hero override cũ: `:181–186`, `:298–313`, `:572–603`.
   - Block legacy tên **“Approved Intro redesign contract”**: bắt đầu `:1112`.
3. Các property legacy còn tồn tại do `intro.css` override chưa đầy đủ:
   - `.intro-primary-tabs`: `styles.css:1178` đặt `gap:16px`; `intro.css:67` không reset gap.
   - `.intro-primary-tab`: legacy `styles.css:1184–1201` đặt border/radius/background/shadow; `intro.css:68–90` chỉ reset một phần. Active tab có thể giữ shadow từ `styles.css:1206–1211`.
   - `.intro-section-panel`: `styles.css:1231–1239` vẫn cung cấp border, radius, background, shadow, padding side/bottom; `intro.css:96` chỉ đặt `min-width` và `padding-top`.
4. Một số selector legacy đã không còn khớp DOM: `.intro-closing-section`, `.intro-final-grid`, `.intro-organization-card`, `.intro-milestone-card`. JSX hiện dùng `.intro-organization-section` và `.intro-milestone-section`.
5. `styles.css:299–302` đặt `display:none` cho `.intro-hero::after`, `.hero-media::before`, `.hero-media::after`. `intro.css` không reset `display`, vì vậy các pseudo-element này vẫn bị tắt.

### Token quan trọng

- `tokens.css:2–40` — palette, font, radius, container (`--container: 1480px`), gutter và header height.
- `tokens.css:43–52` — semantic light-theme tokens.
- `tokens.css:53–65` — dark-mode override.

## 4. Assets và dimensions

| Asset | Dimensions | Dùng tại |
|---|---:|---|
| `frontend/public/assets/map/map_tech_hero.png` | `1672 × 941` | Hero Intro, JSX `IntroPage`. |
| `frontend/public/assets/intro/uet-organization-chart.webp` | `1448 × 1086` | Preview/lightbox cơ cấu tổ chức, `OrganizationChart`. |
| `frontend/public/assets/intro/uet-20-years-banner.webp` | `2101 × 748` | CSS background milestone, `intro.css:151`. |
| `frontend/public/assets/intro/uet.png` | `1121 × 1121` | Logo header toàn app, có mặt khi vào Intro. |
| `frontend/public/assets/map/aerial-campus.jpg` | `2000 × 1025` | Asset map/module khác; Intro không tham chiếu trực tiếp. |

Dimensions WebP được parse từ header RIFF/VP8.

## 5. DOM/layout diagnosis

| Triệu chứng | Quy tắc/DOM gây ra |
|---|---|
| Hero quá tối | `intro.css:27–32` dùng nền navy; `:33–43` đặt ảnh rộng 60%, `opacity:.76`, `brightness(.8)`; `:44–49` thêm hai lớp navy blend rất đậm. |
| Navy empty space ở hero | Hero tối thiểu `500–590px`; ảnh chỉ nằm ở 60% phía phải; `.hero-copy` max 690px và padding top/bottom `80px / 52px` (`intro.css:50`). Copy ngắn sẽ để lại mảng navy lớn. |
| Nội dung hẹp | `.intro-page-container` cap `1280px` (`intro.css:24`) trong khi global `--container` là `1480px`; heading cap 820px (`:62`), context text cap 860px (`:103`), diagram cap 1140px (`:139`). |
| Nhiều whitespace dọc | Strategy padding `80–104px` trên và `88–108px` dưới (`intro.css:60`); heading có bottom margin tối đa 48px (`:62`); panel thêm padding top 36–48px (`:96`). Organization có padding riêng `80–104px / 72–88px` (`:135`) và lead margin bottom 42px (`:139`). |
| Strategy giống dashboard | Legacy `.intro-primary-tabs` có gap 16px; `.intro-primary-tab` và `.intro-section-panel` còn giữ border/radius/background/shadow qua cascade. Đây là nguyên nhân chính của card/dashboard appearance. |
| Organization nhỏ | Diagram wrapper cap `width:min(100%, 1140px)` (`intro.css:139`), dù asset rộng 1448px, lại nằm trong outer cap 1280px. |
| Milestone tối | `.intro-milestone-section` dùng `--navy-950`; image bị `saturate(.42) contrast(.9)` với `opacity:.38` (`intro.css:151`) và có navy overlay (`:152`). |
| Milestone trống | `MilestoneSection` (`App.jsx:205–218`) render `.intro-milestone-visual` rỗng. CSS `intro.css:153` vẫn tạo grid hai cột và `:162` cấp `min-height:190px`, nên cột thứ hai là vùng trống thực. |

## 6. Git status và lịch sử liên quan

### Branch/HEAD

- Branch hiện tại: `newest`.
- HEAD: `1eaa74b` — `feat: finalize UET Navigator UI and DTN-HSV skeleton`.
- `origin/newest` cùng trỏ tới commit này tại thời điểm audit.

### Trạng thái file trực tiếp liên quan Intro

```text
 M frontend/src/App.jsx
 M frontend/src/main.jsx
 M frontend/src/styles.css
?? frontend/src/styles/intro.css
?? frontend/public/assets/intro/uet.png
```

Không có thay đổi staged trong tập file Intro đã kiểm tra. `introContent.js`, `tokens.css`, asset WebP Intro và map hero không hiện thay đổi trong Git status.

Worktree tổng thể dirty đáng kể ngoài Intro: có thay đổi backend/Youth Union, nhiều logo/asset bị xóa hoặc untracked, và `frontend/Pictures/` untracked. Không nên gộp chúng vào commit patch Intro nếu chưa review riêng.

### Commit candidates trước một V3 tiềm năng

| Commit | Ngày | Ý nghĩa |
|---|---|---|
| `1eaa74b` | 2026-08-21 | Baseline gần nhất; đổi `App.jsx`, `styles.css`, `tokens.css`, banner 20 năm và có `UET_INTRO_REDESIGN_SPEC.md`. |
| `150f370` | 2026-08-20 | Refactor cấu trúc, có lịch sử trên các file Intro. |
| `4ee8ae9` | 2026-08-20 | UI fixes. |
| `6b68338` | 2026-08-19 | UI redesign pages/directories. |
| `49766c8` | 2026-08-19 | Thêm aerial campus background. |
| `c9988ea` | 2026-08-21 | Checkpoint External Tour/map; gần HEAD nhưng không tập trung Intro. |

Không có commit/tag/branch khớp `V3`, `v3` hoặc `version 3` trong lịch sử đã truy vấn. Không thể xác minh một mốc V3 chính thức từ Git; bảng trên chỉ là candidates theo lịch sử file và thiết kế.

## Xác minh audit

- Không có code/UI bị thay đổi trong audit.
- IDE diagnostics cho `App.jsx`, `main.jsx`, `styles.css`, `styles/intro.css`, `tokens.css`, `introContent.js`: không có lỗi.
