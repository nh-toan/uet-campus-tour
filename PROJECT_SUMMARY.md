# Tổng quan dự án UET Campus Tour

> Cập nhật: 21/08/2026 (Asia/Bangkok)  
> Phạm vi kiểm kê: Git repository `campus-tour/`, source hiện tại trên branch `ui/redesign`  
> Nguồn đối chiếu: `AGENTS.md`, `task.md`, `plan.md` ở thư mục cha; lịch sử Git; `INTEGRATION_STATUS.md`; `INTEGRATION_HANDOFF_MAP3D_UI.md`; package và source thực tế.

## 1. Kết luận nhanh

Dự án hiện là một web app **UET Navigator / UET Virtual Campus Tour** mobile-first, kết hợp:

- giao diện giới thiệu UET Hòa Lạc;
- bản đồ khuôn viên 3D bằng Three.js/React Three Fiber;
- hotspot và panorama 360° mock;
- radar hướng nhìn và guided tour;
- danh mục 8 Khoa/Viện;
- danh mục 24 Câu lạc bộ;
- backend Node.js nhỏ để cung cấp API/content và serve frontend production.

Map 3D Phase 1 đã hoàn thành và được nghiệm thu tại commit `c0988b6` (`P1-11: accept phase 1 demo`). Chuỗi tích hợp Map vào host app `INT-01` đến `INT-08` cũng đã hoàn thành và được nghiệm thu thủ công. Công việc mới nhất nằm trên branch `ui/redesign`, HEAD `150f370`, tập trung vào redesign/polish giao diện và tổ chức lại code.

Trạng thái tổng thể hợp lý nhất:

```text
Phase 0 Foundation                 Hoàn thành trong donor Map
Phase 1 Mock interaction demo      Hoàn thành, đã nghiệm thu
INT-01 → INT-08                    Hoàn thành, đã nghiệm thu
UI redesign / content integration  Đang là dòng phát triển hiện tại
Phase 2+ asset/data production     Chưa được breakdown/triển khai đầy đủ
Deploy production                  Chưa có bằng chứng hoàn tất trong repo
```

## 2. Mục tiêu sản phẩm

Use case chính là giúp phụ huynh và tân sinh viên khám phá khuôn viên UET Hòa Lạc trong ngày nhập học. Sản phẩm ưu tiên trải nghiệm mobile, khả năng chạy ổn định, kiến trúc dễ debug và khả năng thay mock bằng asset/content thật mà không viết lại interaction core.

Flow MVP được thiết kế:

```text
Giới thiệu / điều hướng host
  → Bản đồ 3D
  → chọn hotspot
  → Panorama
  → quay lại Map
  → Guided Tour / Radar

Host app song song cung cấp:
  → Khoa & Viện
  → Câu lạc bộ
  → tìm kiếm, lọc và xem chi tiết
```

## 3. Status Git và môi trường

| Thuộc tính | Giá trị quan sát |
|---|---|
| Git root thật | `campus-tour/` |
| Remote | `https://github.com/nh-toan/uet-campus-tour.git` |
| Branch hiện tại | `ui/redesign` |
| HEAD | `150f370` — `Refactor code structure for improved readability and maintainability` |
| Upstream | `origin/ui/redesign` |
| Node | `v24.15.0` |
| npm | `11.12.1` |
| Root package | `uet-navigator@2.0.0` |
| Frontend package | `uet-navigator-frontend@2.0.0` |
| Working tree trước tài liệu | `frontend/package-lock.json` đã bị sửa, chưa commit |

Các branch đáng chú ý:

- `map3d-phase1` tại `c0988b6`: snapshot Map Phase 1 đã accept.
- `integration/map3d` trên remote tại `532b87c`: integration đã accept.
- `ui/redesign-fix` tại `4ee8ae9`: các sửa lỗi UI đã được merge vào `ui/redesign`.
- `ui/redesign` tại `150f370`: dòng code đang active.

Lưu ý: thay đổi có sẵn trong `frontend/package-lock.json` loại bỏ entry optional/peer `jiti`. Chưa có đủ bằng chứng để quy thay đổi này cho task nào; cần giữ nguyên và review riêng trước khi commit.

## 4. Trạng thái task theo nguồn sự thật

### 4.1 Task nền tảng trong `task.md`

