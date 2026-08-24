# UET Navigator

UET Navigator là ứng dụng read-only giới thiệu và tham quan Trường Đại học Công nghệ – ĐHQGHN tại Hòa Lạc. Bản production gồm React/Vite SPA, Node.js HTTP server, hai JSON snapshot local và media được phân phối từ Cloudflare R2.

Nội dung giới thiệu được biên tập từ [nguồn chính thức của UET](https://uet.vnu.edu.vn/gioi-thieu/?tab=tab-5); dữ liệu Liên chi và Câu lạc bộ nằm trong `backend/data`.

## Architecture

```text
Browser
  → Cloudflare CDN/WAF
    → Node.js: SPA + read-only JSON API
  → Cloudflare R2: versioned content media
```

- Frontend: React 19, Vite 8, History API routing.
- Backend: Node.js built-in modules; không database, auth, admin, upload hoặc mutation API.
- Media: `r2-media-manifest.json` là source of truth cho source key, versioned object key, SHA-256, kích thước và trạng thái verification.
- Tooling: `tools/` hỗ trợ tạo manifest, upload media mới/thay đổi, verify R2 và load-test release.

## Install and development

Yêu cầu Node.js `^20.19.0` hoặc `>=22.12.0` và npm.

```bash
npm ci
npm --prefix frontend ci
source ~/.config/uet-navigator/r2.env
npm run dev
```

Backend chạy tại `http://127.0.0.1:3001`; Vite chạy tại `http://localhost:5173` và proxy `/api` sang backend. `VITE_MEDIA_BASE_URL` là public HTTPS base URL bắt buộc cho development và build; repository không còn local runtime-media fallback.

## Build and start

```bash
source ~/.config/uet-navigator/r2.env
npm run build
NODE_ENV=production HOST=127.0.0.1 PORT=3001 npm start
```

`VITE_MEDIA_BASE_URL` phải được giữ trong runtime environment để backend đưa đúng media origin vào CSP. `PORT` mặc định là `3001`, `HOST` mặc định là `127.0.0.1`; chỉ bind `0.0.0.0` sau reverse proxy hoặc trên private network. Build không copy `frontend/public`, không sinh source map và chỉ chứa JS/CSS production.

## Routes and API

SPA phục vụ `/`, `/gioi-thieu`, `/ban-do`, `/doan-thanh-nien-hoi-sinh-vien`, `/lien-chi` và `/cau-lac-bo`.

| Method | Endpoint | Behavior |
|---|---|---|
| `GET`, `HEAD` | `/api/lien-chi` | Read-only startup snapshot |
| `GET`, `HEAD` | `/api/clubs` | Read-only startup snapshot |

Mọi `POST`, `PUT`, `PATCH` và `DELETE` trả `405` với `Allow: GET, HEAD`; server không đọc request body hoặc ghi dữ liệu.

## R2 media workflow

Current acceptance/UAT uses the official temporary `r2.dev` URL. It is not the final public-production domain.

Để thêm hoặc thay media:

1. Đặt source mới tại `frontend/public/assets/<source-key>` và cập nhật content/data dùng source key đó.
2. Chạy `npm run media:manifest`; tool giữ các remote-only object đã verify và đánh dấu source mới/thay đổi là pending.
3. Nạp upload environment từ local secret store, rồi chạy `npm run media:upload`. Uploader chỉ xử lý pending local sources, xác minh SHA-256 và đặt cache metadata immutable.
4. Chạy `npm run media:verify`; verifier kiểm tra toàn bộ runtime object và cập nhật trạng thái manifest khi tất cả đều hợp lệ.
5. Build với cùng `VITE_MEDIA_BASE_URL`, chạy visual regression, rồi xóa local source đã verify và chạy lại `npm run media:manifest`.

Không đặt R2 write credentials hoặc token trong repository, biến `VITE_*` hay frontend bundle. `~/.config/uet-navigator/r2.env` là file local, đã nằm ngoài repository và không được stage.

## Security and caching

- CSP chỉ cho resource origins cần thiết; security headers gồm `nosniff`, Referrer Policy, Permissions Policy, clickjacking protection và HSTS trong production.
- Static path được resolve bên trong `frontend/dist`; traversal và path không hợp lệ bị từ chối.
- API được validate và nạp vào RAM một lần trước khi listen, dùng ETag và `Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400`.
- `index.html` dùng `no-cache`; hashed JS/CSS dùng `public, max-age=31536000, immutable`.
- R2 object dùng versioned key, SHA-256 verification và immutable one-year caching.

## Verification

```bash
source ~/.config/uet-navigator/r2.env
npm run media:verify
npm run build
npm run check
npm audit --omit=dev
git diff --check
```

Smoke-test tất cả SPA route, `GET`/`HEAD` trên hai API và xác nhận mutation methods trả `405`. Có thể chạy local load regression sau khi start server:

```bash
LOAD_TEST_BASE_URL=http://127.0.0.1:3001 npm run load:test
```

## Production deployment note

Before final public deployment:

- attach official R2 Custom Domain;
- set `VITE_MEDIA_BASE_URL` to that domain;
- verify 164/164 again;
- rebuild and deploy.

Không hardcode domain thay thế. `r2.dev` chỉ dành cho staging/UAT hiện tại.
