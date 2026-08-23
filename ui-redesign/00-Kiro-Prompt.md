# UET NAVIGATOR — UI REDESIGN & INTEGRATION SESSION

Bạn đang làm việc trên dự án **UET Navigator / UET Virtual Campus Tour**.

Mục tiêu của session này là chuẩn bị và sau khi được phê duyệt sẽ triển khai **redesign toàn bộ frontend UI** theo design baseline mới, trong khi **giữ nguyên engine 3D, state model, data contract và kiến trúc nền tảng hiện tại**.

Không được coi đây là một dự án frontend mới.

**Repo hiện tại là host architecture. UI mới chỉ được tích hợp vào kiến trúc hiện có.**

---

# 1. BỐI CẢNH SẢN PHẨM

UET Navigator là trải nghiệm số giúp:

- phụ huynh;
- sinh viên;
- tân sinh viên;
- người ngoài trường;

khám phá Trường Đại học Công nghệ — ĐHQGHN tại Hòa Lạc.

Sản phẩm có hai nhóm chức năng chính:

1. **Khám phá không gian UET**
   - bản đồ khuôn viên;
   - trải nghiệm 3D;
   - địa điểm;
   - navigation/spatial exploration.

2. **Khám phá UET như một cộng đồng**
   - giới thiệu trường;
   - Khoa / Viện;
   - Liên chi;
   - Câu lạc bộ;
   - cộng đồng sinh viên;
   - thông tin liên quan.

North Star của sản phẩm:

> **UET Navigator không phải website chứa bản đồ UET. Nó là một trải nghiệm khám phá UET bằng không gian, câu chuyện và cộng đồng.**

Luồng cảm nhận mong muốn:

> **“UET là gì?” → “Ở UET có gì?” → “Tôi muốn tự khám phá.”**

---

# 2. TINH THẦN THIẾT KẾ

Thiết kế phải convey:

- công nghệ;
- tương lai;
- tối tân;
- chính xác;
- tối giản;
- hiện đại;
- đáng tin cậy;
- premium;
- human-centered technology.

Không theo hướng:

- cyberpunk;
- gaming UI;
- neon quá mức;
- sci-fi dashboard dày đặc;
- glassmorphism tràn lan.

Design thesis:

> **Future Campus / Human Technology**

Có thể hiểu là:

> **Precision. Space. Motion. Information. Technology. Human.**

Identity chính thức của UET cần được phản ánh qua tinh thần:

> **Innovative Thinking for the Future**

và triết lý:

> **Sáng tạo và vun đắp giá trị nhân văn của công nghệ.**

---

# 3. TÀI LIỆU PHẢI ĐỌC TRƯỚC

Trước khi đề xuất hoặc sửa bất kỳ code nào, hãy tìm và đọc kỹ các tài liệu sau nếu chúng tồn tại trong repo/project:

1. `Review frontend UI.txt`
   - đây là audit frontend/UI được bàn giao trước đây;
   - chứa đánh giá về component, asset, dependency và merge strategy.

2. UI baseline/prototype, nếu đã được thêm vào repo:
   - `uet-navigator-ui-baseline.zip`
   - hoặc thư mục tương ứng:
     - `index.html`
     - `faculties.html`
     - `clubs.html`
     - `styles.css`
     - `README.md`

3. Tài liệu kiến trúc / status / phase hiện có trong repo.

4. Toàn bộ source frontend hiện tại có liên quan:
   - app entry;
   - routing/navigation;
   - components;
   - scenes;
   - store;
   - config;
   - styles/tokens;
   - assets.

Không được giả định nội dung của file chưa đọc.

---

# 4. KIẾN TRÚC HIỆN TẠI — HARD CONSTRAINTS

Dự án hiện tại sử dụng:

- React 19;
- Vite;
- TypeScript strict;
- Three.js;
- React Three Fiber;
- Drei;
- Zustand;
- Tailwind CSS v4;
- Lucide React;
- mobile-first.

Các nguyên tắc kiến trúc bắt buộc:

### `components/`

