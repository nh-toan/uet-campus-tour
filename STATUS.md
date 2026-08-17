# Project Status

## Baseline hiện tại
- Branch: `master`
- HEAD commit: `PRE-01: initialize project repository`
- Node/npm: Node `v24.15.0`, npm `11.12.1`
- Dependency majors chính: React 19, Vite 8, TypeScript 6 (theo scaffold React TypeScript)

## Đã hoàn thành
- [x] PRE-00 — Kiểm tra môi trường (người dùng nghiệm thu)
- [x] PRE-01 — Khởi tạo repository an toàn

## Đang làm
- Task: Không có; dừng trước P0-01.
- Mục tiêu: None.
- File liên quan: None.

## Verification
- `npm run build` — PASS
- `npm run lint` — PASS
- Kiểm tra file bắt buộc và đối chiếu ba tài liệu nguồn — PASS
- `git status --short --branch` — PASS; chỉ có scaffold và tài liệu hợp lệ trước initial commit
- Manual checkpoint còn thiếu: Không có.

## Quyết định đã chốt
- Quyết định: chỉ tạo `STATUS.md` trong root repository `campus-tour/`, không tạo ở thư mục cha.
- Lý do: người dùng xác nhận cách xử lý sau PRE-00; phù hợp vị trí repository được quy định trong PRE-01.
- Contract/file bị ảnh hưởng: `STATUS.md`.

## Blocker / known issue
- None.

## Working tree
- Clean sau commit PRE-01.

## Bước tiếp theo chính xác
- Task tiếp: P0-01 — Xác nhận baseline dependency, chỉ khi người dùng yêu cầu tiếp tục.
- Check đầu tiên: đọc `package.json` và xác nhận React major trước khi cài R3F.
- Prompt gợi ý cho Codex session tiếp: đọc `AGENTS.md` → `STATUS.md` → P0-01 trong `task.md` → tech stack trong `plan.md`, rồi đối chiếu Git.
