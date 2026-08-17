# PLAN.md — Kế hoạch dự án UET Virtual Campus Tour

> Phiên bản: v0.4 — nền móng cho Phase 0–1  
> Ngôn ngữ làm việc với Codex: **Tiếng Việt**  
> Use-case chính: Phụ huynh và Tân sinh viên sử dụng trong ngày nhập học tại khuôn viên UET Hòa Lạc  
> Thiết bị ưu tiên: **Mobile-first**

---

# 1. Tóm tắt dự án

UET Virtual Campus Tour là một web app tương tác giúp người dùng:

- xem tổng quan khuôn viên bằng bản đồ 3D;
- chạm vào hotspot của các toà nhà;
- chuyển sang panorama 360°;
- đọc thông tin Trường/Khoa/CLB;
- chạy guided tour;
- theo dõi hướng nhìn bằng Radar Minimap.

Mục tiêu không phải làm một demo dùng một lần.

Kiến trúc phải cho phép:

- thay mock bằng model/ảnh thật;
- thêm toà nhà/panorama mà không sửa core engine;
- đồng đội nhập content mà không cần hiểu Three.js;
- debug từng lớp riêng;
- triển khai độc lập và tích hợp lâu dài với hệ sinh thái UET.

---

# 2. Nguyên tắc sản phẩm

Thứ tự ưu tiên:

1. **Mobile usable trong ngày nhập học.**
2. **Launch được dù asset/content chưa đủ.**
3. **Không phải đập kiến trúc khi asset thật tới.**
4. **Người khác tiếp quản được.**
5. **Đủ đẹp để present và phát triển thành sản phẩm chính thức.**

Không tối ưu cho những use-case chưa tồn tại.

---

# 3. Scope MVP

| Tính năng | MVP | Ghi chú |
|---|---:|---|
| Bản đồ 3D tổng quan | ✅ | Phase 1 dùng placeholder geometry |
| Hotspot toà nhà | ✅ | Data-driven |
| Panorama 360° | ✅ | Phase 1 dùng local test grid |
| Map ↔ Panorama transition | ✅ | Crossfade đơn giản |
| Radar Minimap + view cone | ✅ | Sync camera thật |
| Drawer thông tin | ✅ | Mock trước |
| Guided Tour Play/Pause/Next/Prev | ✅ | State tách khỏi scene mode |
| VI/EN skeleton | ✅ | Không cần hệ thống i18n lớn ở Phase 1 |
| Day/Night | ⚠️ | Chỉ state skeleton ở Phase 1 |
| Landing screen hoàn chỉnh | ⏳ | Sau khi flow engine ổn |
| Popup hotspot đẹp | ⏳ | Có thể polish sau |
| End-of-tour screen | ⏳ | Sau P1 demo |
| QR deep-link | ➕ | V2/MVP+ |
| Login/backend/CMS | ❌ | Ngoài scope hiện tại |

---

# 4. Kiến trúc tổng thể

```text
                 ┌─────────────────────┐
                 │       CONFIG        │
                 │ campus / faculty    │
                 │ club / hotspot      │
                 │ panorama / tour     │
                 └──────────┬──────────┘
                            │ typed data
              ┌─────────────┴─────────────┐
              │                           │
      ┌───────▼────────┐          ┌───────▼────────┐
      │     SCENES     │          │   COMPONENTS   │
      │ Three/R3F/Drei │          │ DOM / SVG React│
      └───────┬────────┘          └───────┬────────┘
              │                           │
              └─────────────┬─────────────┘
                            │
                     ┌──────▼──────┐
                     │   ZUSTAND   │
                     │ Campus + UI │
                     └──────┬──────┘
                            │
                     ┌──────▼──────┐
                     │     APP     │
                     │ composition │
                     └─────────────┘
```

---

# 5. Ranh giới kiến trúc

## 5.1 Data layer

`config/` chỉ chứa dữ liệu typed.

Không chứa:

- React component;
- Three.js object;
- event handler;
- Zustand logic.

## 5.2 Engine layer

`scenes/` xử lý:

- Canvas;
- camera;
- OrbitControls;
- 3D geometry;
- panorama sphere;
- hotspot 3D position.

