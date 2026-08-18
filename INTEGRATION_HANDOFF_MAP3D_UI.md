# UET Campus Tour — Integration Handoff
## Hướng dẫn hợp nhất UI chính và Map 3D thành một ứng dụng, nhưng vẫn giữ ranh giới phát triển độc lập

> **Mục đích của tài liệu này**
>
> Tài liệu này dành cho máy/dev session tiếp theo khi làm việc với repository GitHub:
>
> `nh-toan/uet-campus-tour`
>
> Hiện repository có hai dòng code có nguồn gốc khác nhau:
>
> 1. **UI chính / UET Navigator** — bản chính thức, có `main`, có Header, Giới thiệu, tab Bản đồ, Liên chi, Câu lạc bộ, backend và toàn bộ asset/content.
> 2. **Map 3D / UET Virtual Campus Tour Phase 1** — được phát triển độc lập bằng Codex, đã hoàn thành Phase 1 và được push lên branch riêng (dự kiến `map3d-phase1`).
>
> Mục tiêu cuối cùng **không phải iframe** và **không phải hai website độc lập**.
>
> Mục tiêu là:
>
> - UI chính vẫn là ứng dụng host duy nhất;
> - Map 3D trở thành một feature/module nằm trực tiếp trong tab **Bản đồ**;
> - toàn bộ Liên chi, CLB, thông tin trường, backend và asset content hiện có của UI chính không bị phá;
> - phần Map 3D vẫn có boundary rõ ràng để có thể tiếp tục phát triển gần như độc lập;
> - một build frontend duy nhất có thể được deploy lên miền của trường;
> - không merge mù hai codebase, không dùng `--allow-unrelated-histories`, không copy toàn bộ source branch Map đè lên `main`.

---

# 1. Tình trạng hai codebase hiện tại

## 1.1. UI chính — branch `main`

Nguồn được kiểm tra từ file:

`uet-campus-tour-main(2).zip`

Cấu trúc quan trọng:

```text
uet-campus-tour-main/
├── package.json
├── package-lock.json
├── backend/
│   ├── server.js
│   └── data/
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── styles.css
│   ├── public/
│   │   └── assets/
│   └── dist/
└── tools/
```

### Root package

Root package có nhiệm vụ chạy backend và frontend cùng lúc:

```json
{
  "name": "uet-navigator",
  "version": "2.0.0",
  "scripts": {
    "dev": "concurrently --kill-others-on-fail \"npm run server\" \"npm run client\"",
    "server": "node backend/server.js",
    "client": "npm --prefix frontend run dev",
    "build": "npm --prefix frontend run build",
    "start": "node backend/server.js",
    "check": "node --check backend/server.js && npm --prefix frontend run build"
  }
}
```

Root hiện chỉ cần `concurrently` để orchestration.

**Không đưa Three/R3F/Tailwind/React vào root package.**

Các dependency frontend tiếp tục thuộc:

```text
frontend/package.json
```

---

## 1.2. Stack của UI chính hiện tại

`frontend/package.json`:

```text
React       18.3.1
React DOM   18.3.1
Vite        5.4.14
@vitejs/plugin-react 4.3.4
JavaScript / JSX
CSS thuần
```

Hiện UI chính:

- không TypeScript;
- không Three.js;
- không R3F;
- không Drei;
- không Zustand;
- không Tailwind;
- không Lucide;
- không Router package.

Điều này là bình thường và không cần rewrite toàn bộ UI sang TypeScript khi tích hợp Map.

---

# 2. UI chính hiện đang compose như thế nào

`frontend/src/App.jsx` hiện chứa toàn bộ navigation và page composition.

Route chính:

```text
/gioi-thieu
/ban-do
/lien-chi
/cau-lac-bo
```

Composition:

```text
App
├── Header
├── Main
│   ├── IntroPage
│   ├── MapPage
│   ├── LienChiPage
│   └── ClubPage
└── Footer
```

Routing hiện là routing tự quản bằng:

```text
location.pathname
history.pushState
popstate
```

**Không thay router trong integration Map.**

Không thêm React Router chỉ để tích hợp Map.

---

# 3. Vị trí chính xác Map 3D phải đi vào

`MapPage()` của UI chính đã có sẵn vùng placeholder:

```jsx
<div id="map-viewer" className="map-viewer">
  ...
</div>
```

Hiện vùng này chỉ chứa fake map/placeholder bằng DOM/CSS:

```text
map-nav
map-point
map-status
map-wait
```

Đây chính là vùng cần thay.

## Sau integration

Concept mong muốn:

```jsx
function MapPage({ navigate }) {
  return (
    <section className="map-page">
      <div className="map-copy">
        {/* GIỮ NGUYÊN copy, CTA, stats của UI chính */}
      </div>

      <div id="map-viewer" className="map-viewer">
        <CampusMapModule />
      </div>
    </section>
  )
}
```

Tức:

```text
UET Navigator
└── tab Bản đồ
    └── CampusMapModule
        ├── CampusMap3D
        ├── Hotspots
        ├── PanoramaViewer
        ├── RadarMinimap
        └── TourControls
```

**Không thay App, Header, Footer, Liên chi, CLB hay backend bằng code từ branch Map.**

---

# 4. Backend và content của UI chính phải được bảo toàn

Backend UI chính đang sở hữu API/content.

