# TASK.md — Kế hoạch thực thi cho Codex
## UET Virtual Campus Tour

> Codex phải đọc `AGENTS.md` → `STATUS.md` → `task.md` → section liên quan trong `plan.md`.
> Ngôn ngữ báo cáo mặc định: **Tiếng Việt**.
> File này dành cho Codex thực hiện, không phải checklist để người dùng tự code.

---

# 0. Quy tắc thực thi chung

Với **mọi task**:

1. Đọc task.
2. Đọc section liên quan trong `plan.md`.
3. Chạy `git status`.
4. Báo implementation plan tối đa 8 bullet.
5. Chỉ rõ tiêu chí:
   - máy verify được;
   - người dùng phải kiểm tra 👁️.
6. Chỉ làm đúng phạm vi task.
7. Chạy verify.
8. Review diff.
9. Nếu có 👁️: **DỪNG** chờ người dùng.
10. Khi task hoàn tất:
    - update `STATUS.md`;
    - commit theo format `[TASK_ID]: mô tả`.

Nếu build/lint/typecheck/test fail:

- DỪNG;
- báo lỗi;
- không tự chuyển task.

---

# PRE-00 — Kiểm tra môi trường

**Mục tiêu:** biết máy có đủ điều kiện khởi tạo repo.

Codex chạy:

```bash
node -v
npm -v
pwd
ls -la
```

Nếu Node không phù hợp với Vite đang dùng:

- DỪNG;
- báo version hiện tại;
- không tự cài toolchain hệ thống.

**Acceptance Criteria**

- [ ] Biết version Node/npm.
- [ ] Biết folder làm việc hiện tại.
- [ ] Không ghi đè file người dùng.

---

# PRE-01 — Khởi tạo repository an toàn

Nếu folder hiện tại đang chứa `AGENTS.md`, `plan.md`, `task.md`, **không dùng lệnh overwrite vào chính folder đó**.

Khởi tạo project trong subfolder:

```bash
npm create vite@latest campus-tour -- --template react-ts
cd campus-tour
git init
```

Sau đó bảo đảm 3 file:

```text
AGENTS.md
plan.md
task.md
```

nằm ở root repository `campus-tour/`.

Tạo `STATUS.md` theo template trong `AGENTS.md`.

**Acceptance Criteria**

- [ ] Vite React TypeScript project tồn tại.
- [ ] Git repo đã init.
- [ ] `AGENTS.md`, `plan.md`, `task.md`, `STATUS.md` ở project root.
- [ ] `git status` không có file bất thường ngoài scaffold hợp lệ.

**Commit**

```text
PRE-01: initialize project repository
```

---

# PHASE 0 — FOUNDATION

## Definition of Done

Phase 0 hoàn tất khi:

- Vite app chạy;
- dependency tương thích;
- Tailwind v4 hoạt động;
- token là source of truth;
- folder structure đúng;
- type contract đúng;
- stores đúng state model;
- mock config đủ cho Phase 1;
- R3F Canvas mount;
- i18n skeleton;
- build + lint sạch;
- Git log rõ ràng.

---

# P0-01 — Xác nhận baseline dependency

**Mục tiêu:** không để scaffold và Three/R3F lệch major.

Kiểm tra `package.json`.

Baseline mong muốn:

```text
React 19
R3F 9
Drei 10
Tailwind 4
```

Nếu React major khác baseline:

- DỪNG;
- báo người dùng trước khi cài R3F.

**Acceptance Criteria**

- [ ] React major đã xác định.
- [ ] Không có dependency conflict bị che bằng `--force`.

---

# P0-02 — Cài dependencies

Chạy:

```bash
npm install three @react-three/fiber@^9 @react-three/drei@^10 zustand lucide-react
npm install -D @types/three tailwindcss @tailwindcss/vite
```

Không cài `postcss/autoprefixer` chỉ vì task cũ từng dùng.

Không chạy:

```bash
npx tailwindcss init -p
```

**Acceptance Criteria**