Chỉ chứa:

- DOM React;
- SVG React;
- UI logic.

**Không được import:**

- Three.js;
- React Three Fiber;
- Drei.

---

### `scenes/`

Chứa:

- Three.js;
- R3F;
- Drei;
- Canvas;
- camera;
- controls;
- 3D scene logic.

UI redesign **không được phá hoặc thay thế engine này**.

---

### `config/`

Chỉ chứa:

- typed data;
- configuration;
- immutable/static content structures khi phù hợp.

Không chứa:

- rendering logic;
- state logic;
- React component;
- live Three object.

---

### `store/`

Không được lưu:

- Three.js live objects;
- scene instances;
- mesh;
- camera;
- controls;
- texture instances.

Không thay state model hiện tại nếu chưa có lý do rõ ràng và chưa được phê duyệt.

---

### Brand tokens

`src/styles/tokens.css`

là:

> **source of truth duy nhất cho brand/design tokens.**

Không tạo một `:root` token system thứ hai trong production.

---

### Dependency

**Không tự thêm dependency.**

Nếu cảm thấy cần package mới:

1. giải thích lý do;
2. chỉ ra vì sao dependency hiện tại không đủ;
3. dừng;
4. chờ phê duyệt.

Không downgrade hoặc thay đổi:

- React;
- Vite;
- TypeScript;
- Three ecosystem;

để phù hợp với frontend donor cũ.

---

# 5. FRONTEND DONOR CŨ — CÁCH NHÌN NHẬN

Frontend được bàn giao trước đây chỉ được coi là:

> **donor UI / donor content**

không phải architecture mới.

Không được:

- copy toàn bộ frontend cũ;
- copy nguyên `App.jsx`;
- copy router tự chế;
- copy backend Node;
- copy global CSS;
- copy fake CSS 3D map;
- copy `node_modules`;
- copy `dist`;
- copy asset không qua audit.

Các phần donor đáng tham khảo:

- Khoa / Viện directory;
- Liên chi;
- CLB directory;
- card layout;
- detail behavior;
- modal/detail concepts;
- handbook viewer nếu task sau này cần;
- content/data;
- logos sau khi kiểm tra và optimize.

---

# 6. DESIGN BASELINE V1 — ĐÃ CHỐT

Các quyết định dưới đây được xem là **locked baseline**.

Không tự ý thay đổi nếu chưa trao đổi.

---

## 6.1 Typography

Font UI chính:

> **Be Vietnam Pro**

Dùng cho:

- heading;
- body;
- navigation;
- card;
- button;
- UI text.

Font technical/metadata:

> **IBM Plex Mono**

Chỉ dùng cho các chi tiết như:

- `UET / HÒA LẠC`;
- `K71`;
- category technical label;
- faculty code;
- campus node;
- coordinate;
- metadata nhỏ.

Không dùng monospace cho paragraph dài.

### Quan trọng

Không tự thêm Google Fonts/runtime dependency vào production.

Trước khi triển khai font, kiểm tra hệ thống font hiện tại.

Nếu cần thay đổi cách load/self-host/font dependency thì phải báo trước.

---

# 7. COLOR SYSTEM — LOCKED

## Deep Navy

```css
--navy-950: #04152A;
--navy-900: #082443;
--navy-850: #0B2D52;
--navy-800: #10395F;
```

Dark background chính:

```css
#04152A
```

Không dùng pure black làm nền chính.

---

## Primary Blue

```css
--blue-700: #0A56D8;
--blue-600: #146BFF;
--blue-500: #2F80FF;
--blue-400: #59A1FF;
--cyan-400: #4CC9FF;
```

Primary action:

```css
#146BFF
```

Cyan chỉ dùng tiết chế cho:

- map node;
- selected state;
- technical signal;
- hover;
- nhỏ/highlight.

Không dùng cyan/neon cho mọi card.

---

## Text

```css
--ink-950: #0A1B33;
--ink-800: #23364F;
--ink-600: #5D6D83;
--ink-500: #728197;
```

---

## Light surfaces

