# Tích hợp UI chính + Map 3D từ hai branch

Repository GitHub:

`nh-toan/uet-campus-tour`

Trước khi làm bất kỳ thay đổi nào, hãy đọc kỹ file:

`INTEGRATION_HANDOFF_MAP3D_UI.md`

File này là baseline kiến trúc và quy trình tích hợp. Không được bỏ qua hoặc tự thay đổi định hướng nếu chưa báo tôi.

Sau đó đọc code thực tế từ hai branch:

- `main` — UI chính / host application
- `map3d-phase1` — Map 3D Phase 1 vừa được push lên

## Mục tiêu cuối

Tích hợp Map 3D trực tiếp vào tab **Bản đồ** của UI chính.

Không dùng iframe trong target cuối.

UI chính vẫn sở hữu:

- Header / navigation
- Giới thiệu
- Liên chi
- CLB
- backend/API
- content assets

Map 3D chỉ sở hữu:

- Three/R3F scene
- camera
- hotspot
- panorama
- radar
- guided tour
- asset/map-specific state

Sau integration phải là:

- một frontend build;
- một app;
- một deployment;
- nhưng Map vẫn nằm trong feature boundary riêng để sau này phát triển độc lập.

---

# Bước 1 — Preflight, CHƯA SỬA CODE

Trước tiên:

1. `git status`
2. `git remote -v`
3. `git fetch origin --prune`
4. `git branch -a`
5. kiểm tra `origin/main`
6. kiểm tra `origin/map3d-phase1`
7. đọc `package.json`, Vite config và entry point của `main`
8. đọc source/structure cần thiết của `map3d-phase1`
9. xác nhận hai branch có lịch sử độc lập hay không
10. đối chiếu mọi thứ với `INTEGRATION_HANDOFF_MAP3D_UI.md`

Không merge hai Git history.

Không dùng:

- `--allow-unrelated-histories`
- `--force`
- `--legacy-peer-deps`
- force push

Sau preflight, báo cho tôi:

- trạng thái hai branch;
- version matrix React/Vite/dependency;
- vị trí MapPage trong UI chính;
- các file Map cần port;
- các file Map không nên port;
- conflict/rủi ro phát hiện thực tế;
- kế hoạch integration theo từng bước.

**DỪNG để tôi kiểm tra kế hoạch trước khi sửa code.**

---

# Bước 2 — Tạo integration branch

Sau khi tôi xác nhận preflight:

Từ `main` sạch và mới nhất:

```bash
git switch main
git pull --ff-only origin main
git switch -c integration/map3d
```

Không làm trực tiếp trên `main`.

Để đọc donor Map song song, ưu tiên:

```bash
git worktree add --detach ../uet-campus-map-donor origin/map3d-phase1
```

Không merge donor branch vào integration branch.

Port source có chọn lọc.

---

# Bước 3 — Thực hiện từng task nhỏ

Tuân thủ thứ tự trong `INTEGRATION_HANDOFF_MAP3D_UI.md`.

Mỗi bước phải:

1. báo implementation plan ngắn trước khi sửa;
2. chỉ sửa đúng phạm vi bước hiện tại;
3. chạy verification phù hợp;
4. review diff;
5. báo:
   - file thay đổi;
   - behavior thay đổi;
   - command đã chạy;
   - PASS/FAIL;
   - warning/blocker;
6. commit riêng nếu PASS;
7. **DỪNG chờ tôi xác nhận trước khi sang bước tiếp theo**.

Không chạy một lèo toàn bộ integration.

---

# Thứ tự integration mong muốn

## INT-00 — Baseline UI

Không sửa code.

Verify UI `main` hiện tại:

- build;
- backend;
- Giới thiệu;
- Bản đồ placeholder;
- Liên chi;
- CLB;
- navigation;
- browser back/forward;
- mobile.

Nếu baseline fail: DỪNG.

---

## INT-01 — React 19

Nâng host UI từ React 18 lên React 19 phù hợp với Map/R3F.

Không thêm Map trong bước này.

Sau upgrade phải verify toàn bộ UI cũ vẫn chạy.

Nếu React migration fail: DỪNG.

---

## INT-02 — Vite/toolchain

Nâng Vite/plugin theo target trong handoff.

Không thêm Map trong bước này.

Giữ nguyên API proxy/backend behavior.

Verify build/dev/API.

---

## INT-03 — TypeScript + dependencies Map

Giữ UI legacy JSX.