- [ ] `three` có trong dependencies.
- [ ] `@react-three/fiber` major 9.
- [ ] `@react-three/drei` major 10.
- [ ] `zustand`.
- [ ] `lucide-react`.
- [ ] `tailwindcss`.
- [ ] `@tailwindcss/vite`.
- [ ] Không peer dependency error.

**Verify**

```bash
npm ls react three @react-three/fiber @react-three/drei zustand tailwindcss
npm run build
```

**Commit**

```text
P0-02: install project dependencies
```

---

# P0-03 — Cấu hình Tailwind v4 + brand tokens

Tạo:

```text
src/styles/tokens.css
src/styles/global.css
```

`tokens.css` chứa:

```css
:root {
  --color-navy-900: #0B2140;
  --color-navy-700: #14335E;
  --color-tech-blue: #2F80FF;
  --color-academic-gold: #C9A227;
  --color-cloud: #F5F7FA;
  --color-slate-500: #64748B;

  --font-display: "Be Vietnam Pro", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

Dùng Tailwind v4 Vite plugin trong `vite.config.ts`.

Trong CSS entry:

```css
@import "tailwindcss";
@import "./tokens.css";
```

Map Tailwind utility tới CSS variables bằng Tailwind v4 theme variable phù hợp.

Không duplicate hex.

Có thể import Google Fonts tạm trong `index.html`, nhưng phải có fallback.

**Acceptance Criteria**

- [ ] Tailwind v4 compile.
- [ ] 6 color token tồn tại.
- [ ] 3 font token tồn tại.
- [ ] Có thể dùng utility tương đương `bg-navy900`, `text-techBlue`, `font-display` hoặc naming đã thống nhất.
- [ ] Token utility đọc từ CSS variable, không copy hex lần hai.
- [ ] `npm run build` PASS.

**👁️ Manual**

Render tạm một block dùng màu Navy + Tech Blue để người dùng xác nhận Tailwind hoạt động.

Sau khi xác nhận, bỏ UI test tạm.

**Commit**

```text
P0-03: configure design tokens
```

---

# P0-04 — Scaffold cấu trúc thư mục

Tạo:

```text
src/
  app/
    AppShell.tsx

  scenes/
    CampusMap3D/index.tsx
    PanoramaViewer/index.tsx
    Hotspots/index.tsx

  store/
    useCampusStore.ts
    useUIStore.ts

  components/
    RadarMinimap/index.tsx
    InfoDrawer/index.tsx
    TourControls/index.tsx
    LangThemeToggle/index.tsx
    SiteHeader/index.tsx

  config/
    campus.config.ts
    faculty.config.ts
    club.config.ts
    hotspots.config.ts
    panorama.config.ts
    tour.config.ts

  styles/
    tokens.css
    global.css

  types/
    campus.types.ts

  i18n/
    vi.json
    en.json

  assets/
    brand/.gitkeep
    mock/.gitkeep
```

Stub phải build được.

**Acceptance Criteria**

- [ ] Đủ folder/file.
- [ ] `components/` không import Three.js.
- [ ] `config/` không chứa logic.
- [ ] `npm run build` PASS.

**Commit**

```text
P0-04: scaffold project structure
```

---

# P0-05 — Data Contract

Điền `src/types/campus.types.ts` theo `plan.md` mục Data Contract.

Bắt buộc đủ:

- CampusInfo
- Faculty
- Club
- Hotspot
- PanoramaScene
- TourStop

Không đổi field name.

**Acceptance Criteria**

- [ ] 6 interface tồn tại.
- [ ] Không `any`.
- [ ] TypeScript build PASS.

**Commit**

```text
P0-05: define campus data contracts
```

---

# P0-06 — Zustand stores

## `useCampusStore`

Implement đúng state model trong `plan.md`.

Giá trị khởi tạo:

```ts
viewMode: "map3d"
activeSceneId: null

camera: {
  yaw: 0,
  pitch: 0,
  fov: 75
}