```css
--white: #FFFFFF;
--surface: #F7FAFE;
--surface-2: #EEF4FB;
--surface-3: #E7EFF8;
```

---

# 8. HAI VISUAL MODES

Toàn bộ sản phẩm dùng cùng design language nhưng có hai mode.

---

## STORY MODE — LIGHT

Dùng cho:

- Về UET;
- giới thiệu trường;
- Khoa;
- Viện;
- Liên chi;
- institutional content;
- academic content.

Visual:

- white;
- soft grey;
- deep navy typography;
- electric blue;
- technical grid rất nhẹ;
- nhiều whitespace.

Không dùng ảnh campus tối làm global background.

Không heavy glassmorphism.

---

## EXPLORER MODE — DARK

Dùng cho:

- bản đồ;
- campus explorer;
- spatial navigation;
- CLB/community khi phù hợp.

Visual:

- `#04152A`;
- `#082443`;
- white text;
- electric blue;
- cyan signal;
- thin borders;
- subtle glow.

Dark UI phải sophisticated, không giống game dashboard.

---

# 9. GLOBAL LAYOUT

Maximum content width:

```css
1480px
```

Desktop header:

```css
height: 76px
```

Header:

- sticky;
- nền trắng gần opaque;
- blur nhẹ;
- đường border mảnh.

Không dùng pill màu đen lớn để biểu thị nav active.

Active nav:

- blue text;
- underline nhỏ khoảng 22 × 3px.

---

# 10. SPACING SYSTEM

Ưu tiên scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Không tạo spacing ngẫu nhiên nếu không có lý do.

---

# 11. BORDER RADIUS

Locked family:

```text
small      12px
card       18px
panel      22–28px
hero       36px
```

Button:

```text
12px
```

Pill chỉ dùng cho:

- filter;
- category;
- tag;
- status.

Không biến mọi button thành pill.

---

# 12. SHADOW / DEPTH

Light card:

```css
0 8px 24px rgba(10,27,51,.08)
```

Hover:

```css
0 18px 48px rgba(10,27,51,.12)
```

Selected blue:

```css
0 18px 50px rgba(20,107,255,.18)
```

Dark mode ưu tiên:

- border;
- contrast;
- subtle glow;

hơn là heavy shadow.

---

# 13. TECHNICAL GRID

Có thể dùng background grid rất nhẹ.

Khoảng grid:

```css
46px
```

Opacity chỉ khoảng:

```text
3–4%
```

Không tăng grid lên mức gây distraction.

Technical grid là decorative signature, không phải foreground visual.

---

# 14. MOTION PRINCIPLES

Small UI interaction:

```text
150–220ms
```

Panel/detail transitions:

```text
220–320ms
```

Map/camera transition:

```text
400–700ms
```

Không bounce quá mức.

Không gratuitous animation.

Motion phải:

> precise / smooth / intentional.

Tôn trọng:

```css
prefers-reduced-motion
```

---

# 15. INFORMATION ARCHITECTURE MỚI

Global navigation mục tiêu:

```text
UET NAVIGATOR

Khám phá
Về UET
Khoa & Viện
Cộng đồng
```

Không ưu tiên từ “Liên chi” ở global nav vì người ngoài trường/phụ huynh có thể không hiểu.

“Liên chi” vẫn xuất hiện trong page/category/detail.

---

# 16. TRANG GIỚI THIỆU UET — TARGET STRUCTURE

Không giữ layout editorial serif/coral hiện tại.

Target:

```text
HEADER

HERO
├── concise story/headline
├── short description
├── CTA
└── CAMPUS VISUAL / CURRENT 3D ENGINE

STATS BAR

VỀ UET
├── main statement
├── Sứ mệnh
├── Tầm nhìn
├── Giá trị cốt lõi
└── future statement / quote
```

---

## Hero

Desktop approximate proportion:

```text
COPY       CAMPUS
40%        60%
```

3D campus / current map scene phải là visual star.

Không biến map thành background mờ phía sau một hero text khổng lồ.