Hiện có ít nhất:

```text
GET /api/lien-chi
GET /api/clubs
```

Ngoài ra backend có logic quản trị Liên chi và serve static frontend build.

Map 3D **không cần backend riêng**.

Map 3D không được:

- import JSON Liên chi/CLB từ backend;
- thay API hiện tại;
- thay server;
- tạo server riêng;
- quản lý content chính thức của trường.

Ownership phải được giữ:

```text
UI MAIN OWNS
├── Header / Footer
├── routing
├── Giới thiệu
├── Liên chi
├── Câu lạc bộ
├── Handbook/content nếu có
├── backend API
└── public content assets
```

---

# 5. Map 3D — trạng thái hiện tại

Nguồn được kiểm tra từ:

`uet-campus-tour.zip`

Repo Map thực tế nằm trong:

```text
uet-campus-tour/campus-tour/
```

Phase 1 đã được hoàn thành và accepted.

Snapshot kỳ vọng trên GitHub:

```text
branch: map3d-phase1
commit Phase 1 accepted: c0988b6
message: P1-11: accept phase 1 demo
```

**Máy integration phải verify branch/commit thực tế trên remote; không được giả định nếu Git không khớp.**

---

# 6. Stack Map 3D

Map hiện dùng:

```text
React                 19.2.8
React DOM             19.2.8
Vite                  8.2.x
TypeScript            6.0.x strict
Three.js              0.185.x / r185
@react-three/fiber    9.7.0
@react-three/drei     10.7.8
Zustand               5.0.15
Tailwind CSS          4.3.3
@tailwindcss/vite     4.3.3
Lucide React          1.31.0
Oxlint                1.75.x
```

Map đã được build/test trên Node:

```text
v24.15.0
```

Package Vite 8 trong snapshot yêu cầu build environment tương thích:

```text
Node ^20.19.0 hoặc >=22.12.0
```

Khuyến nghị cho máy dev/deploy build:

```text
Node >=22.12
```

Không khóa hệ thống vào Node 24 nếu không cần.

---

# 7. Lý do phải nâng React của UI chính nếu tích hợp trực tiếp

Map đang dùng:

```text
@react-three/fiber 9.7.0
@react-three/drei 10.7.8
```

Peer dependency trong package Map hiện tại cho thấy:

```text
@react-three/fiber 9.7.0
  react     >=19 <19.3
  react-dom >=19 <19.3

@react-three/drei 10.7.8
  react     ^19
  react-dom ^19
  fiber     ^9
```

Do đó:

> **Nếu Map được import trực tiếp vào cùng React tree của UI chính, target React phải là React 19.**

Không nên giữ UI React 18 rồi ép R3F 9 bằng:

```text
--force
--legacy-peer-deps
```

Không downgrade Map về R3F 8 chỉ để tránh nâng UI, trừ khi migration React 19 thực sự có blocker không giải quyết được.

---

# 8. Target stack sau khi hợp nhất

Khuyến nghị target frontend cuối cùng:

```text
React                 19.2.x
React DOM             19.2.x

Vite                  8.2.x
@vitejs/plugin-react   6.x

JavaScript/JSX        tiếp tục cho UI legacy
TypeScript strict     cho Campus Map và code mới

Three.js              0.185.x
R3F                    9.7.x
Drei                   10.7.x
Zustand                5.x
Lucide React           1.x

Tailwind CSS           4.3.x
@tailwindcss/vite      4.3.x
```

## Quan trọng

**Không yêu cầu chuyển `App.jsx` và UI chính sang TypeScript ngay.**

Vite có thể chạy project mixed:

```text
App.jsx                 legacy UI
features/campus-map/*.tsx   Map mới
```

Đây là hướng ít rủi ro nhất.

---

# 9. Thứ tự nâng version — KHÔNG nâng tất cả trong một commit

Migration phải tách thành checkpoint.

## Version Step V0 — baseline UI

Trước mọi thay đổi:

```bash
npm install
npm run check
npm run dev
```

Test:

- Giới thiệu;
- Bản đồ placeholder;
- Liên chi;
- CLB;
- search/filter;
- modal;
- API;
- mobile;
- browser back/forward.

Ghi lại screenshot nếu cần.

**Không integration nếu baseline UI đã lỗi.**

---

## Version Step V1 — React 18 → React 19

Chỉ nâng:

```text
react
react-dom
```

Target ưu tiên đúng version đã được Map verify:

```text
19.2.8
```

Sau đó test lại toàn bộ UI trước khi thêm Three.

Expected:

- `createRoot` vẫn hoạt động;
- hooks hiện tại vẫn hoạt động;
- custom route vẫn hoạt động;
- API không đổi.

Commit riêng, ví dụ:

```text
INT-01: upgrade host to React 19
```

Nếu fail:

- dừng;
- sửa lỗi React migration trong UI;
- không cài Map dependencies cho đến khi UI thuần React 19 chạy sạch.

---

# 10. Version Step V2 — Vite 5 → Vite 8

Sau khi React 19 UI chạy sạch, nâng build tool riêng:

```text
vite 5.4.x → 8.2.x
@vitejs/plugin-react 4.x → 6.x
```

Giữ nguyên proxy:

