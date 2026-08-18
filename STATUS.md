# Project Status

## Baseline hiện tại
- Branch: `master`
- HEAD commit: `P1-02: synchronize map camera state`
- Node/npm: Node `v24.15.0`, npm `11.12.1`
- Dependency majors chính: React 19, Vite 8, TypeScript 6, Three r185, R3F 9, Drei 10, Zustand 5, Tailwind CSS 4, Lucide React 1

## Đã hoàn thành
- [x] PRE-00 — Kiểm tra môi trường (người dùng nghiệm thu)
- [x] PRE-01 — Khởi tạo repository an toàn
- [x] P0-01 — Xác nhận baseline dependency
- [x] P0-02 — Cài dependencies
- [x] P0-03 — Cấu hình Tailwind v4 + brand tokens (người dùng nghiệm thu checkpoint 👁️)
- [x] P0-04 — Scaffold cấu trúc thư mục
- [x] P0-05 — Data Contract
- [x] P0-06 — Zustand stores
- [x] P0-07 — Mock config
- [x] P0-08 — Local panorama test grid
- [x] P0-09 — R3F Hello World (người dùng nghiệm thu checkpoint 👁️)
- [x] P0-10 — i18n skeleton
- [x] P0-11 — Phase 0 review
- [x] P1-01 — Placeholder campus map (người dùng nghiệm thu checkpoint 👁️)
- [x] P1-02 — Sync camera vào CampusStore (người dùng nghiệm thu checkpoint 👁️)

## Đang làm
- Task: Không có; P1-02 đã hoàn tất và đang dừng trước P1-03.
- Mục tiêu: None.
- File liên quan: None.

## Verification
- `npm run build` — PASS tại P0-11; chỉ lặp lại cảnh báo chunk R3F/Three đã biết
- `npm run lint` — PASS tại P0-11
- Dependency tree/baseline majors — PASS; direct runtime dependencies đúng tập đã duyệt, scaffold dev tooling hợp lệ và không có peer dependency error
- Architecture boundary scan — PASS; `components/`, `config/`, `store/` không có import/object bị cấm
- Brand token duplication scan — PASS; sáu brand hex chỉ tồn tại trong `src/styles/tokens.css`
- TypeScript strict-mode audit — PASS; effective config xác nhận `strict: true` trong cả `tsconfig.app.json` và `tsconfig.node.json`, build strict không phát sinh lỗi
- Debug/suppression scan — PASS; không có `console.log`, `console.debug`, `debugger`, `@ts-ignore`, `@ts-nocheck`
- Mock mapping check — PASS; 3 hotspot và 3 tour stop đều resolve tới panorama, building ID khớp, order là 1 → 2 → 3
- Zustand runtime contract check — PASS; defaults, partial merge, tour semantics và UI actions đúng
- i18n VI/EN key parity check — PASS; đủ 8 key bắt buộc
- R3F structure/useFrame allocation check — PASS
- Brand token boundary/hardcoded color check — PASS
- Vite dev server + module transform — PASS; không có runtime error rõ ràng
- P1-01 TypeScript check `npx tsc -p tsconfig.app.json --noEmit --pretty false` — PASS
- P1-01 `npm run build` — PASS; chỉ lặp lại cảnh báo chunk R3F/Three đã biết
- P1-01 `npm run lint` — PASS
- P1-01 `git diff --check` — PASS
- P1-02 TypeScript check `npx tsc -p tsconfig.app.json --noEmit --pretty false` — PASS
- P1-02 camera formula check — PASS; `-Z → yaw 0°`, `+X → yaw +90°`, nhìn lên → pitch dương
- P1-02 `npm run build` — PASS; chỉ lặp lại cảnh báo chunk R3F/Three đã biết
- P1-02 `npm run lint` — PASS
- P1-02 debug/suppression scan và `git diff --check` — PASS
- Manual checkpoint còn thiếu: Không có; người dùng xác nhận camera state thay đổi liên tục khi orbit/zoom, pitch âm hơn khi nâng camera cao hơn quanh target và yaw thay đổi theo hai chiều orbit.

