# Project Status

> Cập nhật: 21/08/2026 (Asia/Bangkok). Xem báo cáo đầy đủ tại `PROJECT_SUMMARY.md`.

## Baseline hiện tại

- Branch: `ui/redesign` (tracking `origin/ui/redesign`).
- HEAD commit: `150f370` — `Refactor code structure for improved readability and maintainability`.
- Node/npm: Node `v24.15.0`, npm `11.12.1`.
- Dependency majors chính: React 19, Vite 8, TypeScript 6 (Map), Three.js r185, R3F 9, Drei 10, Zustand 5, Lucide React 1.
- Kiến trúc: React host app + feature Map TypeScript cô lập + Node HTTP backend/API.

## Đã hoàn thành

- [x] Phase 0 Foundation trên dòng Map donor.
- [x] P1-01 → P1-11 Map 3D mock demo; accepted tại `c0988b6`.
- [x] INT-01 → INT-08 tích hợp Map vào UET Navigator; accepted theo `INTEGRATION_STATUS.md`.
- [x] Lazy-load Map tại route `/ban-do`.
- [x] Content/API hiện có: 8 Khoa/Viện, 24 CLB.
- [x] UI redesign fixes đã merge vào branch `ui/redesign`.

## Đang làm

- Task: chưa có task ID chính thức trong `task.md`; dòng công việc hiện tại là UI redesign/polish sau integration.
- Mục tiêu suy ra: hoàn thiện giao diện host mà không phá Map feature, navigation, API/content và mobile regression.
- File liên quan: `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/src/styles/tokens.css`, asset UI; Map tại `frontend/src/features/campus-map/`.
- Documentation audit: đã tạo `PROJECT_SUMMARY.md` và `STATUS.md`.

## Verification

- `npm run check` — PASS ngày 21/08/2026.
- `node --check backend/server.js` — PASS (qua `npm run check`).
- `tsc -p frontend/tsconfig.map.json --noEmit` — PASS (qua frontend build).
- Vite production build — PASS, 2.359 modules transformed.
- Warning: lazy Map/Three chunk 918.65 kB minified, 246.86 kB gzip, vượt warning threshold 500 kB.
- Lint: chưa chạy vì repo không có script lint.
- Automated tests: chưa chạy vì repo không có script/test suite được khai báo.
- Manual checkpoint còn thiếu: tái kiểm tra branch redesign trên desktop + Android thật, 4 route, back/forward, theme, API/search/detail và Map flow.

## Quyết định đã chốt

- Quyết định: host app sở hữu routing, UI, backend, Khoa/Viện và CLB; Map chỉ sở hữu Three/R3F scene, camera, hotspot, panorama, radar, guided tour và spatial state.
- Lý do: giữ một app/build/deployment nhưng Map vẫn có feature boundary riêng.
- Contract/file bị ảnh hưởng: `frontend/src/App.jsx`, `frontend/src/features/campus-map/`, backend API/content.
- Quyết định: Map lazy-load chỉ tại `/ban-do`.
- Lý do: tránh tải Three bundle trên route không dùng Map.
- Quyết định integration: không port InfoDrawer, standalone i18n/theme/useUIStore; host tiếp tục sở hữu presentation/content.
- Quyết định integration: không dùng Tailwind trong bản tích hợp; dùng scoped CSS để tránh CSS bleed. Việc này khác baseline gốc và cần được ghi thành exception chính thức.

## Blocker / known issue

- Bộ `AGENTS.md`, `task.md`, `plan.md` nằm ở thư mục cha, không nằm trong Git root `campus-tour/` như PRE-01 yêu cầu.
- `task.md` chưa có task/Acceptance Criteria cho branch `ui/redesign`.
- `frontend/package-lock.json` có thay đổi chưa commit từ trước khi tạo tài liệu; lý do chưa được xác minh.
- Backend có admin key fallback hardcode, chưa production-ready.
- Map còn mock asset/toạ độ/panorama; config vẫn có TODO thay dữ liệu thật.
- Chưa có lint/test automation; Map bundle còn lớn.

## Working tree

- Không clean.
- Thay đổi có sẵn cần bảo toàn: `frontend/package-lock.json`.
- File tài liệu mới của session: `PROJECT_SUMMARY.md`, `STATUS.md`.
- Build có thể cập nhật `frontend/dist`, nhưng thư mục này không xuất hiện trong Git status hiện tại.

## Bước tiếp theo chính xác

- Task tiếp: preflight/Acceptance Criteria cho `ui/redesign`, chưa sửa implementation.
- Check đầu tiên: `git diff -- frontend/package-lock.json` và xác nhận thay đổi lockfile có chủ ý.
- Sau đó: quyết định đưa `AGENTS.md`, `task.md`, `plan.md` vào Git root bằng một commit docs riêng.
- Prompt gợi ý cho Codex session tiếp: “Đọc AGENTS.md → STATUS.md → task.md → plan.md → PROJECT_SUMMARY.md; kiểm tra lockfile diff; lập task ID và checklist nghiệm thu branch ui/redesign trước khi sửa code.”