```js
server: {
  port: 5173,
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

Giữ:

```js
build: {
  outDir: 'dist',
  emptyOutDir: true
}
```

Sau upgrade:

```bash
npm run build
npm run dev
```

Test API proxy và navigation.

Commit riêng:

```text
INT-02: upgrade frontend build toolchain
```

### Node contract

Khi Vite 8 trở thành build tool chính, update/ghi rõ môi trường build phải dùng Node tương thích.

Nếu root project dùng `npm run build`, Node của root cũng phải đáp ứng Vite 8.

Khuyến nghị:

```text
Node >=22.12
```

---

# 11. Version Step V3 — thêm TypeScript nhưng KHÔNG rewrite UI

Thêm:

```text
typescript
@types/react
@types/react-dom
@types/node
@types/three
```

Tạo TypeScript config strict dành cho code mới.

Có thể dùng:

```text
frontend/tsconfig.json
```

hoặc:

```text
frontend/tsconfig.map.json
```

Nếu muốn giảm blast radius, khuyến nghị ban đầu:

```text
tsconfig.map.json
```

và chỉ include:

```text
src/features/campus-map/**/*.ts
src/features/campus-map/**/*.tsx
```

Mục tiêu:

```text
Legacy UI JS không bị ép migrate.
Map TS vẫn strict.
```

Script nên có:

```text
typecheck:map
```

Ví dụ concept:

```json
{
  "scripts": {
    "typecheck:map": "tsc -p tsconfig.map.json --noEmit",
    "build": "npm run typecheck:map && vite build"
  }
}
```

Không bỏ strict của Map.

---

# 12. Version Step V4 — thêm dependencies Map

Chỉ sau khi UI React 19 + Vite target build sạch mới thêm:

```text
three
@react-three/fiber
@react-three/drei
zustand
lucide-react
tailwindcss
@tailwindcss/vite
```

Version nên bám snapshot Map đã accepted.

**Không copy `package.json` của branch Map đè vào `frontend/package.json`.**

Thay vào đó:

```text
merge dependency list có chủ đích.
```

## Lockfile

Không copy:

```text
map3d-phase1/package-lock.json
```

sang UI.

Sau khi chỉnh `frontend/package.json`:

```bash
cd frontend
npm install
```

để `frontend/package-lock.json` được regenerate đúng dependency graph của app hợp nhất.

---

# 13. Vấn đề CSS lớn nhất: Tailwind vs `styles.css`

UI chính hiện dùng CSS global rất nhiều:

```text
:root
*
body
button
input
h1
...
```

Map hiện cũng import:

```css
@import "tailwindcss";
```

Tailwind full import tự inject **Preflight**.

Preflight reset global:

- margin/padding;
- border;
- heading;
- list;
- image;
- button;
- canvas;
- v.v.

Nếu import Tailwind nguyên bản vào UI hiện tại, có nguy cơ thay đổi visual của:

```text
Header
Giới thiệu
Liên chi
CLB
Modal
Footer
```

## Quy tắc bắt buộc

> **Không import nguyên `@import "tailwindcss";` vào unified host trước khi xử lý isolation.**

---

# 14. Chiến lược CSS isolation khuyến nghị

Có hai mức.

## Mức bắt buộc — bỏ Tailwind Preflight

Map chỉ cần theme + utilities.

Không để Tailwind base reset UI legacy.

Concept Tailwind v4:

```css
@layer theme, base, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
```

**Không import:**

```css
tailwindcss/preflight.css
```

Sau đó build và kiểm tra mọi utility Map vẫn hoạt động.

---

## Mức khuyến nghị dài hạn — prefix utility Map

Để tránh sau này UI chính vô tình dùng class như:

```text
flex
grid
absolute
relative
hidden
...
```

trùng utility Tailwind Map, nên prefix Tailwind cho feature Map.

Ví dụ concept:

```css
prefix(map)
```

Khi đó utility Map trở thành dạng:

```text
map:flex
map:absolute
map:bg-uet-navy
...
```

Điều này đòi hỏi đổi class trong Map một lần, nhưng đổi lại boundary CSS rất rõ.

### Nếu deadline integration rất gấp

Có thể:

1. disable Preflight trước;
2. integration chạy được;
3. test không CSS bleed;
4. prefix utilities ở một commit hardening riêng.

Không được bỏ qua Preflight isolation.

---

# 15. Token Map cũng phải được scope

Map hiện có:

```css
:root {
  --color-navy-900: ...
  --color-tech-blue: ...
  ...
}
```

UI chính cũng có design token riêng ở `:root`.

Không nên để Map tiếp tục sở hữu generic token toàn document.

Khuyến nghị sau integration:

```css
.campus-map-root {
  --map-color-navy: ...;
  --map-color-blue: ...;
  --map-color-gold: ...;
  ...
}
```

Map token chỉ có hiệu lực trong:

```tsx
<div className="campus-map-root">
```

Không thay token/UI hiện tại của host.

Nếu visual Map sau này cần đồng bộ hoàn toàn với UET Navigator, host có thể truyền/map token riêng.

---

# 16. Không merge hai Git history trực tiếp

Đây là điểm cực kỳ quan trọng.

Map repo được tạo độc lập trước khi push lên branch của GitHub repo UI.

Do đó hai branch có khả năng có **unrelated history**.

## Tuyệt đối không làm

```bash
git merge origin/map3d-phase1 --allow-unrelated-histories
```

Không merge root tree của branch Map vào root tree của main.

Không resolve hàng trăm conflict bằng cách "accept both".

Không copy:

```text
package.json
vite.config
App.tsx
main.tsx
AGENTS.md
task.md
plan.md
STATUS.md
```

đè root/UI chính.

---

# 17. Workflow Git đúng trên máy integration

Giả sử máy mới đã đăng nhập GitHub.

## 17.1 Clone/fetch

```bash
git clone git@github.com:nh-toan/uet-campus-tour.git
cd uet-campus-tour