`task.md` ở thư mục cha định nghĩa PRE-00, PRE-01, Phase 0 và Phase 1 cho standalone Map. Lịch sử branch `map3d-phase1` cùng tài liệu handoff xác nhận Phase 1 đã được accept. Vì source đã được tích hợp có chọn lọc vào host, không phải mọi file standalone còn tồn tại trên branch hiện tại.

| Nhóm task | Trạng thái | Bằng chứng/ghi chú |
|---|---|---|
| PRE-00 môi trường | Hoàn thành trong lịch sử | Node/npm và repo đã hoạt động |
| PRE-01 khởi tạo repo | Hoàn thành một phần về vận hành | Git repo tồn tại, nhưng bộ tài liệu quản trị không nằm trong Git root hiện tại |
| P0-01 → P0-11 | Hoàn thành trên donor Map | Baseline dependency, contract, store, config, mock panorama, R3F và review đã dẫn tới Phase 1 |
| P1-01 → P1-06 | Hoàn thành | Map geometry, camera sync, radar, hotspot, panorama và Map ↔ Panorama có trong feature hiện tại |
| P1-07 InfoDrawer | Không được port vào host | Có chủ đích: host sở hữu content/UI, integration handoff yêu cầu không port InfoDrawer standalone |
| P1-08 TourControls | Hoàn thành | Component và tour state/config còn trong feature Map |
| P1-09 LangThemeToggle standalone | Không được port | Host tự sở hữu theme; standalone toggle/useUIStore bị loại có chủ đích |
| P1-10 mobile touch pass | Đã nghiệm thu theo tài liệu | `INTEGRATION_STATUS.md` ghi real-device mobile regression PASS |
| P1-11 demo checkpoint | Hoàn thành | Commit `c0988b6` |
| Phase 2–6 | Chưa breakdown chi tiết | Chỉ có roadmap cấp cao trong `plan.md` |

### 4.2 Task tích hợp Map vào host

| Task | Trạng thái | Kết quả |
|---|---|---|
| INT-01 React 19 | Hoàn thành | Host dùng React 19.2.8 |
| INT-02 Vite/toolchain | Hoàn thành | Vite 8.2.0, plugin React 6.0.4 |
| INT-03 TypeScript + Map dependencies | Hoàn thành | JSX host được giữ; Map dùng TypeScript strict riêng |
| INT-04 CSS isolation | Hoàn thành | Map có scoped CSS/token riêng; Tailwind đã được loại khỏi integrated host |
| INT-05 port Map core | Hoàn thành | Feature nằm tại `frontend/src/features/campus-map/` |
| INT-06 wire/lazy-load `/ban-do` | Hoàn thành | `CampusMapModule` được lazy-load trong host |
| INT-07 standalone cleanup | Hoàn thành | Không port duplicate content/i18n/theme/InfoDrawer |
| INT-08 regression/mobile | Hoàn thành, đã accept | Tài liệu ghi desktop + thiết bị mobile thật + machine checks PASS |

### 4.3 Task hiện tại

Không có một `task.md` mới mô tả riêng task redesign. Từ branch và commit gần nhất, task thực tế hiện tại có thể mô tả là:

> Tiếp tục hoàn thiện/redesign UET Navigator sau khi Map 3D đã tích hợp, đồng thời giữ nguyên boundary của Map, API/content và regression đã accept.

Đây là suy luận từ Git, không phải task ID chính thức. Trước khi tiếp tục implementation nên tạo task ID/Acceptance Criteria mới để tránh làm việc theo commit message chung chung.

## 5. Kiến trúc đang chạy thực tế

```text
campus-tour/
├── package.json                 # orchestration frontend + backend
├── backend/
│   ├── server.js                # Node HTTP API + static server
│   └── data/
│       ├── lien-chi.json        # 8 Khoa/Viện
│       └── clubs.json           # 24 CLB
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # host navigation/pages/content UI
│   │   ├── main.jsx             # React root + error boundary
│   │   ├── styles.css           # global host UI
│   │   ├── styles/tokens.css    # token host
│   │   └── features/campus-map/ # Map module độc lập tương đối
│   └── public/assets/           # ảnh Map, Khoa/Viện, CLB
├── tools/                       # script xử lý/extract asset và content
├── ui-redesign/                 # baseline/reference HTML-CSS redesign
└── tài liệu integration
```

### 5.1 Host frontend

`frontend/src/App.jsx` hiện sở hữu:

- routing nhẹ bằng `location.pathname`, `history.pushState`, `popstate`;
- các route `/gioi-thieu`, `/ban-do`, `/lien-chi`, `/cau-lac-bo`;
- Header, Footer, navigation desktop/mobile;
- light/dark theme lưu trong `localStorage` với key `uet-theme`;
- Intro page;
- Map page và lazy loading Map chunk;
- fetch API Khoa/Viện và CLB;
- tìm kiếm/lọc, entity card và detail panel.

Không dùng React Router; đây là quyết định có chủ đích trong integration.

### 5.2 Campus Map feature

Boundary `frontend/src/features/campus-map/` sở hữu:

- `CampusMapModule.tsx`: composition và crossfade Map/Panorama;
- `CampusMap3D`: Canvas, camera, OrbitControls và placeholder geometry;
- `Hotspots`: marker data-driven;
- `PanoramaViewer`: equirectangular mock panorama;
- `RadarMinimap`: hướng nhìn bằng DOM/SVG, không import Three.js;
- `TourControls`: play/pause/next/previous;
- `useCampusStore`: navigation/camera/map view/tour state;
- typed config cho hotspot, panorama và tour;
- local deterministic panorama grid.

Luồng dữ liệu panorama tuân theo contract:

```text
activeSceneId
  → panorama.config.ts
  → PanoramaViewer
  → imageUrlMobile / imageUrlDesktop
```

State Map tách đúng hai khái niệm:

```text
viewMode: map3d | panorama
tour.status: idle | playing | paused
```

### 5.3 Backend

Backend là Node.js built-in HTTP server, không có framework web ngoài. Nó:

- serve frontend build từ `frontend/dist`;
- trả `GET /api/lien-chi`;
- hỗ trợ `POST`, `PATCH`, `DELETE` cho Khoa/Viện khi có `x-admin-key`;
- trả `GET /api/clubs`;
- validate/normalize dữ liệu, link, màu và đường dẫn asset;
- ghi JSON qua temporary file rồi rename;
- hỗ trợ SPA routes đã khai báo.

Rủi ro bảo mật đáng chú ý: backend có admin key fallback hardcode `uet-admin-2026` khi biến môi trường `UET_ADMIN_KEY` không tồn tại. Không nên coi cấu hình này là production-ready.

### 5.4 Dữ liệu và asset

- `backend/data/lien-chi.json`: 8 đơn vị Khoa/Viện.
- `backend/data/clubs.json`: 24 CLB.
- `frontend/public/assets/clubs`: 68 file logo/variant.
- `frontend/public/assets/lien-chi`: 24 file logo/background.
- Có aerial campus image và map hero image.
- Có nhiều source asset gốc ở root (`LOGO CLB`, `LOGO KHOA - BO MON - VIEN`, DOCX, AI/EPS, ảnh nguồn), khiến repository local khoảng 622 MB tính cả dependency/build hiện có.

## 6. Tech stack và dependency thực tế

### Frontend runtime

| Package | Version |
|---|---:|
| React | 19.2.8 |
| React DOM | 19.2.8 |
| Three.js | 0.185.1 |
| `@react-three/fiber` | 9.7.0 |
| `@react-three/drei` | 10.7.8 |
| Zustand | 5.0.15 |
| Lucide React | 1.31.0 |

### Frontend tooling

| Package | Version |
|---|---:|
| Vite | 8.2.0 |
| TypeScript | 6.0.2 |
| `@vitejs/plugin-react` | 6.0.4 |
| `@types/three` | 0.185.4 |

### Điểm khác với baseline gốc

- React/R3F/Drei/Zustand/Lucide đúng major yêu cầu.
- Integrated host **không còn Tailwind CSS v4**. `INT-07` đã chủ động loại Tailwind để tránh CSS bleed và dùng scoped CSS cho Map.
- Host UI vẫn là JavaScript/JSX; TypeScript strict chỉ áp dụng cho Map qua `frontend/tsconfig.map.json`.
- Repo hiện có backend dù scope guard Phase 0–1 ban đầu cấm tự thêm backend. Backend thuộc host app có trước/được giữ lại theo kế hoạch integration, không phải Map tự tạo.

## 7. Scripts vận hành

Từ Git root `campus-tour/`:

| Command | Chức năng |
|---|---|
| `npm run dev` | chạy backend và Vite frontend đồng thời |
| `npm run server` | chạy backend tại port mặc định 3001 |
| `npm run client` | chạy Vite frontend |
| `npm run build` | typecheck Map rồi build frontend |
| `npm start` | chạy backend/serve bản production đã build |
| `npm run check` | syntax check backend + typecheck Map + build frontend |

Frontend có thêm `npm run typecheck:map` và `npm run preview`.

Repo hiện không khai báo script `lint` hoặc `test`; vì vậy không có bằng chứng automated lint/unit/integration test suite.

## 8. Verification tại thời điểm lập báo cáo

Command đã chạy:

```text
npm run check — PASS
```

Nó xác nhận:

- `node --check backend/server.js`: PASS;
- `tsc -p tsconfig.map.json --noEmit`: PASS;
- Vite production build: PASS;
- 2.359 module được transform thành công.

Build output chính:

| Artifact | Kích thước | Gzip |
|---|---:|---:|
| Host JS | 213.30 kB | 68.02 kB |
| Map/Three lazy JS | 918.65 kB | 246.86 kB |
| Host CSS | 43.06 kB | 8.80 kB |
| Map CSS | 8.27 kB | 1.71 kB |

Warning còn lại: Map/Three chunk lớn hơn 500 kB sau minify. Map đã lazy-load nên warning không làm hỏng initial non-map route, nhưng cần theo dõi ở Phase performance/production.

## 9. Acceptance Criteria và checkpoint thủ công

### Đã verify bằng máy trong lần kiểm kê này

- package/dependency đọc được và major tương thích;
- backend không có syntax error;
- TypeScript Map strict typecheck PASS;
- frontend production build PASS;
- Map được code-split thành lazy chunk;
- data JSON đọc được: 8 Khoa/Viện và 24 CLB.

### Theo tài liệu đã từng được người dùng nghiệm thu

- Map flow regression;
- desktop regression;
- real-device mobile regression;
- integration `INT-01` → `INT-08`.

### 👁️ Chưa tái xác nhận trong lần lập báo cáo này

- UI redesign hiện tại có đúng thiết kế mong muốn không;
- responsive trên các breakpoint và Android tầm trung;
- touch/rotate/zoom/panorama trên thiết bị thật;
- browser back/forward trên mọi route;
- search/filter/modal và API proxy khi chạy dev;
- light/dark theme và contrast/accessibility;
- guided tour timing, radar orientation và camera restore;
- production server/API smoke test sau build;
- asset/logo/content có đúng bản chính thức mới nhất.

## 10. Mâu thuẫn và lệch chuẩn cần xử lý

### 10.1 Bộ tài liệu quản trị nằm sai Git root

`AGENTS.md`, `task.md`, `plan.md` nằm ở `/home/flamo808/uet-campus-tour/`, còn Git root thật là `/home/flamo808/uet-campus-tour/campus-tour/`. Trước báo cáo này, `STATUS.md` chưa tồn tại ở cả vị trí mong đợi.

Ảnh hưởng:

- clone riêng Git repository sẽ không có luật/task/plan nền tảng;
- PRE-01 Acceptance Criteria “bốn file ở project root” chưa đạt;
- người tiếp quản dễ đọc thiếu context.

Phương án nhỏ nhất: sau khi người dùng xác nhận nguồn tài liệu cha là bản chính thức, copy chúng vào Git root trong một task docs riêng; không thay nội dung/kiến trúc.

### 10.2 Tài liệu Phase 0–1 không phản ánh host app tích hợp

`task.md`/`plan.md` mô tả standalone Map và cấm backend trong Phase 0–1. Source hiện tại là host UET Navigator có backend, JavaScript host và Map feature cô lập. Tài liệu integration giải thích nguồn gốc hợp lệ của kiến trúc này, nhưng thứ tự nguồn sự thật chưa được cập nhật chính thức.

Phương án nhỏ nhất: bổ sung một section “post-integration baseline” hoặc task roadmap mới; không ép source hiện tại quay lại cấu trúc standalone.

### 10.3 Tailwind baseline và implementation khác nhau

Luật nền tảng yêu cầu Tailwind v4/tokens, nhưng integrated source không có Tailwind. Integration history ghi rõ `INT-07: remove unused Tailwind dependencies` để tránh CSS bleed. Cần chốt đây là exception chính thức cho host tích hợp.

