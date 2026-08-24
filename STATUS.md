# Project Status

> Cập nhật: 24/08/2026 (Asia/Bangkok). File này phản ánh source và working tree hiện tại; không phải lịch sử các task đã hoàn thành.

## Baseline hiện tại

- Git root: `/home/flamo808/uet-campus-tour/campus-tour`.
- Branch: `newest`.
- HEAD: `d99beab` — `chore(assets): remove unused source media`.
- Node/npm dùng trong session cleanup: Node `v24.15.0`, npm `11.12.1`.
- Root package: `uet-navigator@2.0.0`.
- Frontend: React `19.2.8`, Vite `8.2.0`, TypeScript `6.0.2`, Lucide React `1.31.0`.
- Backend: Node.js built-in HTTP server; dữ liệu JSON local.
- Working tree đang có thay đổi source/data/asset từ trước cleanup và chưa commit. Không reset, revert, commit hoặc push trong session này.

## Kiến trúc đang chạy

- `frontend/src/App.jsx`: app shell, navigation, route nhẹ, Intro, Liên chi và CLB.
- `frontend/src/components/YouthUnionPage.jsx`: trang Đoàn Thanh niên – Hội Sinh viên.
- `frontend/src/content/`: source of truth cho content Intro và ĐTN–HSV.
- `frontend/src/features/campus-map/ExternalVirtualTour.tsx`: wrapper iframe cho external virtual tour.
- `frontend/src/lib/api.js`: cache Promise theo API path, dedupe request đồng thời/remount và evict khi lỗi.
- `frontend/src/styles/`: token, global CSS và stylesheet scoped theo page.
- `backend/server.js`: API, validation, cache dữ liệu và production static server.
- `backend/data/lien-chi.json`: 8 Khoa/Viện; `backend/data/clubs.json`: 24 CLB.
- `frontend/public/assets/`: asset production; không xóa trong cleanup documentation.

Chi tiết cách cài, chạy, build, route và API nằm trong [`README.md`](./README.md).

## Route và UI hiện tại

| Route | Trạng thái source hiện tại |
|---|---|
| `/gioi-thieu` | Hero, nội dung chiến lược theo tab, Mission/Vision/Core values, sơ đồ tổ chức có lightbox và banner 20 năm |
| `/ban-do` | Lazy-load iframe external `uet.vnu.asia`, loading state và fallback mở cửa sổ mới |
| `/doan-thanh-nien-hoi-sinh-vien` | Hero/logo, giới thiệu, 8 Liên chi + 1 khối cán bộ, 24 CLB, 18 hoạt động có modal ảnh và Facebook CTA |
| `/lien-chi` | Search/filter, danh mục/detail, responsive detail modal và API data |
| `/cau-lac-bo` | Search/filter, danh mục/detail, responsive detail modal và API data |

- Desktop/mobile navigation dùng chung route model và hỗ trợ `pushState`/`popstate`.
- Light/Dark theme lưu trong `localStorage` với key `uet-theme`.
- Detail CLB/Liên chi dùng portal modal ở viewport hẹp; body scroll được khóa/khôi phục khi modal mở/đóng.
- Activity modal ĐTN–HSV hỗ trợ nút đóng, Escape, click backdrop, body scroll lock và focus restore.
- Các thay đổi UI hiện tại chưa được tuyên bố visual PASS trên thiết bị thật trong session cleanup này.

## Map / external virtual tour

`/ban-do` hiện dùng:

```text
https://uet.vnu.asia/?startscene=18&startlookat=-107.94,37.84,140,0,0;
```

Working tree đang xóa implementation Map Three/R3F mock cũ và đã gỡ các dependency Three/R3F/Drei/Zustand khỏi `frontend/package.json`/lockfile. Module còn lại là `ExternalVirtualTour.tsx` cùng stylesheet; TypeScript config chỉ check các file `.ts/.tsx` trong feature này.

External tour phụ thuộc availability, iframe/fullscreen policy và hiệu năng của server ngoài. Cần kiểm tra lại trên production origin, desktop và điện thoại thật trước deploy.