git fetch origin --prune
git branch -a
```

Xác nhận có:

```text
origin/main
origin/map3d-phase1
```

Nếu thiếu branch Map:

> DỪNG. Không tự suy đoán tên branch.

---

## 17.2 Bắt đầu từ UI chính

```bash
git switch main
git pull --ff-only origin main
git status
```

Working tree phải sạch.

---

## 17.3 Tạo branch integration

Khuyến nghị:

```bash
git switch -c integration/map3d
```

Tất cả integration làm tại branch này.

**Không commit trực tiếp vào main.**

---

## 17.4 Checkout donor Map song song bằng worktree

Thay vì merge:

```bash
git worktree add --detach ../uet-campus-map-donor origin/map3d-phase1
```

Lúc đó:

```text
uet-campus-tour/          ← integration branch, UI host
uet-campus-map-donor/     ← read-only donor Map branch
```

Đây là setup lý tưởng để vibe code trên máy mới.

Có thể mở hai folder song song trong editor.

### Quy tắc

`uet-campus-map-donor` được coi là **reference/source donor**.

Không tiếp tục feature mới trực tiếp trong donor trong quá trình integration.

---

# 18. Target folder architecture trong unified frontend

Không copy Map vào `src/` một cách phẳng.

Tạo feature boundary:

```text
frontend/src/
├── App.jsx
├── main.jsx
├── styles.css
│
└── features/
    └── campus-map/
        ├── CampusMapModule.tsx
        │
        ├── scenes/
        │   ├── CampusMap3D/
        │   │   └── index.tsx
        │   ├── PanoramaViewer/
        │   │   └── index.tsx
        │   └── Hotspots/
        │       └── index.tsx
        │
        ├── components/
        │   ├── RadarMinimap/
        │   │   └── index.tsx
        │   └── TourControls/
        │       └── index.tsx
        │
        ├── store/
        │   └── useCampusStore.ts
        │
        ├── config/
        │   ├── hotspots.config.ts
        │   ├── panorama.config.ts
        │   └── tour.config.ts
        │
        ├── types/
        │   └── campus-map.types.ts
        │
        ├── assets/
        │   └── mock/
        │
        └── styles/
            ├── map-tokens.css
            └── map-tailwind.css
```

Mục tiêu:

> Xóa cả `features/campus-map/` vẫn không phá Liên chi/CLB/backend ngoài việc tab Map không render.

Đó là definition của boundary tốt.

---

# 19. Những file từ branch Map NÊN PORT

Từ donor:

```text
src/scenes/CampusMap3D/
src/scenes/PanoramaViewer/
src/scenes/Hotspots/

src/components/RadarMinimap/
src/components/TourControls/

src/store/useCampusStore.ts

src/config/hotspots.config.ts
src/config/panorama.config.ts
src/config/tour.config.ts

src/assets/mock/sample-panorama-grid.svg
```

Types cần giữ cho Map:

```text
Hotspot
PanoramaScene
TourStop
```

Camera/store types của `useCampusStore` vẫn giữ nội bộ Map.

---

# 20. Những phần từ Map KHÔNG nên đưa vào host

Map Phase 1 từng tự chứa UI/content vì lúc đó nó là standalone app.

Sau khi integration, ownership đã thay đổi.

## Không port vào integrated feature

```text
InfoDrawer
LangThemeToggle
useUIStore

campus.config.ts
faculty.config.ts
club.config.ts

i18n/vi.json
i18n/en.json

SiteHeader stub
```

Lý do:

- UI chính đã sở hữu thông tin trường;
- UI chính đã sở hữu Liên chi;
- UI chính đã sở hữu CLB;
- không tạo hai source of truth;
- không để Map có button "Thông tin" cạnh tab Liên chi/CLB của host;
- không để Map có language/theme control độc lập với website.

Có thể giữ các file này trong donor/archive branch để tham khảo, nhưng không cần runtime unified app.

---

# 21. `AppShell.tsx` KHÔNG copy nguyên bản

Map `AppShell.tsx` hiện chứa:

```text
scene composition
InfoDrawer
LangThemeToggle
TourControls
Radar
button Thông tin
Back
h-svh
```

Integrated module phải được viết lại thành:

```text
CampusMapModule.tsx
```

Dựa trên logic scene transition của `AppShell`, nhưng:

### Giữ

- Map ↔ Panorama transition;
- Back Panorama → Map;
- Radar;
- TourControls;
- token resolution cần cho scene;
- `viewMode`.

### Bỏ

- InfoDrawer;
- nút Thông tin;
- LangThemeToggle;
- `useUIStore`.

---

# 22. Root sizing phải thay đổi

Standalone Map hiện root kiểu:

```text
h-svh
w-full
```

Trong unified UI, Map chỉ nằm bên trong:

```text
.map-viewer
```

Do đó root Map **không được tự chiếm viewport**.

Target:

```text
width: 100%
height: 100%
min-width: 0
min-height: 0
```

Concept:

```tsx
<div className="campus-map-root h-full w-full overflow-hidden">
```

Parent `.map-viewer` của UI chính chịu trách nhiệm chiều cao.

Nếu không sửa điều này, integrated Map có thể:

- tràn khỏi tab;
- phá scroll;
- che Header/Footer;
- fullscreen sizing sai.

---

# 23. Lazy-load Map là yêu cầu quan trọng

Map bundle Phase 1 hiện đã có warning khoảng:

```text
~1.1 MB minified
~300+ kB gzip
```

Nếu import Map trực tiếp ở đầu `App.jsx`, mọi user vào:

```text
Giới thiệu
Liên chi
CLB
```

cũng có thể phải tải Three/R3F.

Không nên.

## Khuyến nghị

Dùng React lazy/dynamic import cho Map feature.

Concept:

```jsx
import { lazy, Suspense } from 'react'

