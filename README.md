# UET Navigator

UET Navigator là web app giới thiệu và tham quan Trường Đại học Công nghệ – ĐHQGHN tại Hòa Lạc. Ứng dụng gồm một React SPA, một Node.js HTTP server nhỏ và dữ liệu JSON local cho danh mục Liên chi/Khoa/Viện và Câu lạc bộ.

Trạng thái triển khai, thay đổi chưa commit và TODO còn hiệu lực nằm trong [`STATUS.md`](./STATUS.md).

## Kiến trúc hiện tại

```text
campus-tour/
├── backend/
│   ├── server.js                 # API, cache dữ liệu và production static server
│   └── data/
│       ├── lien-chi.json
│       └── clubs.json
├── frontend/
│   ├── public/assets/            # asset production được source tham chiếu
│   └── src/
│       ├── App.jsx               # app shell, route, Intro, Liên chi và CLB
│       ├── components/           # page/component tách riêng
│       ├── content/              # content JavaScript hiện hành
│       ├── features/campus-map/  # wrapper external virtual tour
│       ├── lib/api.js            # API client cache/dedupe request
│       └── styles/               # token và stylesheet theo page
├── tools/                        # script offline xử lý/extract asset
└── docs/                         # provenance cần giữ cho content chính thức
```

Frontend dùng React 19, Vite 8, TypeScript cho module Map và CSS thuần. Routing là route nhẹ dựa trên `location.pathname`, `history.pushState` và `popstate`; project không dùng React Router. Backend chỉ dùng module built-in của Node.js.

## Yêu cầu và cài đặt

- Node.js `^20.19.0` hoặc `>=22.12.0` (theo yêu cầu của Vite 8).
- npm.

Từ Git root:

```bash
npm ci
npm --prefix frontend ci
```

Repository có hai lockfile độc lập: root cho orchestration và `frontend/package-lock.json` cho frontend.

## Chạy development

```bash
npm run dev
```

Lệnh trên chạy đồng thời:

- backend/API tại `http://localhost:3001`;
- Vite frontend tại `http://localhost:5173`;
- proxy `/api` từ Vite sang backend.

Có thể chạy riêng bằng `npm run server` và `npm run client`.

## Build và chạy production

```bash
npm run build
UET_ADMIN_KEY='replace-with-a-secret' PORT=3001 npm start
```

`npm run build` tạo `frontend/dist/`. `npm start` khởi động `backend/server.js`, serve thư mục build và hỗ trợ SPA fallback cho các route đã khai báo. `frontend/dist/` là build artifact được ignore, không commit.

Luôn đặt `UET_ADMIN_KEY` bằng secret ở môi trường production. Source hiện vẫn có fallback development hardcode; xem rủi ro trong `STATUS.md`.

## Route chính

| Route | Nội dung |
|---|---|
| `/` | Hiển thị nội dung Giới thiệu mà không đổi URL |
| `/gioi-thieu` | Giới thiệu, định hướng phát triển và cơ cấu tổ chức UET |
| `/ban-do` | Nhúng external virtual tour từ `https://uet.vnu.asia` |
| `/doan-thanh-nien-hoi-sinh-vien` | Đoàn Thanh niên – Hội Sinh viên và hoạt động nổi bật |
| `/lien-chi` | Danh mục/detail 8 Khoa/Viện, search và filter |
| `/cau-lac-bo` | Danh mục/detail 24 Câu lạc bộ, search và filter |

`/ban-do` lazy-load `frontend/src/features/campus-map/ExternalVirtualTour.tsx`. Iframe hiện trỏ tới:

```text
https://uet.vnu.asia/?startscene=18&startlookat=-107.94,37.84,140,0,0;
```

Tour là dịch vụ ngoài repository. Việc embed/fullscreen phụ thuộc availability và iframe policy của `uet.vnu.asia`; UI có loading state và link mở tour trong cửa sổ mới.

## API hiện tại

| Method | Endpoint | Quyền | Chức năng |
|---|---|---|---|
| `GET` | `/api/lien-chi` | Public | Trả danh sách Liên chi/Khoa/Viện |
| `POST` | `/api/lien-chi` | `x-admin-key` | Tạo mục mới |
| `PATCH` | `/api/lien-chi/:id` | `x-admin-key` | Cập nhật một mục |
| `DELETE` | `/api/lien-chi/:id` | `x-admin-key` | Xóa một mục |
| `GET` | `/api/clubs` | Public | Trả danh sách Câu lạc bộ |

Hai GET public dùng snapshot RAM, `ETag` và `Cache-Control: public, no-cache`. Mutation Liên chi được serialize, validate và ghi `backend/data/lien-chi.json` qua temporary file rồi rename; cache chỉ đổi sau khi ghi thành công. Không có mutation API cho CLB.

## Kiểm tra

```bash
npm run check
git diff --check
git status --short
```

`npm run check` gồm syntax check backend, TypeScript check cho module Map và Vite production build. Repository hiện chưa có script lint hoặc automated test suite.

## Documentation giữ lại

- [`README.md`](./README.md): kiến trúc, vận hành, route, API và production start.
- [`STATUS.md`](./STATUS.md): trạng thái source/working tree, verification và TODO thật còn lại.
- [`docs/UET_INTRO_OFFICIAL_SOURCE.md`](./docs/UET_INTRO_OFFICIAL_SOURCE.md): snapshot/provenance nội dung chính thức mà `frontend/src/content/introContent.js` tham chiếu.
