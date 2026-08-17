# AGENTS.md — Quy tắc làm việc với Codex
## Dự án UET Virtual Campus Tour

> Đây là **luật nền tảng của repository**. Codex phải đọc file này trước `STATUS.md`, `task.md` và `plan.md`.
> Ngôn ngữ làm việc mặc định giữa người dùng và Codex: **Tiếng Việt**.

---

## 1. Sứ mệnh

Xây dựng một Virtual Campus Tour mobile-first cho khuôn viên UET tại Hòa Lạc, phục vụ Phụ huynh và Tân sinh viên trong ngày nhập học.

Thứ tự ưu tiên:

1. Chạy đúng, có thể kiểm chứng và dễ khôi phục khi lỗi.
2. Mượt trên điện thoại Android tầm trung.
3. Kiến trúc rõ ràng, dễ debug.
4. Mock data/asset thật có thể thay thế nhau mà không phải đập lại hệ thống.
5. Người khác có thể tiếp quản codebase.
6. Giao diện chuyên nghiệp, bám nhận diện UET.
7. Tính năng nâng cao.

Trong Phase 0–1, ưu tiên **một vertical slice hoàn chỉnh với mock data/local asset** hơn là abstraction lớn hoặc production optimization chưa cần thiết.

---

## 2. Thứ tự nguồn sự thật

Trước mỗi task, Codex phải đọc theo thứ tự:

1. `AGENTS.md` — luật kỹ thuật lâu dài.
2. `STATUS.md` — trạng thái thực tế gần nhất của dự án, nếu đã tồn tại.
3. `task.md` — thứ tự thực thi, phạm vi, Acceptance Criteria và checkpoint.
4. `plan.md` — kiến trúc, product intent và lý do lựa chọn.

Nếu các file trên mâu thuẫn nhau hoặc mâu thuẫn với repository/package thực tế:

- **DỪNG trước khi sửa implementation.**
- Chỉ rõ nội dung mâu thuẫn.
- Nêu file/section/package version liên quan.
- Đề xuất phương án sửa nhỏ nhất và an toàn nhất.
- Không tự ý chọn một kiến trúc khác.

Không được “làm cho chạy được” bằng cách âm thầm đổi contract hoặc dependency major.

---

## 3. Ngôn ngữ làm việc

- Trao đổi, báo lỗi, kế hoạch task, tóm tắt diff và handoff bằng **tiếng Việt**.
- Tên biến, hàm, interface, component, file và identifier dùng tiếng Anh ngắn gọn, nhất quán.
- Commit message dùng tiếng Anh theo format task ID.
- Không dịch tên thư viện/API/thuật ngữ kỹ thuật làm mất nghĩa.

---

## 4. Tech stack cố định

Baseline của repository mới:

- React 19
- Vite
- TypeScript strict
- Three.js
- `@react-three/fiber` v9
- `@react-three/drei` v10
- Zustand
- Tailwind CSS v4 + `@tailwindcss/vite`
- Lucide React

### Quy tắc dependency

- Không thêm library nếu task hiện tại không yêu cầu hoặc người dùng chưa duyệt.
- Không dùng `--force` hoặc `--legacy-peer-deps` để che dependency conflict.
- Không tự upgrade major version trong task feature/fix.
- Luôn commit `package-lock.json`.
- Khi lockfile đã tồn tại và cần tái tạo môi trường, ưu tiên `npm ci`.
- Nếu thực sự cần dependency mới, phải báo:
  - dùng để làm gì;
  - tại sao code hiện tại không đủ;
  - ảnh hưởng runtime/bundle;
  - phương án không dùng dependency.

### Tailwind

Project dùng Tailwind CSS v4.

- Không chạy workflow legacy như `npx tailwindcss init -p`.
- Tích hợp bằng plugin Vite chính thức.
- `src/styles/tokens.css` là **single source of truth** cho màu/font thương hiệu.
- Tailwind utility phải tham chiếu token, không copy lại mã hex.

---

## 5. Cấu trúc repository bắt buộc

