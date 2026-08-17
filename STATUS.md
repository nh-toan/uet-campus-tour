# Project Status

## Baseline hiện tại
- Branch: `master`
- HEAD commit: `P0-07: add typed mock configuration`
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

## Đang làm
- Task: Không có; dừng trước P0-08.
- Mục tiêu: None.
- File liên quan: None.

## Verification
- `npm run build` — PASS
- `npm run lint` — PASS
- Mock count/uniqueness/order checks — PASS
- Hotspot/panorama/tour ID relationship checks — PASS; không có dangling reference
- Config TODO/type/boundary checks — PASS; component mapping không bị sửa
- Manual checkpoint còn thiếu: Không có.

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
- Quyết định: ba panorama tạm cùng khai báo `/src/assets/mock/sample-panorama-grid.svg`.
- Lý do: P0-08 sẽ tạo local deterministic asset tại đúng vị trí này.
- Contract/file bị ảnh hưởng: `src/config/panorama.config.ts`.

## Blocker / known issue
- Asset `src/assets/mock/sample-panorama-grid.svg` chưa tồn tại; đây là phạm vi kế tiếp P0-08, không phải blocker của P0-07.

## Working tree
- Clean sau commit P0-07.

## Bước tiếp theo chính xác
- Task tiếp: P0-08 — Tạo local panorama test grid, chỉ khi người dùng yêu cầu tiếp tục.
- Check đầu tiên: tạo asset SVG 2:1 có directional marker và xác minh panorama config trỏ đúng asset.
- Prompt gợi ý cho Codex session tiếp: đọc `AGENTS.md` → `STATUS.md` → P0-08 trong `task.md` → Panorama mock trong `plan.md`, rồi đối chiếu Git.
