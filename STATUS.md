# Project Status

## Baseline hiện tại
- Branch: `ui/redesign`
- HEAD commit: `cd56545` (`docs: add design references and source imagery`)
- Node/npm: Node `v24.15.0`, npm `11.12.1`
- Dependency majors chính: React 19, Vite 8, Three.js 0.185, R3F 9, Drei 10, Zustand 5

## Đã hoàn thành
- [x] INT-01 → INT-08: tích hợp Campus Map 3D vào host UI (đã nghiệm thu theo `INTEGRATION_STATUS.md`)

## Đang làm
- Task: UI correction pass — background directory và header
- Mục tiêu: giữ aerial background đứng yên khi mở/đóng detail; đơn giản hóa header theo navigation mới
- File liên quan: `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/src/styles/tokens.css`

## Verification
- `npm run build` — PASS (bao gồm `typecheck:map`); còn warning chunk Map/Three >500 kB đã biết từ baseline.
- `npm --prefix frontend run typecheck:map` — PASS.
- `git diff --check` — PASS.
- HTTP smoke test `/lien-chi`, `/cau-lac-bo`, `/gioi-thieu`, `/ban-do` — PASS (200 OK).
- Manual checkpoint còn thiếu: kiểm tra background và header tại `/lien-chi`, `/cau-lac-bo`, `/gioi-thieu`, `/ban-do`.

## Quyết định đã chốt
- Quyết định: giữ nguyên route, dữ liệu và Campus Map engine; chỉ sửa markup/CSS thuộc hai hạng mục correction.
- Lý do: giới hạn phạm vi theo yêu cầu người dùng.
- Contract/file bị ảnh hưởng: không đổi data/state contract.

## Blocker / known issue
- `npm run dev` không dùng được trong môi trường hiện tại vì root dev dependency `concurrently` chưa được cài; production build và local server hiện có vẫn dùng được để smoke test.
- Firefox headless không hoàn tất screenshot; cần người dùng thực hiện checkpoint UI trực tiếp.

## Working tree
- Có thay đổi chưa commit của người dùng và correction pass trong `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/src/styles/tokens.css`; có `STATUS.md` mới và thư mục `dist/` untracked. Không commit trước khi người dùng kiểm tra UI.

## Bước tiếp theo chính xác
- Task tiếp: người dùng verify UI correction pass trên desktop/mobile.
- Check đầu tiên: mở/đóng/switch detail ở `/lien-chi` và `/cau-lac-bo`, quan sát cùng một điểm trên aerial background.
- Prompt gợi ý cho Codex session tiếp: "Đọc STATUS.md và tiếp tục verify UI correction pass, không commit trước khi tôi kiểm tra UI."