```text
src/
  app/            # App shell, composition, loading/error boundary
  scenes/         # Chỉ code Three.js / R3F / Drei
  store/          # Zustand stores
  components/     # UI DOM/SVG React
  config/         # Dữ liệu typed, không chứa rendering logic
  styles/         # tokens.css + global styles
  types/          # Shared TypeScript contracts
  i18n/           # VI/EN dictionaries và helper nhỏ
  assets/
    brand/
    mock/
```

### Ranh giới kiến trúc

- `components/` **KHÔNG** import `three`, `@react-three/fiber`, `@react-three/drei`.
- `config/` **KHÔNG** import React, Three.js, Zustand store, browser globals.
- `store/` không lưu object sống của Three.js như `Camera`, `Vector3`, `Texture`, `OrbitControls`.
- Shared state phải là primitive, tuple hoặc plain object dễ đọc/debug.
- `scenes/` được phép đọc config, shared types và store.
- `app/` chịu trách nhiệm ghép scene + UI và transition giữa scene.
- Không tự thêm Router, backend, CMS, event bus, service container hoặc framework kiến trúc khác trong Phase 0–1.

---

## 6. Data Contract là API nội bộ

Các file trong `src/types/` và `src/config/` được coi là API nội bộ của dự án.

- Không đổi tên field hoặc đổi đơn vị nếu chưa được task cho phép.
- Config phải export value có type rõ ràng.
- Mock data phải ghi rõ `TODO: thay bằng dữ liệu thật`.
- Không duplicate cùng một nội dung campus trong nhiều component.
- ID giữa building, hotspot, panorama và tour stop phải có quan hệ rõ ràng.

Bắt buộc có typed source of truth cho Panorama:

```text
activeSceneId
  -> panorama.config.ts
  -> PanoramaScene
  -> imageUrlMobile/imageUrlDesktop
```

Không hardcode `activeSceneId -> ảnh` bên trong `PanoramaViewer`.

---

## 7. State model bắt buộc

### 7.1 View state và Tour state là hai khái niệm khác nhau

Không dùng:

```ts
mode: "map3d" | "panorama" | "autopilot";
```

Dùng:

```ts
viewMode: "map3d" | "panorama";

tour: {
  status: "idle" | "playing" | "paused";
  currentIndex: number;
}
```

Auto-pilot là trạng thái playback, không phải một loại scene.

### 7.2 `useCampusStore`

Chứa engine/world/navigation state:

- `viewMode`
- `activeSceneId`
- `camera`
- `mapView`
- `tour`
- actions liên quan

`mapView` phải đủ để khôi phục góc nhìn map sau khi vào Panorama:

```ts
mapView: {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
```

### 7.3 `useUIStore`

Chứa presentation state:

- drawer
- lang
- theme

### 7.4 Zustand convention

- Dùng selector nhỏ, ví dụ `useCampusStore((state) => state.camera.yaw)`.
- Không subscribe toàn store nếu component chỉ cần vài field.
- Không duplicate shared state bằng local state nếu state cần tồn tại qua scene transition.
- Local state được phép cho interaction tạm thời không cần chia sẻ.
- Action phải nhỏ, deterministic và dễ đọc.

---

## 8. Quy ước tọa độ và camera

Toàn dự án dùng cùng convention:

- Three.js world: **Y-up**.
- State/config chia sẻ `yaw`, `pitch`, `fov`: dùng **degree**.
- `yaw = 0°`: nhìn theo hướng world `-Z`.
- yaw dương: quay về hướng world `+X`.
- pitch dương: nhìn lên.
- `fov`: vertical perspective FOV, đơn vị degree.

Three.js được phép dùng radian nội bộ nhưng phải convert ở boundary của scene.

RadarMinimap:

- view cone chỉ lên trên khi `yaw = 0°`;
- yaw dương làm cone quay theo chiều kim đồng hồ trên màn hình;
- Radar dùng DOM/SVG math, không import Three.js.

Không trộn degree và radian trong store/config.

---

## 9. Design system và token

`src/styles/tokens.css` là nguồn duy nhất cho brand token.

Không được:

- hardcode mã hex brand trong component;
- duplicate token ở nhiều config;
- truyền `"var(--color-tech-blue)"` trực tiếp vào Three.js material và giả định Three.js sẽ resolve CSS variable.