Không thay existing R3F scene bằng CSS fake map.

---

## Hero heading

Sans-serif mạnh.

Không serif.

Không italic coral.

Target typography approximately:

```css
font-size: clamp(42px, 5vw, 76px);
line-height: .98;
letter-spacing: -0.045em;
font-weight: 800;
```

---

## Stats bar

Layout desktop:

```text
4 columns
```

Có thể chứa các loại thông tin:

```text
Khoa & Viện
Câu lạc bộ
Năm phát triển
Sinh viên / cộng đồng
```

Số liệu thực tế phải được xác minh sau.

**Không fake số liệu production.**

---

# 17. KHOA / VIỆN / LIÊN CHI — TARGET UI

Desktop:

```text
LEFT
Directory / cards

RIGHT
Selected detail panel
```

Target component structure:

```tsx
<AcademicUnitGrid />
<AcademicUnitCard />
<AcademicUnitDetailPanel />
```

Data không hard-code trực tiếp vào component nếu đã có typed config/data.

---

## AcademicUnitCard

Mỗi unit là một component instance.

Không viết 8 layout khác nhau bằng tay.

Card hierarchy:

```text
LOGO

LIÊN CHI · KHOA
hoặc
LIÊN CHI · VIỆN

Tên đơn vị

CODE
English/domain descriptor

Xem giới thiệu →
```

Desktop:

```text
4 columns
```

Không quay lại 7 card trên một hàng.

Card cần đủ lớn để người dùng nhớ từng đơn vị.

---

## Selected state

Selected card:

- primary blue border;
- subtle blue shadow;
- không excessive glow.

Click card trên desktop:

> cập nhật panel bên phải.

Không bắt buộc mở modal.

---

## AcademicUnitDetailPanel

Desktop sticky panel.

Possible structure:

```text
VISUAL / LOGO

Tên Khoa / Viện
CODE
Descriptor

Short description

Metrics nếu dữ liệu thật tồn tại

Lĩnh vực đào tạo & nghiên cứu
[tag] [tag] [tag]

Official site
Chương trình đào tạo
Tin tức & sự kiện

Primary CTA
```

Nếu không có số liệu thật:

- bỏ metric;
- không invent data.

---

# 18. CÂU LẠC BỘ — TARGET UI

Target components:

```tsx
<ClubFilters />
<ClubGrid />
<ClubCard />
<ClubDetailPanel />
```

Desktop directory:

```text
4 columns
```

Tablet:

```text
3 columns
```

Mobile:

```text
1–2 columns tùy viewport
```

Không hiển thị 7 cards trên một row.

---

## Club filters

Category hiện có:

```text
Tất cả
Học thuật
Công nghệ
Nghệ thuật
Thể thao
Truyền thông
Cộng đồng
```

Filter phải là interaction thật, không chỉ decorative.

Không tạo mỗi category một hệ màu branding riêng.

---

## ClubCard

Hierarchy:

```text
LOGO

CATEGORY

Tên CLB

Short domain/descriptor

Khám phá →
```

Không nhồi full description.

Nếu cần description:

- tối đa khoảng 2–3 dòng;
- consistent line clamp.

---

## ClubDetailPanel

Desktop:

```text
LOGO
Tên CLB
UET Hòa Lạc · Category

Introduction

Điểm nổi bật

Hoạt động tiêu biểu

Xem chi tiết
Fanpage
```

Khi có ảnh:

- event;
- workshop;
- project;
- community activities.

Desktop ưu tiên side detail panel.

Mobile có thể trở thành:

- full-width detail;
- bottom sheet;
- fullscreen sheet;

nhưng phải đề xuất trước khi implement.

---

# 19. IMAGE / ASSET POLICY

Không khóa layout vào một ảnh cụ thể.

Các visual slot phải cho phép thay asset sau này.

About:

- current R3F scene;
- campus render;
- drone photo;
- architecture render.

Faculty:

- official logo;
- faculty photo;
- lab;
- research visual.

Club:

- official logo;
- activity;
- event;
- member;
- project.

