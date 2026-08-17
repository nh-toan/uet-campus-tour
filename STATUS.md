# Project Status

## Baseline hiện tại
- Branch: `master`
- HEAD commit: `P0-01: confirm dependency baseline`
- Node/npm: Node `v24.15.0`, npm `11.12.1`
- Dependency majors chính: React 19, Vite 8, TypeScript 6 (theo scaffold React TypeScript)

## Đã hoàn thành
- [x] PRE-00 — Kiểm tra môi trường (người dùng nghiệm thu)
- [x] PRE-01 — Khởi tạo repository an toàn
- [x] P0-01 — Xác nhận baseline dependency

## Đang làm
- Task: Không có; dừng trước P0-02.
- Mục tiêu: None.
- File liên quan: None.

## Verification
- `npm run build` — PASS
- `npm run lint` — PASS
- `npm ls --depth=0` — PASS; dependency tree hợp lệ
- `npm ls react react-dom` — PASS; React và React DOM cùng version `19.2.8`
- npm config — PASS; `force=false`, `legacy-peer-deps=false`
- Manual checkpoint còn thiếu: Không có.

## Quyết định đã chốt
- Quyết định: chỉ tạo `STATUS.md` trong root repository `campus-tour/`, không tạo ở thư mục cha.
- Lý do: người dùng xác nhận cách xử lý sau PRE-00; phù hợp vị trí repository được quy định trong PRE-01.
- Contract/file bị ảnh hưởng: `STATUS.md`.
- Quyết định: giữ baseline React 19 từ scaffold; chưa cài dependency của P0-02.
- Lý do: React `19.2.8` đúng baseline và dependency tree không có conflict.
- Contract/file bị ảnh hưởng: `package.json`, `package-lock.json` (chỉ kiểm tra, không sửa).

## Blocker / known issue
- None.

## Working tree
- Clean sau commit P0-01.

## Bước tiếp theo chính xác
- Task tiếp: P0-02 — Cài dependencies, chỉ khi người dùng yêu cầu tiếp tục.
- Check đầu tiên: chạy đúng hai lệnh cài dependency trong P0-02, không dùng force flags.
- Prompt gợi ý cho Codex session tiếp: đọc `AGENTS.md` → `STATUS.md` → P0-02 trong `task.md` → tech stack trong `plan.md`, rồi đối chiếu Git.