### 10.4 Không có task ID cho redesign hiện tại

Branch `ui/redesign` đã có nhiều commit nhưng không có Acceptance Criteria/checkpoint tương ứng trong `task.md`. Cần tạo task mới trước thay đổi feature tiếp theo.

## 11. Known issues và rủi ro

- Map/Three lazy chunk lớn: 918.65 kB minified.
- Chưa có automated test suite và lint script.
- Host JS không được TypeScript kiểm tra.
- `App.jsx` vẫn là file composition lớn, dù commit mới nhất nói đã refactor readability.
- Admin key có fallback hardcode, không phù hợp production.
- Backend mutation mới chỉ áp dụng cho Khoa/Viện; CLB API hiện read-only.
- Mock Map vẫn dùng placeholder geometry, mock coordinates và một panorama grid chung cho ba scene.
- Config còn TODO thay bằng dữ liệu/ảnh campus đã xác minh.
- Source asset gốc có nhiều variant/định dạng lớn; chưa thấy chiến lược Git LFS/CDN rõ ràng.
- `frontend/package-lock.json` đang modified và cần xác minh lý do.
- Root docs chưa được version-control cùng source Git thực tế.

## 12. Những gì đã có và những gì chưa có

### Đã có

- vertical slice Map → Hotspot → Panorama → Back;
- RadarMinimap và guided tour controls;
- lazy-load Map trong host;
- 4 route chính và navigation tự quản;
- theme sáng/tối host;
- content Khoa/Viện, CLB và asset tương ứng;
- Node API/static server;
- production build chạy được;
- error boundary ở React root;
- tài liệu handoff/integration khá đầy đủ.

### Chưa hoàn chỉnh hoặc chưa chứng minh

- asset 3D/panorama thật;
- dữ liệu tọa độ campus thật;
- Info Drawer tích hợp theo flow Phase 1 gốc;
- VI/EN hoàn chỉnh;
- day/night scene hoàn chỉnh;
- test automation/lint/CI được quan sát trong snapshot này;
- security hardening và cấu hình secrets production;
- performance pass chính thức cho Map bundle;
- deploy production và monitoring;
- roadmap task chi tiết Phase 2–6.

## 13. Bước tiếp theo đề xuất

Thứ tự an toàn:

1. Xác minh thay đổi `frontend/package-lock.json` là chủ ý hay phát sinh từ môi trường.
2. Chốt/copy `AGENTS.md`, `task.md`, `plan.md` vào Git root và version-control `STATUS.md` trong một commit docs.
3. Tạo task ID chính thức cho UI redesign với Acceptance Criteria máy + checkpoint 👁️.
4. Chạy manual regression trên branch `ui/redesign`: 4 route, back/forward, theme, API, search/filter/detail, Map flow và mobile.
5. Nếu regression PASS, commit/merge redesign theo quy trình review.
6. Sau đó mới breakdown Phase 2: asset panorama/model/toạ độ thật hoặc content production.
7. Trước deploy: bỏ admin key fallback, cấu hình secret, bổ sung test/lint/CI và đánh giá asset/bundle strategy.

## 14. Prompt gợi ý cho session tiếp theo

```text
Đọc AGENTS.md → STATUS.md → task.md → plan.md và PROJECT_SUMMARY.md.
Không sửa code ngay. Kiểm tra git status và giải thích diff frontend/package-lock.json.
Sau đó đề xuất task ID + Acceptance Criteria cụ thể để nghiệm thu branch ui/redesign,
bao gồm host UI, API, Map flow, browser navigation và mobile checkpoint.
```

## 15. Nguồn tham khảo nội bộ

- `../AGENTS.md`: luật repository và architecture baseline.
- `../task.md`: task Phase 0–1.
- `../plan.md`: product/architecture roadmap.
- `INTEGRATION_HANDOFF_MAP3D_UI.md`: kế hoạch tích hợp hai dòng code.
- `INTEGRATION_STATUS.md`: kết quả nghiệm thu integration.
- `Tích hợp UI chính + Map 3D từ hai branch.md`: prompt/quy trình integration.
- `package.json`, `frontend/package.json`, `backend/package.json`: scripts/dependency thực tế.
- `frontend/src/App.jsx`: host composition.
- `frontend/src/features/campus-map/`: Map feature boundary.
- `backend/server.js`, `backend/data/`: API và content source.

