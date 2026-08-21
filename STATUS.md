# Project Status

> Cập nhật: 21/08/2026 (Asia/Bangkok). Tài liệu này đã được đối chiếu với source, Git và các spec hiện có trước handoff. `PROJECT_SUMMARY.md` mô tả kiến trúc/bối cảnh lịch sử; file này là nguồn trạng thái hiện hành.

## Baseline hiện tại

- Branch handoff: `newest`, được tạo từ baseline `c9988ea` sau khi xác nhận không có local branch hoặc `origin/newest`.
- Base trước commit handoff: `c9988ea` — `checkpoint: external tour integration before map cleanup`.
- Remote: `origin`; tuyệt đối không force-push.
- Node/npm đã dùng để verify: Node `v24.15.0`, npm `11.12.1`.
- Stack đang được version-control giữ lại: React 19, Vite 8, TypeScript 6, Lucide React 1, Three.js, React Three Fiber, Drei và Zustand.
- Kiến trúc host: React JSX, route nhẹ bằng `location.pathname` + `history.pushState` + `popstate`, CSS/token semantic, Node HTTP backend/API.
- `/ban-do` lazy-load `ExternalVirtualTour` tới tour ngoài; source/dependency Map Three/R3F cũ vẫn được giữ trong commit cho tới khi có quyết định cleanup chính thức.

## Những phần UI đã hoàn thành và được nghiệm thu

- [x] Host shell/navigation responsive và Light/Dark hiện tại.
- [x] `/gioi-thieu` redesign theo presentation chính thức: hero, số liệu, khối chiến lược, sứ mệnh/tầm nhìn/giá trị, sơ đồ tổ chức có lightbox và phần kết banner 20 năm.
- [x] Layout organization chart và banner 20 năm hiện tại; không redesign lại nếu không có yêu cầu mới.
- [x] `/lien-chi`: trang danh mục/detail hiện tại, search/filter, dữ liệu backend và admin editing flow hiện có.
- [x] `/cau-lac-bo`: trang danh mục/detail hiện tại, search/filter và dữ liệu 24 CLB hiện có.
- [x] `/doan-thanh-nien-hoi-sinh-vien`: route, desktop/mobile navigation, skeleton, responsive Light/Dark và các CTA nội bộ.
- [x] Fine-tune ĐTN–HSV đã duyệt: Liên chi và CLB là editorial text block full-width, không ảnh/icon/card grid; divider mảnh; Liên chi 2 cột desktop/1 cột mobile; CTA tới `/lien-chi` và `/cau-lac-bo`.
- [x] Phase 0 Foundation và Map 3D mock Phase 1 đã được accept tại `c0988b6`.
- [x] INT-01 → INT-08 tích hợp Map vào host đã được accept theo `INTEGRATION_STATUS.md`.

Nghiệm thu visual hiện tại không thay thế regression trước production: desktop rộng, mobile thật, Light/Dark và browser navigation vẫn phải chạy lại ở checklist FINAL.

## `/gioi-thieu` redesign hiện tại

- Runtime chính: `frontend/src/App.jsx` và `frontend/src/styles.css`.
- Content chính thức: `frontend/src/content/introOfficialContent.js`; source snapshot/provenance nằm trong tài liệu Intro đã có ở repository.
- Visual spec: `UET_INTRO_REDESIGN_SPEC.md`.
- Prototype bàn giao: `uet-intro-redesign-vibe.html`; không phải runtime production.
- Asset chính nằm tại `frontend/public/assets/intro/`; banner kết trang là `uet-20-years-banner.webp`.
- Presentation/layout hiện tại đã chốt. Chỉ sửa khi có lỗi regression, sai nội dung chính thức hoặc yêu cầu mới rõ ràng.

## ĐTN–HSV — route, skeleton và content contract

```text
Route /doan-thanh-nien-hoi-sinh-vien: DONE
Navigation desktop/mobile: DONE
Responsive + Light/Dark skeleton: DONE
Visual skeleton/gateway layout: ACCEPTED

Official handbook content: TODO
Official logos: TODO
Hero photo: TODO
Liên chi official names/text: TODO
CLB official overview text: TODO
11 activity images: TODO
11 activity descriptions: TODO
Source snapshot handbook: TODO
Final content QA: TODO
```

Các file/path bàn giao:

- `UET_DTN_HSV_PAGE_PLAN.md` — visual/product plan đã duyệt.
- `uet-dtn-hsv-base.html` — prototype tham chiếu, không phải runtime production.
- `frontend/src/components/YouthUnionPage.jsx` — layout/UI skeleton.
- `frontend/src/content/youthUnionContent.js` — source of truth để fill text/ảnh; giữ architecture này.
- `frontend/src/styles/youth-union.css` — style scoped, responsive và Light/Dark.
- `frontend/public/assets/youth-union/` — contract thư mục `hero/`, `activities/`, `logos/`; hiện chỉ có `.gitkeep`.

Skeleton hiện có:

- Hero, overview `8 / +1 / 24`, 11 activity placeholder và Facebook CTA.
- Liên chi gateway text-only: `Liên chi 01` … `Liên chi 08` + `Cán bộ khối Hiệu bộ`, 2 cột desktop/1 cột mobile, CTA `/lien-chi`.
- CLB gateway text-only: một dòng 6 lĩnh vực hoạt động lấy từ config, CTA `/cau-lac-bo`; không render lại 24 CLB.
- Không fill content thật và không tạo asset giả trong skeleton.

## Source bắt buộc cho nội dung ĐTN–HSV

Handbook:

```text
https://heyzine.com/flip-book/2003ae890b.html#page/9
```

Facebook chính thức:

```text
https://www.facebook.com/DTNHSV.UET.VNU
```

Trước khi fill production content, tạo `docs/UET_DTN_HSV_OFFICIAL_SOURCE.md` ghi URL, ngày truy xuất, nguyên văn liên quan và provenance của từng asset. Không invent tên đơn vị, mô tả hoặc ảnh nếu handbook/source chính thức không support.

## Navigation và route hiện tại

Navigation chính theo source:

```text
/gioi-thieu
/ban-do
/doan-thanh-nien-hoi-sinh-vien
/lien-chi
/cau-lac-bo
```

- Desktop và mobile dùng cùng route model; browser history được xử lý bằng `pushState`/`popstate`.
- Backend SPA fallback đã khai báo đủ 5 route trên.
- Browser Back/Forward và direct-route production server vẫn thuộc regression FINAL.

## `/lien-chi` và `/cau-lac-bo`

- Hai trang chuyên biệt vẫn là nơi render danh sách/detail đầy đủ; trang ĐTN–HSV chỉ đóng vai trò gateway.
- `/lien-chi` dùng API `/api/lien-chi`, dữ liệu JSON và asset liên quan trong repository.
- `/cau-lac-bo` dùng API `/api/clubs`, hiện có dữ liệu 24 CLB.
- Không chuyển list/card đầy đủ vào trang ĐTN–HSV và không redesign hai trang này trong task content ĐTN–HSV.

## Map / External Virtual Tour

External target hiện tại:

```text
https://uet.vnu.asia/?startscene=18&startlookat=-107.94,37.84,140,0,0;
```

- `frontend/src/features/campus-map/ExternalVirtualTour.tsx` có wrapper loading/fallback và được lazy-load từ `/ban-do`.
- Đây mới là implementation/proof; **không ghi DONE cho production Map**.
- Còn thiếu: production iframe integration acceptance, frame policy trên production origin, desktop/mobile thật, touch/pinch/hotspot/scene switching, fullscreen, portrait/landscape và browser Back.
- Source Map Three/R3F cũ và dependency tương ứng vẫn còn trong baseline commit để có đường phục hồi.
- Working tree sau handoff có thể còn các deletion source Map cũ cùng diff `package.json`/`package-lock.json` từ cleanup thử nghiệm; chúng được cố ý giữ ngoài commit này.
- Chỉ cleanup Three/R3F sau khi external tour qua acceptance và có quyết định rõ ràng.

## Verification của handoff

- `npm run check` — **PASS** ngày 21/08/2026: backend syntax, TypeScript check và Vite production build; 1.802 modules transformed.
- Build output: host JS 243,77 kB (76,25 kB gzip), CSS 61,57 kB (11,87 kB gzip), external-tour chunk 1,13 kB (0,57 kB gzip).
- `git diff --check` — **PASS** sau khi kiểm tra toàn bộ staged/uncommitted diff.
- Lint — repository chưa có script lint.
- Automated tests — repository chưa có test suite/script.
- Production server smoke — còn phải chạy với môi trường cho phép bind port và kiểm tra direct URL.

## Known issues / risks