Khi scene cần màu brand:

- resolve CSS custom property bằng helper nhỏ ở DOM/app boundary; hoặc
- truyền string màu đã resolve vào scene/material.

Font remote có thể dùng tạm ở scaffold, nhưng trước production không để khả năng đọc UI phụ thuộc tuyệt đối vào request font bên thứ ba.

---

## 10. Quy tắc R3F/Three.js hiệu năng

Mobile performance là requirement từ đầu.

Trong `useFrame` / render loop:

- không tạo object/array/`Vector3`/`Euler` mới mỗi frame nếu có thể reuse;
- không gọi React state setter mỗi frame nếu không cần;
- không tạo broad Zustand update ở camera frequency;
- cleanup listener/timer/subscription đầy đủ.

Scene:

- Phase 1 dùng geometry đơn giản.
- Không bật shadow/post-processing nặng nếu task không yêu cầu.
- Không dùng panorama 8K–16K thật ở Phase 1.
- Không để scene inactive chạy animation loop nặng ngầm.
- Không giữ đồng thời hai Canvas nặng hoạt động chỉ để giữ state nếu chưa đánh giá trade-off.

Panorama Phase 1:

- dùng **local deterministic mock**;
- ưu tiên equirectangular test grid 2:1 có NORTH/EAST/SOUTH/WEST;
- không tự tải ảnh random từ Internet;
- scene selection phải dựa trên `panorama.config.ts`.

---

## 11. UI, touch và accessibility

- Mobile-first.
- Tap target >= 44×44 CSS px.
- UI overlay không bị Canvas nuốt pointer event.
- Dùng `z-index`, `pointer-events` có chủ đích.
- `touch-action: none` chỉ áp dụng đúng Canvas cần tương tác, không áp dụng toàn trang.
- Drawer phải scroll được trên màn hình nhỏ.
- Icon-only button phải có `aria-label`.
- Không yêu cầu hover để thao tác tính năng chính.
- Motion không thiết yếu phải tôn trọng `prefers-reduced-motion` ở bước polish.

---

## 12. TypeScript và code quality

- TypeScript strict luôn bật.
- Không dùng `any`.
- Không thêm `@ts-ignore`, `@ts-nocheck` để lách lỗi.
- Dùng `unknown` + narrowing nếu dữ liệu thật sự không rõ type.
- Function component + hooks; không class component.
- Named export cho reusable component/module.
- Type-only import khi phù hợp.
- Không magic string/magic ID trùng lặp.
- Không dead code.
- Không comment-out code thử nghiệm.
- Không để `console.log` debug trong commit.
- Không rewrite/reformat unrelated file khi task nhỏ.
- Comment giải thích **lý do/constraint**, không giải thích syntax hiển nhiên.

### YAGNI

Chỉ xây abstraction khi requirement hiện tại hoặc phase kế tiếp đã biết cần nó.

Code sạch không có nghĩa là nhiều layer.

---

## 13. Quy trình bắt buộc cho mỗi task

### Trước khi code

1. Đọc `AGENTS.md`.
2. Đọc `STATUS.md`.
3. Đọc đúng task trong `task.md`.
4. Đọc section liên quan trong `plan.md`.
5. Chạy `git status`.
6. Tóm tắt implementation plan tối đa 8 bullet.
7. Chỉ ra:
   - Acceptance Criteria verify bằng máy;
   - Acceptance Criteria cần người dùng kiểm tra 👁️.

### Sau khi code

1. Chạy check hẹp nhất liên quan.
2. Chạy quality gates đang có:
   - typecheck/build;
   - lint;
   - test liên quan nếu đã tồn tại.
3. Review `git diff`.
4. Báo:
   - file đã thay đổi;
   - hành vi đã đổi;
   - command đã chạy;
   - PASS/FAIL;
   - manual checkpoint còn lại.

Không được tự tuyên bố tiêu chí 👁️ đã đạt.

---

## 14. Khi verify thất bại

Nếu build/typecheck/lint/test lỗi:

- **DỪNG tiến sang task khác.**
- Báo command gây lỗi.
- Trích đúng lỗi quan trọng.
- Chỉ ra file/dòng nếu có.
- Chẩn đoán nguyên nhân.
- Chỉ sửa tập trung nếu lỗi rõ ràng thuộc scope task hiện tại.
- Không đoán và sửa hàng loạt file.

Warning lặp lại phải được giải thích trước khi qua task tiếp.

---

## 15. Git safety

Trước mỗi task phải hiểu working tree hiện tại.

Không được tự chạy:

```bash
git reset --hard
git clean -fd
git push --force
```

Không xóa user changes nếu chưa được phép.

### Commit convention

Một task = một commit reviewable nếu hợp lý.

Format:

```text
P0-03: configure design tokens
P1-04: add hotspot markers
```

Chỉ commit sau khi machine checks pass.

Task có checkpoint 👁️:

- verify máy trước;
- dừng chờ người dùng;
- chỉ đánh dấu hoàn thành sau khi người dùng xác nhận.

Không commit:

- secrets;
- `.env` credential;
- `node_modules`;
- cache;
- production asset lớn chưa có chiến lược Git LFS/CDN.

---

## 16. Điều kiện Codex bắt buộc DỪNG

Dừng và báo người dùng nếu:

- `task.md` và `plan.md` mâu thuẫn.
- Dependency major không tương thích.
- Command trong task không còn phù hợp với version đang cài.
- Cần đổi shared data contract ngoài scope.
- Cần thêm dependency chưa được duyệt.
- Machine check fail mà không phải lỗi nhỏ rõ ràng của task.
- Đến checkpoint 👁️.
- Thiếu asset/data và không thể tạo local mock deterministic.
- Có nguy cơ thao tác Git phá dữ liệu.
- Phải đoán về unit, ID mapping, state lifetime, coordinate hoặc persistence.

Không giấu blocker.

---

## 17. STATUS.md — bộ nhớ thật của dự án

Không phụ thuộc vào trí nhớ chat.

Nếu `STATUS.md` chưa tồn tại, tạo nó trong preflight.

Cuối mỗi session dài, trước khi đổi chat hoặc khi người dùng yêu cầu save/handoff, update:

```markdown
# Project Status

## Baseline hiện tại
- Branch:
- HEAD commit:
- Node/npm:
- Dependency majors chính:

## Đã hoàn thành
- [x] P0-...

## Đang làm
- Task:
- Mục tiêu:
- File liên quan:

## Verification
- `command` — PASS/FAIL
- Manual checkpoint còn thiếu:

## Quyết định đã chốt
- Quyết định:
- Lý do:
- Contract/file bị ảnh hưởng:

## Blocker / known issue
- None / ...

## Working tree
- Clean / file chưa commit và lý do

## Bước tiếp theo chính xác
- Task tiếp:
- Check đầu tiên:
- Prompt gợi ý cho Codex session tiếp:
```

Khi context/chat đã dài:

1. Kết thúc thay đổi nhỏ đang làm.
2. Verify.
3. Không bắt đầu task mới.
4. Update `STATUS.md`.
5. Commit nếu task thật sự hoàn thành.
6. Mở chat mới.
7. Chat mới đọc `AGENTS.md` → `STATUS.md` → `task.md` → `plan.md`.

---

## 18. Scope guard Phase 0–1

Trước khi Phase 1 được nghiệm thu, **KHÔNG** tự thêm:

- backend;
- auth;
- database;
- CMS;
- analytics SDK;
- map provider SDK;
- physics engine;
- post-processing framework;
- production compression pipeline;
- router phức tạp chỉ để chuẩn bị deep-link;
- component library lớn;
- day/night theme hoàn chỉnh;
- Phase 2+ optimization không cần để demo Phase 1.

### Mục tiêu Phase 0

Có scaffold đáng tin cậy, data contract, state model, token và R3F foundation.

### Mục tiêu Phase 1

Có một flow mock hoàn chỉnh:

```text
Map
→ Hotspot
→ Panorama
→ Back
→ Info Drawer
→ Guided Tour
→ Radar
→ Mobile checkpoint
```

Asset thật sau này phải thay được bằng config mà không viết lại interaction architecture.
