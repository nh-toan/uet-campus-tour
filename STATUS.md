# Project Status

## Baseline hiện tại
- Branch: `master`
- HEAD commit: `P0-03: configure design tokens`
- Node/npm: Node `v24.15.0`, npm `11.12.1`
- Dependency majors chính: React 19, Vite 8, TypeScript 6, Three r185, R3F 9, Drei 10, Zustand 5, Tailwind CSS 4, Lucide React 1

## Đã hoàn thành
- [x] PRE-00 — Kiểm tra môi trường (người dùng nghiệm thu)
- [x] PRE-01 — Khởi tạo repository an toàn
- [x] P0-01 — Xác nhận baseline dependency
- [x] P0-02 — Cài dependencies
- [x] P0-03 — Cấu hình Tailwind v4 + brand tokens (người dùng nghiệm thu checkpoint 👁️)

## Đang làm
- Task: Không có; dừng trước P0-04.
- Mục tiêu: None.
- File liên quan: None.

## Verification
- `npm run build` — PASS
- `npm run lint` — PASS
- Token presence check — PASS; đủ 6 color token và 3 font token
- Brand hex duplication check trong `src/` — PASS
- Tailwind mapping check — PASS; utility map tới CSS variables bằng `@theme inline`
- Temporary UI removal check — PASS
- Manual checkpoint còn thiếu: Không có; người dùng đã xác nhận P0-03 đạt.

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

## Blocker / known issue
- None.

## Working tree
- Clean sau commit P0-03.

## Bước tiếp theo chính xác
- Task tiếp: P0-04 — Scaffold cấu trúc thư mục, chỉ khi người dùng yêu cầu tiếp tục.
- Check đầu tiên: đối chiếu cây thư mục bắt buộc và tạo các stub build được.
- Prompt gợi ý cho Codex session tiếp: đọc `AGENTS.md` → `STATUS.md` → P0-04 trong `task.md` → cấu trúc thư mục trong `plan.md`, rồi đối chiếu Git.