const CampusMapModule = lazy(
  () => import('./features/campus-map/CampusMapModule')
)
```

Map chỉ mount khi:

```text
activeRoute === "ban-do"
```

Do Vite code splitting, Map/Three chunk sẽ được tách khỏi UI chính.

Acceptance test:

### Khi vào `/gioi-thieu`

Network không nên tải Map/Three chunk.

### Khi chuyển `/ban-do`

Map chunk mới tải.

Đây là optimization kiến trúc quan trọng hơn việc cố giảm vài KB CSS.

---

# 24. MapPage sau integration

UI chính giữ layout/design hiện tại.

Không thay MapPage bằng standalone AppShell.

Concept:

```text
MapPage
├── map-copy
│   ├── eyebrow
│   ├── title
│   ├── description
│   ├── fullscreen CTA
│   └── stats
│
└── map-viewer
    └── Suspense
        └── CampusMapModule
```

Có thể dùng loading shell đồng bộ visual UI:

```text
Đang tải bản đồ 3D...
```

Không để màn hình trắng khi chunk/texture load.

---

# 25. Fullscreen

UI chính đã có:

```js
document.querySelector('#map-viewer')?.requestFullscreen?.()
```

Giữ behavior này.

CampusMapModule chỉ cần fill parent.

Test bắt buộc:

1. map bình thường trong card;
2. bấm fullscreen;
3. Canvas resize đúng;
4. Radar/TourControls/Back vẫn đúng vị trí;
5. ESC thoát fullscreen;
6. quay lại layout không bị kích thước sai.

R3F Canvas phải nhận resize từ parent đúng.

---

# 26. Asset ownership

Không trộn asset Map và content asset.

## UI content giữ nguyên

Ví dụ:

```text
frontend/public/assets/clubs/
frontend/public/assets/faculties/ hoặc lien-chi/
frontend/public/assets/handbook/
...
```

## Map-specific

Mock/import nhỏ:

```text
frontend/src/features/campus-map/assets/
```

Sau này asset lớn:

```text
frontend/public/assets/map3d/
```

hoặc object storage/CDN riêng.

Không đặt GLB/panorama vào folder CLB/Liên chi.

---

# 27. Data contract sau integration

Map chỉ sở hữu metadata không gian:

```text
Building ID
Hotspot ID
3D position
Panorama scene
camera
tour stop
map asset
```

UI chính sở hữu content:

```text
Tên/giới thiệu trường
Liên chi
CLB
Fanpage
Handbook
Nội dung dài
```

Ranh giới:

> **Thông tin cần để điều khiển không gian → Map.**
>
> **Thông tin nội dung UET → Host UI/backend.**

---

# 28. Nếu sau này Map cần mở content UI

Không để Map import:

```text
/api/lien-chi
/api/clubs
App.jsx
backend/data
```

Thay vào đó host truyền callback.

Ví dụ tương lai:

```tsx
<CampusMapModule
  onOpenEntity={(entity) => {
    // host quyết định navigation/modal
  }}