## 5.3 UI layer

`components/` xử lý:

- RadarMinimap;
- Drawer;
- TourControls;
- LangThemeToggle;
- SiteHeader.

UI không import Three.js.

## 5.4 State layer

Hai store:

- `useCampusStore`: world/navigation/tour state.
- `useUIStore`: drawer/language/theme.

---

# 6. Data Contract

```ts
export interface CampusInfo {
  name: string;
  slogan: string;
  address: string;
  stats: { label: string; value: string }[];
}

export interface Faculty {
  id: string;
  name: string;
  dean: string;
  programs: string[];
  description?: string;
}

export interface Club {
  id: string;
  name: string;
  category: "academic" | "sports" | "arts" | "volunteer" | "other";
  memberCount?: number;
  description: string;
  logoUrl?: string;
}

export interface Hotspot {
  id: string;
  buildingId: string;
  position: [number, number, number];
  label: string;
  panoramaSceneId: string;
}

export interface PanoramaScene {
  id: string;
  buildingId: string;
  title: string;
  imageUrlMobile: string;
  imageUrlDesktop: string;
  initialYawPitch: [number, number];
  linkedScenes?: {
    targetSceneId: string;
    yaw: number;
    pitch: number;
  }[];
}

export interface TourStop {
  order: number;
  sceneId: string;
  cameraTarget: [number, number, number];
  durationMs: number;
}
```

---

# 7. Quan hệ ID

Quan hệ dữ liệu phải rõ:

```text
Building
  ↑
  │ buildingId
Hotspot ─── panoramaSceneId ───> PanoramaScene
                                     ↑
                                     │ sceneId
                                  TourStop
```

Phase 1 phải có:

```text
config/hotspots.config.ts
config/panorama.config.ts
config/tour.config.ts
```

Không hardcode mapping trong component.

---

# 8. State Contract

## 8.1 Campus Store

```ts
type ViewMode = "map3d" | "panorama";
type TourStatus = "idle" | "playing" | "paused";

interface CameraState {
  yaw: number;
  pitch: number;
  fov: number;
}

interface MapViewState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

interface TourState {
  status: TourStatus;
  currentIndex: number;
}

interface CampusState {
  viewMode: ViewMode;
  activeSceneId: string | null;

  camera: CameraState;
  mapView: MapViewState;
  tour: TourState;

  setViewMode: (mode: ViewMode) => void;
  setActiveScene: (id: string | null) => void;
  setCamera: (camera: Partial<CameraState>) => void;
  setMapView: (view: Partial<MapViewState>) => void;

  playTour: () => void;
  pauseTour: () => void;
  stopTour: () => void;
  setTourIndex: (index: number) => void;
}
```

### Vì sao tách `tour.status`

Auto-pilot là hoạt động đang chạy trên map/panorama, không phải scene thứ ba.

Nếu dùng `"autopilot"` chung với `viewMode`, app sẽ khó trả lời câu hỏi:

> “Tour đang chạy nhưng hiện tại người dùng đang xem map hay panorama?”

Tách hai trục state giúp tránh refactor về sau.

## 8.2 UI Store

```ts
interface UIState {
  drawer: {
    open: boolean;
    tab: "about" | "faculty" | "club";
  };

  lang: "vi" | "en";
  theme: "day" | "night";

  openDrawer: (tab: UIState["drawer"]["tab"]) => void;
  closeDrawer: () => void;
  setLang: (lang: UIState["lang"]) => void;
  setTheme: (theme: UIState["theme"]) => void;
}
```

---

# 9. Camera / tọa độ

Quy ước cố định:

- world Y-up;
- shared yaw/pitch/fov dùng degree;
- yaw 0° = nhìn -Z;
- yaw dương = quay về +X;
- pitch dương = nhìn lên;
- FOV = vertical FOV.

`mapView` lưu `position + target + fov` để quay từ Panorama về Map không bị reset góc nhìn.

Không lưu Three.js instance vào Zustand.

---

# 10. Brand Design System

## 10.1 Token màu tạm thời