---

## Asset optimization

Không đưa nguyên asset quá lớn vào production.

Frontend donor từng có asset rất lớn, ví dụ logo hàng nghìn pixel và hàng chục MB.

Mọi asset cần:

- audit;
- dimensions;
- file size;
- provenance;
- optimization.

Không tự convert format nếu task chưa cho phép.

Nếu đề xuất WebP/AVIF/downscale:

- ghi rõ source;
- output;
- expected benefit;
- chờ approval nếu đó là thay đổi asset.

---

# 20. ACCESSIBILITY

Không giảm accessibility để đạt visual.

Phải giữ hoặc cải thiện:

- semantic HTML;
- keyboard navigation;
- visible focus;
- Escape close;
- `aria-*` khi cần;
- reduced motion;
- sufficient contrast;
- touch target mobile.

Nếu dùng detail dialog/sheet:

- focus management;
- restore focus;
- scroll lock;
- keyboard support.

---

# 21. RESPONSIVE

Mobile-first vẫn là nguyên tắc dự án.

Desktop mockup chỉ là target visual.

### Desktop

Faculty / Club:

```text
4-column directory
+ detail panel
```

### Tablet

Có thể:

```text
3 columns
+ narrower detail
```

hoặc chuyển detail xuống dưới khi không đủ không gian.

### Mobile

Target:

```text
compact header

hero:
copy
↓
map

directory:
1–2 columns

detail:
full width / sheet
```

Không chỉ “shrink desktop”.

---

# 22. TUYỆT ĐỐI KHÔNG LÀM

Không:

- rewrite toàn bộ app;
- replace engine 3D;
- đổi state contract tùy tiện;
- đổi architecture;
- thêm router/package vì frontend donor từng làm khác;
- thêm animation package;
- thêm UI framework;
- thêm icon package;
- copy donor global CSS;
- tạo design token system thứ hai;
- đưa Three/R3F vào `components/`;
- đưa rendering/state logic vào `config/`;
- đưa Three live object vào Zustand;
- merge backend donor;
- merge admin editor donor;
- hard-code production credential;
- đưa `node_modules`/`dist` donor;
- tự merge mọi asset donor;
- fake production data.

---

# 23. CÁCH LÀM VIỆC TRONG SESSION NÀY

## PHASE A — AUDIT ONLY

Trước tiên:

1. đọc tài liệu;
2. đọc repo;
3. xác định current app composition;
4. xác định current routes/navigation;
5. xác định current components;
6. xác định current scene integration;
7. xác định current token system;
8. xác định current responsive strategy;
9. xác định current data/config for:
   - faculty;
   - institute;
   - liên chi;
   - club;
10. xác định asset hiện tại;
11. xác định phần UI nào đã tồn tại và có thể skin/reuse;
12. xác định phần nào phải tách thành component mới.

**Không sửa code trong Phase A.**

---

# 24. OUTPUT PHASE A

Trả về một báo cáo có các phần:

## A. Current architecture

Cấu trúc app hiện tại liên quan tới UI redesign.

---

## B. Current UI composition

Các page/shell/component hiện tại.

---

## C. Existing reusable pieces

Những gì có thể giữ.

---

## D. Components cần tạo hoặc refactor

Ví dụ:

```text
AppHeader
AboutHero
CampusStats
UetPrinciples
AcademicUnitCard
AcademicUnitGrid
AcademicUnitDetailPanel
ClubFilters
ClubCard
ClubGrid
ClubDetailPanel
```

Nhưng chỉ kết luận sau khi đọc source thật.

---

## E. Token migration map

Map baseline design vào:

```text
src/styles/tokens.css
```

Chỉ proposal.

Chưa sửa.

---

## F. Route/page integration map

Mỗi UI feature sẽ gắn vào đâu.

---

## G. 3D integration boundary

Chỉ rõ:

- DOM layer;
- scene layer;
- nơi current Canvas/scene được giữ;
- cách hero/map UI overlay tương tác mà không phá scene.

---

## H. Data integration map