/>
```

Map phát event semantic:

```text
building selected
faculty selected
```

Host quyết định:

```text
navigate tab
open modal
fetch API
```

Đây là cách giữ independent development.

**Không implement callback trước khi có requirement thật.**

---

# 29. Store ownership

`useCampusStore` chỉ dành cho Map.

Nó sở hữu:

```text
viewMode
activeSceneId
camera
mapView
tour
```

Không đưa vào đó:

```text
UI route
selected Club
selected Liên chi
Header state
backend state
```

Ngược lại App UI không cần biết:

```text
Three Camera
Vector3
yaw/pitch
OrbitControls
texture
```

---

# 30. Branch strategy sau khi integration thành công

Đây là điểm quan trọng để hai phần vẫn phát triển độc lập.

## Không tiếp tục dùng `map3d-phase1` như branch development dài hạn

`map3d-phase1` nên trở thành:

> **historical donor snapshot của standalone Map Phase 1.**

Sau khi Map đã được port vào main architecture, source of truth Map chuyển thành:

```text
main:frontend/src/features/campus-map/
```

Nếu tiếp tục phát triển song song cả donor branch và integrated feature, sẽ có hai source code Map và cực khó sync.

---

# 31. Development model sau integration

Tất cả feature branch tạo từ `main`.

## Map work

```text
feature/map3d-real-model
feature/map3d-panorama-assets
feature/map3d-camera
feature/map3d-performance
```

Phạm vi chủ yếu:

```text
frontend/src/features/campus-map/
frontend/public/assets/map3d/
```

## UI work

```text
feature/ui-club-polish
feature/ui-lien-chi
feature/ui-handbook
feature/ui-header
```

Phạm vi chủ yếu:

```text
frontend/src/App.jsx
frontend/src/styles.css
frontend/public/assets/...
backend/...
```

Hai bên cùng branch từ main mới nhất.

---

# 32. Quy trình sync độc lập

Trước khi bắt đầu feature:

```bash
git switch main
git pull --ff-only
git switch -c feature/...
```

Trong feature dài:

```bash
git fetch origin
git rebase origin/main
```

hoặc merge main tùy team convention.

Không tạo hai long-lived branches cố định kiểu:

```text
ui-forever
map-forever
```

vì chúng sẽ diverge.

Độc lập nên đến từ:

```text
folder ownership
feature boundary
small branches
typed contract
```

không phải từ hai codebase lâu dài.

---

# 33. Commit plan integration khuyến nghị

Không làm tất cả một commit.

## INT-00 — baseline snapshot

Không sửa code.

Verify UI main.

---

## INT-01 — React 19

Chỉ upgrade React/ReactDOM.

Verify toàn UI.

---

## INT-02 — Vite/toolchain

Upgrade Vite/plugin, Node contract.

Verify UI/backend proxy/build.

---

## INT-03 — TypeScript + Map dependencies

Thêm TS strict cho feature mới.

Thêm Three/R3F/Drei/Zustand/Lucide/Tailwind.

Chưa render Map.

Build phải pass.

---

## INT-04 — Tailwind isolation

- Tailwind v4 plugin;
- disable Preflight;
- scope/prefix Map style;
- không thay legacy UI visual.

Visual regression check toàn app.

---

## INT-05 — Port Map core

Port:

```text
store
types
config
scenes
Radar
TourControls
asset mock
```

Tạo:

```text
CampusMapModule.tsx
```

Không wiring MapPage vội nếu muốn check compile độc lập.

---

## INT-06 — Wire MapPage

Thay placeholder bằng lazy-loaded CampusMapModule.

Không thay content bên trái.

Test fullscreen.

---

## INT-07 — Remove standalone-only Map UI

Xác nhận integrated feature không có:

```text
InfoDrawer
LangThemeToggle
useUIStore
campus/faculty/club duplicate content
```

---

## INT-08 — Regression/mobile

Full test.

Sau PASS mới merge integration branch vào main.

---

# 34. Acceptance Criteria cho integration

## Host UI

- [ ] `/gioi-thieu` hoạt động.
- [ ] `/lien-chi` load API.
- [ ] search Liên chi hoạt động.
- [ ] modal Liên chi hoạt động.
- [ ] `/cau-lac-bo` load API.
- [ ] filter/search CLB hoạt động.
- [ ] modal CLB hoạt động.
- [ ] Header navigation hoạt động.
- [ ] Back/Forward browser hoạt động.
- [ ] Footer/layout không bị Tailwind reset.
- [ ] Mobile menu không bị phá.

## Map

- [ ] tab Bản đồ load Map 3D.
- [ ] Map rotate/zoom.
- [ ] Radar đúng.
- [ ] Hotspot dễ tap.
- [ ] Hotspot → Panorama.
- [ ] Panorama drag.
- [ ] Back restore Map.
- [ ] Tour Play/Pause/Next/Prev/Stop.
- [ ] fullscreen.
- [ ] mobile touch.
- [ ] không scroll/pull-to-refresh lỗi trong Canvas.
- [ ] no serious console error.

## Integration boundary

- [ ] Không có InfoDrawer duplicate.
- [ ] Không có VI/EN duplicate trong Map.
- [ ] Map không import backend content.
- [ ] UI không import Three internals.
- [ ] `useCampusStore` chỉ dùng trong Map feature.
- [ ] Map CSS không reset host.
- [ ] Host content CSS không làm Map controls hỏng.
- [ ] Three bundle lazy-load chỉ khi vào tab Bản đồ.

## Build

- [ ] `npm run check` PASS.
- [ ] frontend typecheck Map PASS.
- [ ] frontend build PASS.
- [ ] backend syntax check PASS.
- [ ] clean install PASS.
- [ ] `git diff --check` PASS.

---

# 35. Mobile test bắt buộc

Không chỉ DevTools.

Chạy:

```bash
npm run dev
```

Frontend Vite nếu cần expose LAN:

```text
--host
```

Điện thoại và laptop cùng Wi-Fi.

Test:

```text
Giới thiệu
→ Bản đồ
→ Map rotate
→ Hotspot
→ Panorama
→ Back
→ Tour
→ fullscreen nếu browser hỗ trợ
→ Liên chi
→ CLB
```

Quan sát:

- kích thước Map;
- gesture;
- Drawer host/modal nếu có;
- z-index;
- header;
- scroll;
- memory/lag;
- WebGL reload khi chuyển tab.

---

# 36. Route lifecycle của Map

UI hiện render theo conditional route.

Khi user rời `/ban-do`, Map sẽ unmount.

Điều này là **mong muốn** ở giai đoạn hiện tại vì:

- không để WebGL Canvas chạy ngầm khi user xem CLB;
- giải phóng GPU/resources;
- giảm CPU/battery;
- giảm memory.

Khi quay lại Map:

- Map store có thể reset nếu store module vẫn sống trong chunk/runtime;
- nhưng không cần guarantee persistence qua navigation host nếu product chưa yêu cầu.

Nếu sau này cần giữ camera khi qua tab khác rồi quay lại, chốt requirement riêng.

Không giữ Canvas hidden chỉ để preserve state.

---

# 37. Cleanup resource của Three

Trong integrated app, route switching xảy ra thường xuyên hơn standalone.

Phải verify:

- Panorama texture dispose khi unmount;
- event listener cleanup;
- timer Tour cleanup;
- OrbitControls cleanup do R3F/Drei;
- không duplicate timer khi remount;
- không giữ Canvas chạy sau khi rời tab Bản đồ.

Dùng React StrictMode vẫn bật ở host để bắt side-effect bất thường.

---

# 38. Current known warnings của Map

Snapshot Phase 1 có hai warning đã biết:

## Bundle size

Khoảng:

```text
1.1 MB minified
~300 kB gzip
```

Đây là lý do **lazy-loading Map là bắt buộc** trong unified UI.

Chưa tối ưu model/texture Phase 2.

---

## `THREE.Clock` deprecated

R3F 9.7 nội bộ có warning với Three r185.

Project Map không trực tiếp dùng `THREE.Clock`.

Hiện warning không phải blocker runtime Phase 1.

Không tự downgrade/upgrade major dependency trong integration chỉ để xóa warning này.

Sau integration ổn mới đánh giá dependency update riêng.

---

# 39. Asset lớn của UI chính

UI chính chứa nhiều content asset.

Không dùng integration Map như cơ hội cleanup toàn asset corpus.

Đây là scope khác.

Không:

- resize hàng loạt logo;
- đổi handbook;
- đổi backend data;
- xóa AI/EPS;
- thay content.

trong cùng integration PR.

Asset optimization làm task riêng sau khi integration ổn.

---

# 40. Không rewrite `App.jsx` trong integration đầu tiên

`App.jsx` hiện lớn và có nhiều responsibility.

Có thể refactor về sau.

Nhưng integration Map đầu tiên không nên đồng thời:

```text
split router
split pages
convert TypeScript
add router
redesign Header
rewrite CSS
```

Chỉ cần:

1. thêm lazy import;
2. thay nội dung placeholder `map-viewer`;
3. giữ các page khác nguyên behavior.

Sau khi hệ thống ổn mới refactor UI architecture.

---

# 41. Deployment lên miền trường sau integration

Sau khi hợp nhất trực tiếp, frontend chỉ có **một build**:

```text
frontend/dist/
```

Backend hiện tại serve build đó.

Production concept:

```text
tour.uet.vnu.edu.vn/
├── /
├── /gioi-thieu
├── /ban-do
├── /lien-chi
├── /cau-lac-bo
├── /assets/...
└── /api/...
```

Map là chunk của cùng app, không phải subdomain riêng.

Ưu điểm:

- một origin;
- một navigation;
- một deploy;
- một Header;
- một design shell;
- không iframe;
- dễ tích hợp domain trường.

Ba.js vẫn render client-side trên thiết bị người dùng.

Server không render 3D.

---

# 42. Server requirement

Hạ tầng production chủ yếu cần:

```text
static frontend
API Node hiện tại
asset delivery
CDN/object storage nếu asset map lớn
```

Không cần GPU server để render Three.js.

Khi GLB/panorama thật lớn xuất hiện, cân nhắc:

```text
CDN
object storage
cache-control
mobile/desktop asset
compression
```

Đó là Phase asset/deploy, không trộn với source integration.

---

# 43. Rollback strategy

Mỗi migration step phải commit riêng.

Nếu Map integration fail:

```bash
git switch main
```

UI chính vẫn nguyên.

Nếu React migration fail:

revert đúng commit React.

Nếu Vite migration fail:

revert đúng commit Vite.

Nếu CSS bleed:

revert Tailwind isolation commit.

Không dùng:

```text
git reset --hard
git clean -fd
force push
```

khi chưa hiểu working tree.

---

# 44. Sau khi integration branch PASS

Push:

```bash
git push -u origin integration/map3d
```

Review diff trước merge.

Merge vào main chỉ khi:

- host regression PASS;
- Map Phase 1 flow PASS;
- mobile thật PASS;
- build PASS;
- clean install PASS;
- no CSS bleed;
- lazy load PASS.

Sau merge:

```text
main = source of truth mới cho cả UI + Map.
```

Branch `map3d-phase1` giữ lại như historical snapshot/reference.

---

# 45. Cách phát triển Map độc lập sau đó

Ví dụ cần GLB thật:

```bash
git switch main
git pull --ff-only
git switch -c feature/map3d-real-campus-model
```

Chỉ sửa:

```text
frontend/src/features/campus-map/
frontend/public/assets/map3d/
frontend/package.json     # chỉ nếu thật sự cần dependency
```

UI teammate vẫn có thể làm:

```text
feature/ui-club-content
```

Nếu hai branch sửa folder khác nhau, conflict rất thấp.

Đó là independence đúng cách trong một product.

---

# 46. Rule tránh conflict giữa hai phía

## Map developer không tự sửa

```text
backend/
frontend/src/App.jsx        # trừ integration contract được duyệt
frontend/src/styles.css
frontend/public/assets/clubs
frontend/public/assets/lien-chi
```

## UI developer không tự sửa

```text
frontend/src/features/campus-map/scenes
frontend/src/features/campus-map/store
frontend/src/features/campus-map/config
```

trừ khi đã hiểu map contract.

## Shared surface nhỏ nhất

Lý tưởng chỉ có:

```text
MapPage → CampusMapModule
```

và sau này optional typed props/callback.

---

# 47. Quy tắc khi Codex/AI thực hiện integration

AI phải:

1. đọc tài liệu này;
2. inspect cả `main` và `map3d-phase1`;
3. không merge history;
4. tạo integration branch;
5. làm từng commit;
6. mỗi bước build/test;
7. không đổi content UI;
8. không thêm Router;
9. không downgrade Map dependency;
10. không dùng force/legacy peer;
11. không import Tailwind Preflight vào host;
12. không port InfoDrawer/LangThemeToggle;
13. dừng khi dependency conflict;
14. dừng khi API/UI regression;
15. dừng ở checkpoint mobile.

---

# 48. Prompt gợi ý cho Codex trên máy integration

Có thể dùng prompt sau sau khi clone repository:

```text
Đọc kỹ INTEGRATION_HANDOFF_MAP3D_UI.md trước khi sửa code.