```css
--color-navy-900: #0B2140;
--color-navy-700: #14335E;
--color-tech-blue: #2F80FF;
--color-academic-gold: #C9A227;
--color-cloud: #F5F7FA;
--color-slate-500: #64748B;
```

Đây là token **tạm thời** cho đến khi có brand guideline/logo chính thức.

Chỉ sửa giá trị ở:

```text
src/styles/tokens.css
```

Không sửa màu rải rác trong component.

## 10.2 Typography

Tạm dùng:

- Display: Be Vietnam Pro
- Body: Inter
- Mono: JetBrains Mono

Trong production phải có fallback tốt; không để UI hỏng nếu font remote không tải được.

---

# 11. Tech stack

Baseline:

```text
React 19
Vite
TypeScript strict
Three.js
@react-three/fiber v9
@react-three/drei v10
Zustand
Tailwind CSS v4
@tailwindcss/vite
Lucide React
```

Không dùng `latest` một cách vô thức sau khi repo đã có lockfile.

---

# 12. Cấu trúc thư mục

```text
campus-tour/
  AGENTS.md
  plan.md
  task.md
  STATUS.md

  src/
    app/
      AppShell.tsx

    scenes/
      CampusMap3D/
        index.tsx
      PanoramaViewer/
        index.tsx
      Hotspots/
        index.tsx

    store/
      useCampusStore.ts
      useUIStore.ts

    components/
      RadarMinimap/
        index.tsx
      InfoDrawer/
        index.tsx
      TourControls/
        index.tsx
      LangThemeToggle/
        index.tsx
      SiteHeader/
        index.tsx

    config/
      campus.config.ts
      faculty.config.ts
      club.config.ts
      hotspots.config.ts
      panorama.config.ts
      tour.config.ts

    styles/
      tokens.css
      global.css

    types/
      campus.types.ts

    i18n/
      vi.json
      en.json

    assets/
      brand/
      mock/

  public/
```

---

# 13. User flow Phase 1

```text
Mở app
  ↓
Campus Map 3D mock
  ↓
xoay / zoom
  ↓
RadarMinimap phản ánh yaw/fov
  ↓
tap Hotspot
  ↓
activeSceneId được set
  ↓
crossfade
  ↓
PanoramaViewer đọc panorama.config
  ↓
xoay panorama
  ↓
Back
  ↓
khôi phục mapView cũ
  ↓
InfoDrawer
  ↓
TourControls
  ↓
Play / Pause / Next / Prev
```

---

# 14. Map mock Phase 1

Không cần model thật.

Dùng:

- 3 building boxes;
- 1 ground plane;
- light tối thiểu;
- 3 hotspot;
- fixed building IDs.

Ví dụ ID:

```text
building-gate
building-academic
building-library
```

Config là source of truth cho ID dùng chung.

---

# 15. Panorama mock Phase 1

Không tải panorama random.

Tạo local test grid 2:1, ví dụ:

```text
sample-panorama-grid.svg
```

Nên có chữ:

```text
NORTH
EAST
SOUTH
WEST
ZENITH
NADIR
```

Mục đích:

- test seam;
- test orientation;
- test yaw;
- test distortion;
- test active scene selection.

Phase 2 mới thay ảnh thật.

---

# 16. RadarMinimap

Radar dùng SVG thuần React.

Đọc:

- `camera.yaw`;
- `camera.fov`.

Không đọc Three.js trực tiếp.

View cone:

- quay theo yaw;
- góc mở dựa trên FOV;
- Phase 1 có thể có pulse/sweep nhẹ nếu không ảnh hưởng hiệu năng.

---

# 17. Guided Tour

Guided Tour chạy dựa trên `tour.config.ts`.

Mỗi stop:

```ts
{
  order,
  sceneId,
  cameraTarget,
  durationMs
}
```

State:

```text
idle
playing
paused
```

Yêu cầu:

- Play tiếp tục từ stop hiện tại.
- Pause không reset index.
- Next/Prev không làm index out-of-range.
- Timer luôn cleanup.
- Không tạo timer duplicate khi bấm Play nhiều lần.

Phase 4 mới nâng cấp:

- jump-to-stop;
- easing camera;
- progress UI nâng cao.

---

# 18. Map ↔ Panorama transition