mapView: {
  position: [8, 6, 8],
  target: [0, 0, 0],
  fov: 50
}

tour: {
  status: "idle",
  currentIndex: 0
}
```

Actions:

- `setViewMode`
- `setActiveScene`
- `setCamera`
- `setMapView`
- `playTour`
- `pauseTour`
- `stopTour`
- `setTourIndex`

## `useUIStore`

Khởi tạo:

```ts
drawer: {
  open: false,
  tab: "about"
}

lang: "vi"
theme: "day"
```

Actions:

- `openDrawer`
- `closeDrawer`
- `setLang`
- `setTheme`

Không lưu Three.js class instance.

**Acceptance Criteria**

- [ ] Store đúng contract.
- [ ] Partial update không xóa field cũ.
- [ ] Không `any`.
- [ ] Build PASS.

**Commit**

```text
P0-06: create application stores
```

---

# P0-07 — Mock config

Tạo typed mock data.

## `campus.config.ts`

1 CampusInfo.

## `faculty.config.ts`

2 Faculty.

## `club.config.ts`

3 Club với category khác nhau.

## `hotspots.config.ts`

3 Hotspot.

## `panorama.config.ts`

3 PanoramaScene.

Trong Phase 1, có thể cùng trỏ về một local mock panorama file, nhưng mỗi record phải có ID riêng.

## `tour.config.ts`

3 TourStop, order rõ ràng.

Tất cả mock data ghi:

```ts
// TODO: thay bằng dữ liệu thật
```

ID giữa hotspot/panorama/tour phải resolve được.

**Acceptance Criteria**

- [ ] Không có dangling `panoramaSceneId`.
- [ ] Tour `sceneId` tồn tại trong panorama config hoặc mapping hợp lệ đã định nghĩa.
- [ ] Dữ liệu typed.
- [ ] Build PASS.

**Commit**

```text
P0-07: add typed mock configuration
```

---

# P0-08 — Tạo local panorama test grid

Tạo asset mock 2:1 trong:

```text
src/assets/mock/
```

Tên gợi ý:

```text
sample-panorama-grid.svg
```

hoặc format local phù hợp mà texture loader đọc ổn.

Nội dung phải giúp nhận biết:

- NORTH
- EAST
- SOUTH
- WEST

Nếu format hỗ trợ dễ dàng, thêm ZENITH/NADIR marker.

Không tải ảnh ngẫu nhiên từ Internet.

**Acceptance Criteria**

- [ ] Asset local tồn tại.
- [ ] Tỷ lệ gần 2:1.
- [ ] Có directional marker.
- [ ] panorama config trỏ được tới asset.

**Commit**

```text
P0-08: add panorama test asset
```

---

# P0-09 — R3F Hello World

Trong `CampusMap3D`:

- render `<Canvas>`;
- perspective camera;
- một box;
- ánh sáng tối thiểu;
- OrbitControls;
- `maxPolarAngle={Math.PI / 2}`;
- box xoay chậm bằng `useFrame`.

Brand color phải lấy từ token, không hardcode hex.

Render `CampusMap3D` trong app.

**Acceptance Criteria**

- [ ] Build PASS.
- [ ] Dev server không log runtime error rõ ràng.
- [ ] Không allocation rõ ràng không cần thiết trong `useFrame`.

**👁️ Manual checkpoint bắt buộc**

Người dùng phải xác nhận:

- [ ] thấy box;
- [ ] box xoay;
- [ ] drag OrbitControls hoạt động;
- [ ] camera không xoay xuống dưới mặt đất theo cách bất thường.

**DỪNG ở đây trước task kế tiếp.**

**Commit sau khi người dùng xác nhận**

```text
P0-09: add r3f foundation scene
```

---

# P0-10 — i18n skeleton

Tạo `vi.json`, `en.json` cùng key:

```text
nav.about
nav.faculty
nav.club
tour.play
tour.pause
tour.next
tour.prev
common.back
```

Chưa cài i18n library.

Có thể dùng helper typed tối thiểu hoặc import JSON trực tiếp.

**Acceptance Criteria**

- [ ] VI/EN cùng bộ key.
- [ ] Build PASS.
- [ ] Không thêm dependency i18n.

**Commit**

```text
P0-10: add language dictionaries
```

---

# P0-11 — Phase 0 review

Không thêm feature.

Chạy:

```bash
npm run build
npm run lint
git status
git log --oneline
```

Nếu package có check khác phù hợp, chạy thêm.

Review:

- architecture boundary;
- dependency;
- token duplication;
- TypeScript;
- debug code;
- mock mapping;
- Zustand state.

**Acceptance Criteria**

- [ ] Build PASS.
- [ ] Lint PASS.
- [ ] Working tree sạch.
- [ ] P0-09 đã được người dùng xác nhận.
- [ ] `STATUS.md` được cập nhật.

**DỪNG.**

Không tự chuyển Phase 1 nếu người dùng chưa yêu cầu.

---

# PHASE 1 — MOCK INTERACTION DEMO

## Definition of Done

Flow:

```text
Map
→ Camera sync
→ Radar
→ Hotspot
→ Panorama
→ Back + restore map
→ Drawer
→ TourControls
→ Mobile touch pass
```

---

# P1-01 — Placeholder campus map

Thay Hello World box bằng:

- 3 building boxes;
- 1 ground plane;
- light;
- OrbitControls;
- min/max distance.

Building IDs phải rõ và dùng thống nhất.

Không cần model loader.

**Acceptance Criteria**

- [ ] 3 building phân biệt được.
- [ ] Ground tồn tại.
- [ ] minDistance/maxDistance hợp lý trong code.
- [ ] Build PASS.

**👁️ Manual**

- [ ] bố cục 3D nhìn được;
- [ ] rotate/zoom không khó chịu.

**Commit**

```text
P1-01: build placeholder campus map
```

---

# P1-02 — Sync camera vào CampusStore

OrbitControls change:

- đọc hướng camera;
- convert sang shared yaw/pitch degree;
- update fov;
- lưu `mapView.position`;
- lưu OrbitControls target;
- tránh update thừa nếu value gần như không đổi.

Debug overlay được phép tạm thời nhưng phải xóa trước commit.

**Acceptance Criteria**

- [ ] yaw/pitch/fov thay đổi đúng.
- [ ] mapView position/target được cập nhật.
- [ ] không infinite rerender.
- [ ] không để debug UI/log trong commit.

**👁️ Manual**

Cho phép Codex thêm debug tạm để người dùng xác nhận hướng.

Sau khi xác nhận phải xóa.

**Commit**

```text
P1-02: synchronize map camera state
```

---

# P1-03 — RadarMinimap

`components/RadarMinimap`:

- React + SVG;
- không import Three;
- đọc selector nhỏ từ CampusStore;
- hiển thị vòng radar;
- view cone;
- yaw 0 nhìn lên;
- yaw dương quay clockwise;
- cone angle phản ánh FOV.

Có thể thêm pulse/sweep nhẹ.

**Acceptance Criteria**

- [ ] Component độc lập với Three.js.
- [ ] Build PASS.
- [ ] Selector không subscribe whole store.

**👁️ Manual**

- [ ] quay map sang phải → radar quay cùng logic;
- [ ] không lệch 90°/180°;
- [ ] FOV thay đổi phản ánh hợp lý.

**Commit**

```text
P1-03: add radar minimap
```

---

# P1-04 — Hotspot markers

`scenes/Hotspots` đọc `hotspots.config.ts`.

Mỗi hotspot:

- `<Html>` marker từ Drei;
- label;
- tap target hợp lý;
- visual dùng token.

Click:

```text
setActiveScene(hotspot.panoramaSceneId)
setViewMode("panorama")
```

Không gọi UIStore nếu chưa có requirement mở drawer.

**Acceptance Criteria**

- [ ] 3 hotspot render từ config.
- [ ] Không hardcode scene mapping.
- [ ] click cập nhật đúng store.

**👁️ Manual**

- [ ] marker nằm gần đúng building;
- [ ] tap dễ trên mobile emulation.

**Commit**

```text
P1-04: add campus hotspot markers
```

---

# P1-05 — PanoramaViewer

`PanoramaViewer`:

- Canvas riêng;
- sphere nhìn từ bên trong;
- texture lấy từ `panorama.config.ts` theo `activeSceneId`;
- active scene invalid phải có fallback rõ;
- OrbitControls rotate;
- disable pan;
- zoom behavior theo MVP;
- dùng local test grid.

Không hardcode sample image trong component.

**Acceptance Criteria**

- [ ] activeSceneId lookup config.
- [ ] local texture load được.
- [ ] invalid ID không màn hình trắng.
- [ ] Build PASS.

**👁️ Manual**

- [ ] nhìn được equirectangular grid bao quanh;
- [ ] drag xoay được;
- [ ] NORTH/EAST/SOUTH/WEST theo thứ tự hợp lý;
- [ ] seam không có bug rendering bất thường.

**Commit**

```text
P1-05: add panorama viewer
```

---

# P1-06 — Map ↔ Panorama + restore camera

App shell render theo:

```text
viewMode === map3d
viewMode === panorama
```

Transition opacity khoảng 250–350ms.

Khi quay Back:

- `setViewMode("map3d")`;
- CampusMap3D mount lại từ `mapView.position`, `target`, `fov`.

Không giữ hai heavy Canvas chạy vô hạn chỉ để giữ camera.

Back button:

- >=44px;
- `aria-label`.

**Acceptance Criteria**

- [ ] transition không nháy trắng rõ ràng.
- [ ] map restore từ serializable state.
- [ ] không lưu controls ref vào Zustand.

**👁️ Manual**

1. Xoay map tới góc dễ nhận.
2. Tap hotspot.
3. Xoay panorama.
4. Back.
5. Map phải gần đúng góc trước khi vào panorama.

**Commit**

```text
P1-06: add scene transition and map restore
```

---

# P1-07 — InfoDrawer

Drawer thuần React.

Tabs:

- Về trường;
- Liên chi - Khoa;
- Câu lạc bộ.

Đọc:

- campus config;
- faculty config;
- club config.

State:

- `useUIStore`.

Mobile:

- slide bottom-up.

Desktop:

- có thể right-side panel.

Yêu cầu:

- scroll nội dung;
- tap target >=44px;
- close button có `aria-label`.

**Acceptance Criteria**

- [ ] 3 tab đọc mock data.
- [ ] Không import Three/R3F.
- [ ] UIStore hoạt động.
- [ ] Build PASS.

**👁️ Manual**

- [ ] mở/đóng mượt;
- [ ] tab chuyển đúng;
- [ ] mobile không overflow bất thường.

**Commit**

```text
P1-07: add campus info drawer
```

---

# P1-08 — TourControls

UI:

- Play/Pause;
- Next;
- Prev;
- progress.

Dữ liệu từ `tour.config.ts`.

State từ `CampusStore.tour`.

Behavior:

### Play

- `status = playing`;
- chạy từ currentIndex;
- dùng `durationMs`.

### Pause

- `status = paused`;
- không reset index.

### Play lại

- tiếp tục từ currentIndex;
- không tạo duplicate timer.

### Next/Prev

- cập nhật index;
- active scene tương ứng;
- nếu tour đang playing, timer hiện tại phải cleanup/reset đúng.

### Stop

Nếu dùng action stop:

- `idle`;
- giữ hoặc reset index theo contract đã thống nhất; không tự thay behavior giữa component.

**Acceptance Criteria**

- [ ] timer cleanup.
- [ ] bấm Play nhiều lần không nhân timer.
- [ ] Pause không về đầu.
- [ ] Next/Prev không out-of-range.
- [ ] rapid click không throw.
- [ ] Build PASS.

**👁️ Manual**

- [ ] Play chạy đúng thứ tự.
- [ ] Pause/Resume hợp lý.
- [ ] Next/Prev phản hồi ngay.

**Commit**

```text
P1-08: add guided tour controls
```

---

# P1-09 — LangThemeToggle skeleton

Hai control:

- `vi` / `en`;
- `day` / `night`.

State dùng UIStore.

Phase 1:

- state và icon/label thay đổi;
- chưa cần theme night hoàn chỉnh;
- chưa cần i18n framework.

**Acceptance Criteria**

- [ ] state đổi đúng.
- [ ] icon/label phản ánh state.
- [ ] không thêm i18n/theme dependency.

**👁️ Manual**

- [ ] người dùng nhận biết trạng thái hiện tại.

**Commit**

```text
P1-09: add language and theme controls
```

---

# P1-10 — Mobile touch pass

Canvas:

- `touch-action: none` đúng scope;
- không chặn overlay;
- z-index hợp lý.

Kiểm tra:

- Radar;
- Back;
- Drawer;
- TourControls;
- toggle.

Không làm CSS global ngăn scroll Drawer.

**Acceptance Criteria**

Machine:

- [ ] CSS/pointer layering có chủ đích.
- [ ] Build PASS.

**👁️ Manual bắt buộc**

Chrome DevTools mobile emulation:

- [ ] drag Canvas không kéo trang/pull-to-refresh bất thường;
- [ ] UI button nhận tap;
- [ ] Drawer scroll;
- [ ] không bị Canvas nuốt interaction.

**Commit**

```text
P1-10: refine mobile touch interactions
```

---

# P1-11 — Demo checkpoint Phase 1

Không thêm feature.

Chạy:

```bash
npm run build
npm run lint
git status
git log --oneline
```

Codex báo người dùng test flow:

1. mở app;
2. thấy map 3D;
3. rotate/zoom;
4. Radar sync;
5. tap hotspot;
6. Panorama hiện;
7. Back restore map;
8. Drawer 3 tab;
9. Guided Tour;
10. mobile emulation.

**Tất cả mục dưới đây là 👁️**

- [ ] Map hoạt động.
- [ ] Radar đúng hướng.
- [ ] Hotspot dễ tap.
- [ ] Panorama xoay được.
- [ ] Back restore map.
- [ ] Drawer usable.
- [ ] TourControls usable.
- [ ] Mobile interaction không lỗi lớn.

Sau khi người dùng xác nhận:

- update `STATUS.md`;
- ghi rõ Phase 1 accepted;
- không tự chuyển Phase 2.

---

# PHASE 2–6 — Chưa breakdown chi tiết

Không tự implement khi chưa có asset/data thật.

## Phase 2

Asset thật:

- GLB;
- panorama;
- logo;
- loading;
- texture selection;
- optimization.

## Phase 3

Nội dung thật.

## Phase 4

Guided tour nâng cao.

## Phase 5

QA thiết bị thật.

## Phase 6

Deploy/subdomain/integration.

---

# Handoff rule

Khi người dùng nói:

- “save lại”;
- “hết context”;
- “nghỉ hôm nay”;
- “mai làm tiếp”;

Codex phải:

1. không bắt đầu task mới;
2. chạy `git status`;
3. verify thay đổi hiện tại;
4. update `STATUS.md`;
5. chỉ commit nếu Acceptance Criteria đã đạt;
6. báo exact next step;
7. dừng.

---

# Resume rule

Khi mở session mới:

1. đọc `AGENTS.md`;
2. đọc `STATUS.md`;
3. đọc task tiếp;
4. đọc plan section;
5. chạy `git status`;
6. chạy `git log --oneline -10`;
7. đối chiếu STATUS với Git;
8. nếu lệch: dừng;
9. nếu đúng: tiếp tục đúng task kế tiếp.

Chat không phải source of truth.

**Git + STATUS.md mới là source of truth.**