Repository GitHub: nh-toan/uet-campus-tour.

Mục tiêu:
- giữ branch main/UI chính làm host architecture;
- port Campus Map từ origin/map3d-phase1 vào tab Bản đồ;
- cuối cùng là một React app trực tiếp, không iframe;
- Liên chi, CLB, backend và asset UI phải giữ nguyên;
- Map phải nằm trong feature boundary frontend/src/features/campus-map.

Trước tiên chỉ làm preflight:
1. git status
2. git remote -v
3. git fetch origin --prune
4. git log main
5. xác nhận origin/map3d-phase1 tồn tại
6. inspect package.json của hai branch
7. xác nhận branch histories và không merge unrelated histories.

Sau đó báo cho tôi:
- trạng thái main;
- trạng thái map3d-phase1;
- version matrix;
- implementation plan theo INT-00 → INT-08 trong tài liệu.

CHƯA sửa code ở lượt đầu tiên.

Không dùng --force, --legacy-peer-deps hoặc --allow-unrelated-histories.
Không merge donor branch vào main.
Không thay backend/content/UI ngoài scope.
```

---

# 49. Quyết định kiến trúc đã chốt trong tài liệu này

## Chốt 1

**UI chính là host application.**

## Chốt 2

**Map 3D là feature module bên trong tab Bản đồ.**

## Chốt 3

**Không iframe trong target architecture mới.**

## Chốt 4

**React target là React 19 để giữ R3F 9/Drei 10 đã được verify.**

## Chốt 5

**UI legacy chưa cần convert toàn bộ sang TypeScript.**

## Chốt 6

**Map TypeScript strict được giữ.**

## Chốt 7

**Không merge hai Git history trực tiếp. Port source có chọn lọc.**

## Chốt 8

**Không port InfoDrawer/LangThemeToggle/content duplicate từ Map.**

## Chốt 9

**Map lazy-load khi mở tab Bản đồ.**

## Chốt 10

**Tailwind Map phải được isolation để không reset UI chính.**

## Chốt 11

**Sau integration, `main` là source of truth duy nhất.**

## Chốt 12

**`map3d-phase1` trở thành historical donor snapshot.**

## Chốt 13

**Độc lập phát triển bằng feature boundary + short-lived branches, không bằng hai codebase diverge lâu dài.**

---

# 50. Definition of Done cuối cùng

Integration chỉ được coi là hoàn tất khi người dùng có thể mở **một website duy nhất** và thực hiện:

```text
Mở UET Navigator
↓
Giới thiệu hoạt động
↓
Liên chi hoạt động
↓
CLB hoạt động
↓
Bấm Bản đồ
↓
Three.js Map load trong map-viewer
↓
rotate / zoom
↓
Radar
↓
Hotspot
↓
Panorama
↓
Back
↓
Guided Tour
↓
Fullscreen
↓
quay về Liên chi / CLB
↓
không có lỗi interaction hoặc CSS bleed
```

Và về engineering:

```text
Host UI vẫn độc lập về content
Map vẫn độc lập về engine
Một dependency graph
Một frontend build
Một main branch
Một deployment
Ranh giới source rõ ràng
```

Đó là target architecture nên hướng tới.

---

# 51. Tóm tắt cực ngắn cho người tiếp quản

Nếu chỉ đọc 10 dòng, hãy nhớ:

1. `main` = UI chính.
2. `map3d-phase1` = donor snapshot Map Phase 1.
3. Không merge Git histories.
4. Tạo `integration/map3d` từ `main`.
5. Checkout donor bằng `git worktree`.
6. Nâng host lên React 19 trước.
7. Port Map vào `frontend/src/features/campus-map`.
8. Bỏ InfoDrawer/LangThemeToggle/content duplicate.
9. Lazy-load Map và isolate Tailwind.
10. Test toàn UI + Map + mobile rồi mới merge `integration/map3d` → `main`.

---

## END OF HANDOFF