Chỉ rõ data hiện tại của:

- Khoa;
- Viện;
- Liên chi;
- CLB;

được đọc ở đâu và component consume thế nào.

Không đổi contract nếu không cần.

---

## I. Asset plan

Asset nào dùng lại.

Asset nào cần optimize.

Asset nào chưa rõ license/provenance.

---

## J. Implementation sequence

Chia task nhỏ, rollback được.

Ưu tiên:

1. tokens;
2. primitives;
3. header;
4. academic directory;
5. club directory;
6. about/story UI;
7. map/hero UI integration;
8. responsive;
9. accessibility/performance cleanup.

Nhưng điều chỉnh theo source thực tế.

---

## K. Risk matrix

Cho từng task:

```text
Low
Medium
High
```

và lý do.

---

## L. Files expected to change

Liệt kê cụ thể.

Không dùng mô tả chung chung.

---

# 25. DỪNG SAU AUDIT

Sau khi hoàn thành Phase A:

> **DỪNG.**

Không sửa source.

Không tạo commit.

Không install dependency.

Không refactor “tiện tay”.

Chờ tôi phê duyệt implementation plan.

---

# 26. SAU KHI ĐƯỢC APPROVE

Khi tôi đồng ý implementation plan:

Mỗi task phải:

1. phạm vi nhỏ;
2. nêu file sẽ sửa;
3. nêu invariant không được phá;
4. implement;
5. chạy validation;
6. báo diff summary;
7. dừng để review nếu task có blast radius đáng kể.

Không tự chạy hết toàn bộ redesign trong một commit lớn.

---

# 27. VALIDATION BẮT BUỘC SAU MỖI IMPLEMENTATION TASK

Tùy scripts repo thực tế, tối thiểu phải kiểm tra:

- TypeScript;
- lint;
- build;
- relevant tests nếu có.

Ngoài ra kiểm tra architecture invariants:

- `components/` không import Three/R3F/Drei;
- `config/` không có rendering/state logic;
- Zustand không chứa Three live object;
- không tạo brand tokens ngoài source of truth;
- không thêm dependency chưa duyệt;
- không phá mobile;
- không phá current 3D map;
- không phá current state/data contract.

---

# 28. GIT SAFETY

Trước mọi implementation:

- kiểm tra branch;
- kiểm tra working tree;
- không ghi đè user changes;
- không reset;
- không checkout/merge/rebase branch ngoài phạm vi nếu chưa được yêu cầu;
- không force push;
- không amend commit cũ nếu chưa được yêu cầu.

Mỗi commit sau này nên nhỏ, semantic và dễ rollback.

---

# 29. ƯU TIÊN THỰC TẾ

Mục tiêu không phải pixel-perfect ngay lập tức.

Thứ tự ưu tiên:

1. architecture safety;
2. coherent information architecture;
3. component system;
4. visual hierarchy;
5. responsive;
6. accessibility;
7. exact polish.

Không hy sinh kiến trúc để giống mockup 100%.

---

# 30. FINAL DESIGN NORTH STAR

Khi phải chọn giữa hai giải pháp UI, ưu tiên giải pháp khiến UET Navigator cảm thấy giống:

> **một cánh cửa số hiện đại dẫn vào UET Hòa Lạc**

hơn là:

> **một website trường học truyền thống**

và cũng không biến nó thành:

> **một dashboard sci-fi/gaming.**

Người dùng sau khi trải nghiệm cần nhớ được:

- UET là trường công nghệ hướng tới tương lai;
- Hòa Lạc là không gian campus quan trọng;
- UET có hệ sinh thái Khoa/Viện đa dạng;
- đời sống Liên chi/CLB phong phú;
- bản đồ là trung tâm của trải nghiệm khám phá.

---

# NHIỆM VỤ BÂY GIỜ

Bắt đầu **PHASE A — AUDIT ONLY**.

Đọc source và tài liệu thực tế trước.

Sau đó trả về báo cáo A–L như mô tả ở trên.

**Không sửa code trước khi tôi phê duyệt plan.**