- External iframe phụ thuộc availability, frame/fullscreen policy và hiệu năng server bên thứ ba.
- Backend vẫn có admin key fallback `uet-admin-2026`; không production-ready.
- Chưa có automated lint/test/CI đầy đủ.
- Google Fonts là remote dependency; cần kiểm tra fallback/offline behavior.
- Asset lớn và organization-chart text cần được audit trên màn hình thật; cần chốt Git LFS/CDN/object storage nếu production yêu cầu.
- Official ĐTN–HSV content/asset chưa được nhập và chưa có source snapshot.
- Old Three/R3F cleanup chưa được duyệt; package manifest/lockfile cleanup không thuộc commit handoff này.
- `AGENTS.md`, `task.md`, `plan.md` nằm ở thư mục cha Git root; task/plan nền cũ không mô tả đầy đủ dòng redesign mới, nên đọc spec chuyên biệt và STATUS này.

## Những việc còn lại trước FINAL

- [ ] Fill content/asset ĐTN–HSV từ handbook và nguồn chính thức, kèm provenance.
- [ ] Hoàn tất Map iframe production integration và acceptance.
- [ ] Desktop regression và real-mobile regression cho toàn bộ route.
- [ ] Light/Dark regression.
- [ ] Browser Back/Forward và direct-route regression.
- [ ] Production build/server smoke test.
- [ ] Thay admin key fallback bằng secret/env và security review liên quan.
- [ ] Quyết định cleanup hay giữ Three/R3F; nếu cleanup thì commit source + manifest + lockfile đồng bộ.
- [ ] Deploy, cấu hình cache/origin và monitoring phù hợp.
- [ ] Final content, accessibility, responsive và cross-browser QA.

## Working tree handoff

- Commit handoff chỉ stage chọn lọc UI/docs/assets đã nghiệm thu.
- Không stage `frontend/package.json`, `frontend/package-lock.json` hoặc các deletion old Map Three/R3F.
- Không reset/stash/revert các thay đổi ngoài phạm vi; chúng phải được báo rõ sau push.
- `frontend/dist` là build output không được track/commit.

## Handoff for next developer / AI session

### Read first

1. `PROJECT_SUMMARY.md` — overview kiến trúc và lịch sử.
2. `STATUS.md` — trạng thái hiện hành và checklist còn lại.
3. `UET_DTN_HSV_PAGE_PLAN.md` — contract visual/content của trang ĐTN–HSV.
4. `UET_INTRO_REDESIGN_SPEC.md` — contract redesign Intro đã chốt.

### Current baseline

- Branch: `newest`.
- Base trước commit handoff: `c9988ea`.
- Host là React/Vite + Node API, route nhẹ không dùng router library.
- UI Intro và skeleton ĐTN–HSV hiện tại là baseline đã nghiệm thu.
- Map production chưa nghiệm thu; old Three/R3F vẫn phải coi là retained cho tới quyết định cleanup.

### What is finished

- Intro redesign và official content presentation.
- Organization-chart/lightbox và 20-year banner closing layout.
- Host navigation, responsive Light/Dark UI.
- Route/navigation/skeleton `/doan-thanh-nien-hoi-sinh-vien`.
- Editorial text gateway Liên chi/CLB trong ĐTN–HSV.
- Các trang chuyên biệt `/lien-chi` và `/cau-lac-bo` hiện có.

### What must not be redesigned lại

- `/gioi-thieu` presentation/layout đã chốt.
- Organization-chart và 20-year banner layout.
- Hero, overview, activities, Facebook CTA và hai gateway editorial trên ĐTN–HSV.
- Host navigation/theme/route architecture.
- `/lien-chi` và `/cau-lac-bo` là destination pages; không duplicate list/card vào ĐTN–HSV.

Chỉ sửa các phần trên khi có bug/regression, nội dung sai source hoặc yêu cầu thay đổi mới từ user.

### What still needs content/assets

- ĐTN–HSV: official logo Đoàn/Hội, hero photo, tên/nội dung Liên chi, overview CLB, 11 ảnh và 11 mô tả hoạt động.
- Source snapshot handbook và provenance/alt text cho mọi asset production.
- Không dùng placeholder giả như production content.

### Recommended next task

```text
DTN-02 — Tạo official handbook source snapshot, thu thập asset có provenance,
fill youthUnionContent.js và chạy content/responsive QA mà không redesign layout.
```

### Final/deploy checklist

1. Hoàn tất ĐTN–HSV content/assets và content QA.
2. Nghiệm thu external Map iframe trên production origin + thiết bị thật.
3. Quyết định old Three/R3F cleanup và đồng bộ source/manifest/lockfile nếu cleanup.
4. Chạy desktop/mobile, Light/Dark, Back/Forward và direct-route regression.
5. Chạy production build/server smoke.
6. Xử lý admin secret/security, asset delivery và remote-font risk.
7. Deploy, smoke production và final QA.