Không rewrite toàn bộ UI sang TypeScript.

Thêm TypeScript strict cho feature Map/code mới.

Thêm đúng dependency Map cần thiết:

- three
- @react-three/fiber
- @react-three/drei
- zustand
- lucide-react
- tailwindcss
- @tailwindcss/vite
- type packages cần thiết

Không dùng force/legacy peer.

Nếu dependency conflict: DỪNG và báo.

---

## INT-04 — CSS/Tailwind isolation

Đây là bước rủi ro cao.

Không để Tailwind Preflight reset global UI hiện tại.

Map styles/tokens phải được isolate/scope theo handoff.

Verify:

- Header không đổi;
- Intro không đổi;
- Liên chi không đổi;
- CLB không đổi;
- modal/footer/mobile không bị CSS bleed.

DỪNG để tôi kiểm tra visual.

---

## INT-05 — Port Map core

Port có chọn lọc vào:

`frontend/src/features/campus-map/`

Giữ:

- CampusMap3D
- PanoramaViewer
- Hotspots
- RadarMinimap
- TourControls
- useCampusStore
- hotspot config
- panorama config
- tour config
- types cần thiết
- map/mock asset cần thiết
- transition/back logic cần thiết

Không port:

- InfoDrawer
- LangThemeToggle
- useUIStore
- campus/faculty/club duplicate content
- i18n skeleton standalone
- standalone header
- standalone AppShell nguyên bản

Tạo `CampusMapModule.tsx` phù hợp với host.

Map root không được dùng viewport sizing kiểu standalone nếu làm tràn MapPage.

---

## INT-06 — Wire vào tab Bản đồ

Thay chỉ vùng placeholder `map-viewer` của UI chính bằng Map module.

Giữ nguyên:

- MapPage copy/text;
- Header;
- navigation;
- CTA/stats nếu đang có;
- Liên chi;
- CLB;
- backend.

Map phải lazy-load khi vào `/ban-do`.

Người dùng ở Giới thiệu/Liên chi/CLB không nên tải Three bundle sớm.

DỪNG ở checkpoint để tôi test.

---

## INT-07 — Standalone cleanup

Xác nhận integrated Map không còn:

- Thông tin duplicate;
- VI/EN duplicate;
- theme control;
- content config duplicate;
- standalone-only behavior không phù hợp.

Không xóa donor branch.

---

## INT-08 — Regression/mobile/final integration review

Chạy full regression:

### UI chính
- Giới thiệu
- Liên chi
- CLB
- search/filter
- modal
- backend API
- navigation
- browser back/forward
- mobile

### Map
- render Map
- rotate/zoom
- Radar
- hotspot
- panorama
- Back restore
- TourControls
- fullscreen nếu có
- mobile touch

### Boundary
- no CSS bleed
- no duplicate content UI
- no serious console error
- Map unmount khi rời tab
- no hidden WebGL loop khi xem tab khác
- lazy-load Three bundle

Sau khi toàn bộ PASS mới đề xuất merge `integration/map3d` vào `main`.

Không tự merge vào main nếu tôi chưa xác nhận.

---

# Quy tắc kiến trúc bắt buộc

Target folder:

```text
frontend/src/features/campus-map/
```

Map phải có boundary đủ rõ để dev Map chủ yếu sửa folder này mà không ảnh hưởng UI/content.

UI team chủ yếu tiếp tục sửa:

- `App.jsx`
- styles host
- backend
- content/assets

Map không được trực tiếp sở hữu data Liên chi/CLB.

Nếu sau này Map cần mở content, thiết kế callback/event contract riêng; chưa làm trước khi có requirement.

---

# Git safety

- Không reset hard.
- Không clean file người dùng.
- Không force push.
- Không merge unrelated histories.
- Không commit secrets.
- Không sửa `main` trực tiếp.
- Mỗi INT step nên là một commit reviewable.
- Nếu verify fail, dừng ở đúng step đó.

---

# Cách báo cáo với tôi

Sau mỗi bước, báo ngắn theo format:

```text
INT-XX — PASS/FAIL

Changed:
- ...

Verification:
- command — PASS/FAIL

Behavior:
- ...

Warnings:
- ...

Checkpoint:
- ...

Next:
- ...
```

Nếu cần quyết định architecture/dependency ngoài tài liệu, DỪNG và hỏi tôi trước.

Bắt đầu bằng **Bước 1 — Preflight בלבד**, chưa sửa code.