MVP chọn **hai scene riêng + crossfade**.

Lý do:

- dễ debug;
- ít scene graph phức tạp;
- phù hợp mobile;
- không cần cinematic transition.

Nhưng state map phải lưu trước khi scene bị unmount để Back không reset camera.

---

# 19. Mobile performance

Phase 1:

- geometry đơn giản;
- local panorama nhỏ;
- không shadow nặng;
- không post-processing;
- canvas touch interaction đúng.

Phase 2+:

- mobile/desktop panorama riêng;
- runtime texture-size check;
- Draco/Meshopt khi model thật cần;
- KTX2/Basis khi pipeline asset ổn định;
- progressive loading.

Mục tiêu production:

- Android tầm trung;
- >= 30 FPS ổn định trong interaction chính.

---

# 20. Loading và error

Phase 1 chưa cần hệ thống phức tạp nhưng architecture phải cho phép:

- loading state Panorama;
- asset-not-found fallback;
- scene ID invalid fallback.

Không để màn hình trắng khi `activeSceneId` không map được với config.

---

# 21. Strategy tích hợp UET

Khuyến nghị:

```text
tour.uet.vnu.edu.vn
```

hoặc subdomain tương đương.

App build/deploy độc lập.

Website chính chỉ cần:

- link/menu tới tour;
- optional preview iframe nếu thực sự cần.

Không viết lại thành WordPress plugin ở MVP.

---

# 22. Phase roadmap

## Phase 0 — Foundation

- scaffold;
- dependency;
- token;
- folder structure;
- type contract;
- Zustand stores;
- mock config;
- Panorama mock data;
- R3F hello world;
- i18n skeleton.

## Phase 1 — Mock interaction demo

- 3 building mock;
- camera sync;
- Radar;
- Hotspots;
- Panorama;
- transition + map restore;
- InfoDrawer;
- TourControls;
- Lang/Theme state;
- mobile touch pass;
- demo checkpoint.

## Phase 2 — Asset thật

- GLB thật;
- panorama thật;
- logo thật;
- asset loading;
- mobile/desktop texture selection.

## Phase 3 — Nội dung thật

- trường;
- khoa;
- CLB;
- VI/EN.

## Phase 4 — Guided Tour nâng cao

- jump-to-stop;
- easing;
- route polish;
- end screen.

## Phase 5 — QA thiết bị thật

- Android mid-range;
- FPS;
- touch;
- accessibility;
- contrast;
- network condition.

## Phase 6 — Deploy

- hosting;
- CDN;
- subdomain;
- DNS;
- tích hợp site chính;
- dry run.

---

# 23. Những thứ cố ý chưa làm

Trước Phase 1 checkpoint:

- không backend;
- không database;
- không auth;
- không CMS;
- không production analytics;
- không over-engineer router;
- không design system component library lớn;
- không tối ưu asset thật khi chưa có asset.

---

# 24. Rủi ro chính

| Rủi ro | Giảm thiểu |
|---|---|
| Asset thật tới muộn | Mock data/geometry không chặn Phase 0–1 |
| Panorama quá nặng | Mobile/desktop asset riêng ở Phase 2 |
| Camera/Radar lệch | Quy ước degree/yaw cố định |
| Map reset khi Back | `mapView` serializable trong store |
| Tour timer lỗi | Tour state riêng + cleanup |
| Codex đổi architecture | `AGENTS.md` + stop conditions |
| Chat hết context | `STATUS.md` + Git |
| Scope phình | Phase scope guard |

---

# 25. Definition of Success cho bản present đầu tiên

Bản present Phase 1 thành công khi người xem có thể:

1. mở app trên màn hình mobile;
2. nhìn thấy map 3D placeholder;
3. xoay/zoom;
4. nhìn Radar quay theo;
5. tap một toà nhà;
6. chuyển sang panorama mock;
7. quay lại đúng view map trước đó;
8. mở thông tin mock;
9. chạy Play/Pause/Next/Prev;
10. không gặp lỗi console nghiêm trọng.

Bản này chưa cần đẹp hoàn thiện.

Nó phải chứng minh rằng **nền tảng interaction architecture đã đúng**.