## API và dữ liệu

- `GET /api/lien-chi` và `GET /api/clubs` là public.
- `POST /api/lien-chi`, `PATCH /api/lien-chi/:id`, `DELETE /api/lien-chi/:id` yêu cầu header `x-admin-key`.
- Dữ liệu public được load/normalize một lần trước khi server listen và trả từ snapshot RAM có ETag.
- Mutation Liên chi được serialize; JSON được ghi qua `.tmp` rồi rename, cache chỉ publish sau khi ghi thành công.
- Frontend cache/dedupe fetch theo API path trong `frontend/src/lib/api.js`.
- JSON data hiện có thay đổi chưa commit; cleanup documentation không sửa các file này.

## Working tree cần bàn giao nguyên trạng

Các nhóm thay đổi đã tồn tại trước hoặc ngoài phạm vi cleanup:

- API/cache: `backend/server.js`, `frontend/src/App.jsx`, `frontend/src/lib/api.js`.
- Data: `backend/data/clubs.json`, `backend/data/lien-chi.json`.
- External Map cleanup: `frontend/package.json`, lockfile và deletion source Map Three/R3F cũ.
- Intro/ĐTN–HSV UI/content/asset: component, content, CSS và các ảnh/logo liên quan.
- Documentation cleanup: tạo `README.md`, rút gọn `STATUS.md`, giữ official Intro provenance và xóa docs/prototype đã hoàn thành.

Không suy diễn rằng toàn bộ working tree thuộc cùng một task/commit. Session tiếp theo phải đọc `git diff` theo từng nhóm trước khi stage hoặc commit.

## Verification

- `npm run check` — **PASS** ngày 24/08/2026: backend syntax, TypeScript check và Vite production build; 1.803 modules transformed.
- `git diff --check` — **PASS** ngày 24/08/2026 sau cleanup.
- `git status --short` — đã chụp ở báo cáo cuối cleanup; working tree vẫn dirty đúng như phần bàn giao.
- Lint — repository không có script lint.
- Automated tests — repository không có test suite/script.
- Manual checkpoint còn thiếu: regression desktop/mobile thật, Light/Dark, modal, Back/Forward, direct route và external tour trên production origin.

## TODO / risk còn hiệu lực

- Chạy và ghi nhận full manual regression trên desktop + điện thoại thật cho cả 5 route.
- Kiểm tra direct route và Back/Forward khi chạy production server.
- Nghiệm thu external iframe trên production origin: load, touch/pinch, hotspot/scene switching, fullscreen, portrait/landscape và fallback.
- Đặt `UET_ADMIN_KEY` bằng secret; bỏ hoặc khóa fallback hardcode trước production và review quyền mutation.
- Xác minh provenance/content/alt text cuối cho asset ĐTN–HSV; source hiện đã có content và ảnh nên không ghi lại việc “fill placeholder” như TODO.
- Tối ưu asset CLB lớn và quyết định chiến lược delivery/LFS/CDN nếu cần cho production.
- Kiểm tra fallback/offline behavior của Google Fonts remote.
- Bổ sung lint, automated tests và CI nếu dự án tiếp tục được vận hành dài hạn.
- Review rồi commit các nhóm working-tree change độc lập; không gộp mù toàn bộ diff.

## Documentation sau cleanup

- `README.md` — entry point cho developer: kiến trúc, setup, dev/build/start, route và API.
- `STATUS.md` — trạng thái hiện tại, working tree, verification và TODO thật.
- `docs/UET_INTRO_OFFICIAL_SOURCE.md` — provenance được `frontend/src/content/introContent.js` tham chiếu; không phải handoff/task cũ.

## Bước tiếp theo chính xác

1. Đọc `README.md`, sau đó `STATUS.md`.
2. Chạy `git status --short` và review diff theo từng nhóm; tuyệt đối không reset thay đổi hiện có.
3. Hoàn tất các manual checkpoint còn thiếu trước deploy.
4. Chỉ stage/commit theo nhóm đã review và được người dùng yêu cầu.
