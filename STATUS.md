# Project Status

## Baseline hiện tại
- Branch: `master`
- HEAD commit: `P0-02: install project dependencies`
- Node/npm: Node `v24.15.0`, npm `11.12.1`
- Dependency majors chính: React 19, Vite 8, TypeScript 6, Three r185, R3F 9, Drei 10, Zustand 5, Tailwind CSS 4, Lucide React 1

## Đã hoàn thành
- [x] PRE-00 — Kiểm tra môi trường (người dùng nghiệm thu)
- [x] PRE-01 — Khởi tạo repository an toàn
- [x] P0-01 — Xác nhận baseline dependency
- [x] P0-02 — Cài dependencies

## Đang làm
- Task: Không có; dừng trước P0-03.
- Mục tiêu: None.
- File liên quan: None.

## Verification
- `npm run build` — PASS
- `npm run lint` — PASS
- `npm ls react three @react-three/fiber @react-three/drei zustand tailwindcss` — PASS
- Version check — PASS; React 19, R3F 9, Drei 10, Tailwind CSS 4
- npm config — PASS; `force=false`, `legacy-peer-deps=false`
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

## Blocker / known issue
- None.

## Working tree
- Clean sau commit P0-02.

## Bước tiếp theo chính xác
- Task tiếp: P0-03 — Cấu hình Tailwind v4 + brand tokens, chỉ khi người dùng yêu cầu tiếp tục.
- Check đầu tiên: đọc cấu hình Vite/CSS hiện tại và thiết lập Tailwind v4 bằng plugin Vite chính thức.
- Prompt gợi ý cho Codex session tiếp: đọc `AGENTS.md` → `STATUS.md` → P0-03 trong `task.md` → brand design system trong `plan.md`, rồi đối chiếu Git.