## Quyết định đã chốt
- Quyết định: chỉ tạo `STATUS.md` trong root repository `campus-tour/`, không tạo ở thư mục cha.
- Lý do: người dùng xác nhận cách xử lý sau PRE-00; phù hợp vị trí repository được quy định trong PRE-01.
- Contract/file bị ảnh hưởng: `STATUS.md`.
- Quyết định: giữ baseline React 19 từ scaffold trước khi cài dependency 3D.
- Lý do: React `19.2.8` đúng baseline và dependency tree không có conflict.
- Contract/file bị ảnh hưởng: `package.json`, `package-lock.json` (chỉ kiểm tra, không sửa).
- Quyết định: cài đúng tám dependency trực tiếp được quy định trong P0-02; không dùng force flags hoặc Tailwind legacy workflow.
- Lý do: hoàn thiện tech stack cố định cho các task Phase 0 tiếp theo.
- Contract/file bị ảnh hưởng: `package.json`, `package-lock.json`.
- Quyết định: utility thương hiệu dùng namespace `uet` và ánh xạ tới token bằng `@theme inline`.
- Lý do: giữ `tokens.css` là source of truth, tránh trùng tên/circular reference với raw token bắt buộc.
- Contract/file bị ảnh hưởng: `src/styles/tokens.css`, `src/styles/global.css`.
- Quyết định: scaffold dùng named component stub và module rỗng; `App` chỉ ghép `AppShell`.
- Lý do: xác lập đúng boundary mà không triển khai sớm data contract, store hoặc feature logic.
- Contract/file bị ảnh hưởng: cây thư mục bắt buộc dưới `src/`, `src/App.tsx`, `src/main.tsx`.
- Quyết định: định nghĩa nguyên vẹn sáu interface theo Data Contract trong `plan.md`, không thêm type/helper phụ.
- Lý do: giữ shared contract đúng phạm vi P0-05 và ổn định cho config/store ở các task sau.
- Contract/file bị ảnh hưởng: `src/types/campus.types.ts`.
- Quyết định: `stopTour()` đặt `status: "idle"` và reset `currentIndex` về `0`; `pauseTour()` giữ nguyên `currentIndex`.
- Lý do: người dùng xác nhận contract trước khi triển khai P0-06.
- Contract/file bị ảnh hưởng: `src/store/useCampusStore.ts`.
- Quyết định: partial update của `camera`, `mapView`, `tour` và drawer dùng immutable merge để giữ field không được cập nhật.
- Lý do: đáp ứng state contract và tránh làm mất nested state.
- Contract/file bị ảnh hưởng: `src/store/useCampusStore.ts`, `src/store/useUIStore.ts`.
- Quyết định: dùng ba building ID `building-gate`, `building-academic`, `building-library` và ba panorama ID tương ứng làm mapping mock thống nhất.
- Lý do: đảm bảo hotspot, panorama và tour resolve trực tiếp qua typed config.
- Contract/file bị ảnh hưởng: sáu file trong `src/config/`.
- Quyết định tại P0-07: ba panorama tạm cùng khai báo `/src/assets/mock/sample-panorama-grid.svg`.
- Lý do: dành sẵn target cho local deterministic asset của P0-08 trước khi chuyển sang static import.
- Contract/file bị ảnh hưởng: `src/config/panorama.config.ts`.
- Quyết định: panorama config dùng static import tới SVG local `1600×800` có grid, horizon, seam và sáu directional marker.
- Lý do: Vite resolve/bundle URL ổn định và asset hỗ trợ kiểm tra orientation/distortion trong Phase 1.
- Contract/file bị ảnh hưởng: `src/assets/mock/sample-panorama-grid.svg`, `src/config/panorama.config.ts`.
- Quyết định: resolve `--color-tech-blue` tại `AppShell` bằng DOM API rồi truyền giá trị màu đã resolve vào `CampusMap3D`.
- Lý do: giữ brand token là source of truth và không truyền CSS variable trực tiếp cho Three.js material.
- Contract/file bị ảnh hưởng: `src/app/AppShell.tsx`, `src/scenes/CampusMap3D/index.tsx`.
- Quyết định: P0-10 chỉ dùng hai JSON dictionary có cùng cấu trúc lồng `nav`/`tour`/`common`, không thêm helper hay i18n dependency.
- Lý do: đáp ứng skeleton hiện tại với phạm vi nhỏ nhất; chưa có consumer cần abstraction dịch thuật.
- Contract/file bị ảnh hưởng: `src/i18n/vi.json`, `src/i18n/en.json`.
- Quyết định: bật `strict: true` trực tiếp trong cả hai TypeScript project config tại P0-11.
- Lý do: khôi phục đúng baseline TypeScript strict đã quy định; code Phase 0 hiện tại compile sạch nên không cần đổi implementation hoặc contract.
- Contract/file bị ảnh hưởng: `tsconfig.app.json`, `tsconfig.node.json`.
- Quyết định: xóa ba asset scaffold không dùng `hero.png`, `react.svg`, `vite.svg` sau khi xác nhận không còn reference.
- Lý do: loại bỏ dead asset mà không thay đổi runtime behavior hoặc thêm feature.
- Contract/file bị ảnh hưởng: `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`.
- Quyết định: P1-01 lấy building ID và vị trí X/Z trực tiếp từ `hotspots.config.ts`; ba mesh dùng kích thước khác nhau và `mesh.name` bằng `buildingId`.
- Lý do: giữ config hiện có là source of truth cho ba ID, đồng thời tạo placeholder map phân biệt được mà không thêm building contract hoặc model loader.
- Contract/file bị ảnh hưởng: `src/scenes/CampusMap3D/index.tsx`.
- Quyết định: resolve bốn brand token tại `AppShell`, truyền màu đã resolve vào scene; OrbitControls giới hạn khoảng cách `7–24` và giữ polar constraint trên ground.
- Lý do: phân biệt building/ground, tuân thủ token boundary và giữ thao tác rotate/zoom dễ kiểm soát.
- Contract/file bị ảnh hưởng: `src/app/AppShell.tsx`, `src/scenes/CampusMap3D/index.tsx`.
- Quyết định: đồng bộ camera qua OrbitControls `onChange`; hướng camera được đổi sang yaw/pitch degree bằng `atan2(direction.x, -direction.z)` và `asin(direction.y)`.
- Lý do: tuân thủ convention yaw `0° = -Z`, yaw dương về `+X`, pitch dương nhìn lên tại boundary Three.js → shared state.
- Contract/file bị ảnh hưởng: `src/scenes/CampusMap3D/index.tsx`, không đổi store contract.
- Quyết định: dùng epsilon riêng cho angle, position và FOV; đọc snapshot bằng `useCampusStore.getState()` rồi chỉ gọi `setCamera`/`setMapView` khi giá trị thay đổi đáng kể.
- Lý do: tránh update thừa ở camera frequency, không subscribe broad state trong scene và chỉ cấp phát tuple update khi cần.
- Contract/file bị ảnh hưởng: `src/scenes/CampusMap3D/index.tsx`.

## Blocker / known issue
- Build cảnh báo chunk R3F/Three khoảng 1,088 kB minified (khoảng 299 kB gzip); chưa tối ưu trong P0-09 vì ngoài scope Phase 0 foundation.
- Runtime dev warning: R3F `9.7.0` nội bộ dùng `THREE.Clock`, API đã deprecated trong Three r185; code dự án không trực tiếp dùng `Clock`, scene vẫn hoạt động đúng.

## Working tree
- Clean sau commit P1-02.

## Bước tiếp theo chính xác
- Task tiếp: P1-03 — RadarMinimap, chỉ khi người dùng yêu cầu bắt đầu.
- Check đầu tiên: đối chiếu `STATUS.md` với Git, đọc P1-03 và section Radar/camera convention liên quan trong `plan.md`.
- Prompt gợi ý cho Codex session tiếp: đọc nguồn sự thật, xác nhận P1-02 đã nghiệm thu và thực hiện đúng P1-03; dừng tại mọi blocker hoặc checkpoint được quy định.
