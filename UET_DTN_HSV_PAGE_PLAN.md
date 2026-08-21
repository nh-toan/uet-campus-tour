# UET Navigator — Đoàn Thanh niên – Hội Sinh viên Page Plan

> Status: Visual direction approved
> Scope: New UET Navigator page for Đoàn Thanh niên – Hội Sinh viên (ĐTN–HSV)
> Suggested route: `/doan-thanh-nien-hoi-sinh-vien`
> Navigation position: **Giới thiệu chung → Đoàn Thanh niên – Hội Sinh viên → Liên chi Khoa/ Viện → Câu lạc bộ**
> Source direction: Nội dung hoạt động sẽ bám theo handbook/flipbook UET do người dùng cung cấp.
> Visual direction: modern academic-youth, UET Navigator, navy/white/blue with restrained orange accents.

---

# 1. Product goal

Tạo một tab riêng giới thiệu toàn cảnh hệ sinh thái **Đoàn Thanh niên – Hội Sinh viên UET**, thay vì chỉ liệt kê đơn vị.

Trang phải trả lời theo flow:

1. ĐTN–HSV UET là ai?
2. Hệ thống trực thuộc gồm những gì?
3. Liên chi Đoàn – Hội đóng vai trò gì?
4. 24 CLB trực thuộc đóng vai trò gì?
5. Những hoạt động tiêu biểu của ĐTN–HSV là gì?
6. Người xem có thể đi sâu sang trang Liên chi và Câu lạc bộ ở đâu?
7. Theo dõi ĐTN–HSV UET ở đâu?

---

# 2. Navigation

## Current target order

```text
Bản đồ khuôn viên
Giới thiệu chung
Đoàn Thanh niên – Hội Sinh viên
Liên chi Khoa/ Viện
Câu lạc bộ
```

New display label:

```text
Đoàn Thanh niên – Hội Sinh viên
```

Recommended route:

```text
/doan-thanh-nien-hoi-sinh-vien
```

Do not rename existing routes.

Active underline/state follows current Navigator behavior.

---

# 3. Information architecture

```text
Global Header
↓
ĐTN–HSV Hero
↓
Về Đoàn Thanh niên – Hội Sinh viên UET
    ├── short official introduction
    ├── 8 Liên chi Đoàn – Hội Khoa/Viện
    ├── 1 Cán bộ khối Hiệu bộ
    └── 24 Câu lạc bộ trực thuộc
↓
Liên chi Đoàn – Liên chi Hội trực thuộc
    ├── text introduction
    ├── text list of 8 units + cán bộ khối Hiệu bộ
    └── CTA → trang Liên chi Khoa/ Viện
↓
Các Câu lạc bộ trực thuộc
    ├── text introduction
    ├── category summary / short text
    └── CTA → trang Câu lạc bộ
↓
Hoạt động nổi bật
    ├── Đại hội Đoàn – Hội
    ├── Sinh viên 5 tốt
    ├── Chào tân
    ├── Tập huấn cán bộ Đoàn – Hội
    ├── Chuỗi ngày hội truyền thống
    ├── Markethon
    ├── Code Camp
    ├── Tôi Bản Lĩnh
    ├── VYTEC
    ├── Job Fair UET
    └── Mùa hè xanh UET
↓
Facebook CTA
↓
Footer
```

---

# 4. Important content principle

The **Liên chi** and **Câu lạc bộ** sections should NOT become dense grids of 8 + 24 entity cards.

Approved direction:

- use text first;
- use clear narrative;
- show a compact list or category summary;
- use one contextual image/visual per section if desired;
- provide one strong CTA linking to the dedicated page.

The dedicated pages already own detailed exploration.

Therefore this page should be an **overview / gateway**, not duplicate `/lien-chi` and `/cau-lac-bo`.

---

# 5. Hero section

## Purpose

Immediately communicate that this is the youth/student organization of UET.

## Suggested content structure

```text
[Đoàn logo] [Hội logo]

ĐOÀN THANH NIÊN – HỘI SINH VIÊN UET

Tiên phong – Bản lĩnh – Sáng tạo –
Tình nguyện – Hội nhập

short official introduction...
```

## Visual

Desktop:
- split hero
- text left
- large student/Đoàn–Hội activity image right
- deep navy background
- subtle star/grid/network motif
- blue aura around photo edge
- no excessive neon

Mobile:
- logos + text first
- image below
- single-column
- comfortable 16px body text

Hero should feel youth-oriented but still institutional.

---

# 6. Overview section

## Goal

Explain the organization at a glance.

Recommended 3-part layout:

```text
VỀ ĐOÀN THANH NIÊN – HỘI SINH VIÊN UET

[ short official intro ]

[ 8 + 1 ]
Liên chi Đoàn – Hội Khoa/Viện
& cán bộ khối Hiệu bộ

[ 24 ]
Câu lạc bộ trực thuộc
```

The “8 + 1” and “24” are visual summary numbers, not entity cards.

Desktop:
- intro takes ~40%
- stat 1 ~30%
- stat 2 ~30%

Mobile:
- intro full width
- stats become two stacked/side-by-side cards depending on available width.

---

# 7. Liên chi Đoàn – Liên chi Hội section

## Approved direction

Do not show nine separate cards.

Use a clean editorial block.

Desktop suggestion:

```text
┌──────────────────────────────────────┬─────────────────────┐
│ LIÊN CHI ĐOÀN – LIÊN CHI HỘI       │ contextual photo    │
│                                      │                     │
│ short intro paragraph                │                     │
│                                      │ [Tìm hiểu về        │
│ ✓ Liên chi ...                       │  Liên chi Đoàn-Hội] │
│ ✓ Liên chi ...                       │                     │
│ ✓ ...                                │                     │
└──────────────────────────────────────┴─────────────────────┘
```

Text list includes:
- 8 Liên chi Đoàn – Hội trực thuộc các Khoa/Viện
- 1 Cán bộ khối Hiệu bộ

Exact naming should reuse project/UET source-of-truth, not generated text.

CTA:

```text
Tìm hiểu về Liên chi Đoàn – Hội
```

Target:

```text
/lien-chi
```

Alternative label:

```text
Xem các Liên chi Khoa/ Viện
```

CTA should use current host navigation function, not hard reload if existing app uses SPA pushState.

---

# 8. Câu lạc bộ trực thuộc section

Again: no 24-card duplication.

Recommended structure:

```text
CÁC CÂU LẠC BỘ TRỰC THUỘC

24 câu lạc bộ hoạt động sôi nổi trong nhiều lĩnh vực...
```

Then show category concepts, not individual clubs:

```text
Học thuật – Công nghệ
Nghiên cứu khoa học
Văn hóa – Nghệ thuật
Thể thao – Sức khỏe
Kỹ năng – Cộng đồng
Truyền thông – Sự kiện
```

Use small icons + labels only.

Optional contextual photo on right.

CTA:

```text
Khám phá các Câu lạc bộ
```

Target:

```text
/cau-lac-bo
```

---

# 9. Featured activities section

This is the main visual content body.

Activities requested:

1. Đại hội Đoàn – Hội
2. Sinh viên 5 tốt
3. Chào tân
4. Tập huấn cán bộ Đoàn – Hội
5. Chuỗi ngày hội truyền thống
6. Markethon
7. Code Camp
8. Tôi Bản Lĩnh
9. VYTEC
10. Job Fair UET
11. Mùa hè xanh UET

## Card design

Desktop:
- 4 or 5 cards per row depending width
- image-first card
- dark overlay
- white title
- icon / subtle blue accent
- optional one-line description only if handbook source supports it

Do not fill cards with long text.

Card ratio:

```text
~4:3 or 3:2
```

Prefer a uniform image crop.

Tablet:
- 3 columns

Mobile:
- 1 or 2 columns
- minimum readable text
- no tiny cards

## Interaction

Initial version can be static cards.

Possible later enhancement:
- click → detail modal
- click → handbook anchor/external source

Do not implement detail routing unless explicitly requested.

---

# 10. Facebook CTA

At end of page:

```text
Kết nối với Đoàn Thanh niên – Hội Sinh viên UET
Cập nhật tin tức, sự kiện và hoạt động mới nhất
```

Link:

```text
https://www.facebook.com/DTNHSV.UET.VNU
```

Recommended CTA structure:

```text
[Facebook icon]

Kết nối với Đoàn Thanh niên – Hội Sinh viên UET

[ Theo dõi ngay ]        facebook.com/DTNHSV.UET.VNU ↗
```

Open in new tab with:

```text
target="_blank"
rel="noreferrer noopener"
```

Use Facebook blue only as a contained accent inside the UET Navigator visual system.

---

# 11. Visual system

Reuse existing UET Navigator tokens.

Recommended reference palette:

```text
Deep Navy       #031426
Primary Navy    #061B33
Card Navy       #0B2A4D

Primary Blue    #146BFF
Secondary Blue  #2B7FFF
Cyan Accent     #31B8FF

Orange Accent   #FF7A2F
Soft Orange     #FF9A55

Light BG        #F7FAFE
Surface         #FFFFFF
Soft Surface    #F1F6FC
Main Text       #071B35
Muted Text      #5F7087
Border          #D8E5F2
```

Dark theme:

```text
Dark Page       #06172A
Dark Surface    #0B2038
Dark Soft       #0E2948
Dark Text       #F5F8FC
Dark Muted      #A9BCD0
Dark Border     #1B456E
```

Color balance:

```text
Navy / neutral  75–80%
Blue            15–20%
Orange           3–5%
```

---

# 12. Typography

Use existing:

```text
Be Vietnam Pro
```

Suggested hierarchy:

```text
Hero H1              42–58px desktop
Section H2           28–36px
Section eyebrow      12px uppercase
Body                 15–16px
Stat number          42–56px
Activity card title  16–19px
CTA                  14–16px / 600
```

Mobile:
- H1 34–42px
- H2 26–30px
- body never below 15px

---

# 13. Spacing

Desktop section spacing:

```text
72–88px
```

Tablet:

```text
56–72px
```

Mobile:

```text
44–56px
```

Container:

```text
max-width: 1280px
padding-inline: 24px
```

Mobile gutter:

```text
16px
```

---

# 14. Background pattern

Allowed:
- subtle UET grid
- faint constellation/network lines
- very low-opacity circles/dots
- campus/youth imagery inside cards

Avoid:
- full-page heavy HUD
- glowing neon borders everywhere
- large orange areas

---

# 15. Light / Dark behavior

## Hero
Can remain dark in both themes.

## Body Light
- white / soft blue background
- navy headings
- blue active accents

## Body Dark
- deep navy background
- layered navy cards
- white text
- borders instead of heavy shadows

Images remain unchanged.

---

# 16. Responsive behavior

## >=1200px
- hero split 45/55
- overview 3 columns
- Liên chi and CLB editorial blocks 65/35 or 60/40
- activity 4–5 columns

## 900–1199px
- hero still split if readable
- editorial blocks 55/45
- activity 3 columns

## 640–899px
- hero stacks
- overview stacks
- Liên chi and CLB image moves below or above
- activity 2 columns

## <=639px
- single column
- 16px gutter
- stats can be two columns
- Liên chi text list one column
- category icons 2–3 columns
- activities 1 or 2 columns depending width
- Facebook CTA stacks
- no horizontal overflow

---

# 17. Accessibility

- All navigation and CTA use semantic buttons/anchors.
- Images have meaningful `alt`.
- Decorative icons use `aria-hidden`.
- External Facebook link clearly indicates new tab visually if possible.
- Focus visible.
- Touch targets >=44px.
- Color contrast preserved in light/dark.

---

# 18. Suggested runtime data architecture

Do not hardcode 11 activity cards directly in JSX if avoidable.

Suggested:

```text
frontend/src/content/youthUnionContent.js
```

Example structure:

```js
export const youthUnionOverview = {
  intro: "...",
  affiliatedCount: 8,
  staffUnitCount: 1,
  clubCount: 24,
};

export const affiliatedUnits = [
  "...",
];

export const clubCategories = [
  "...",
];

export const featuredActivities = [
  {
    id: "dai-hoi",
    title: "Đại hội Đoàn – Hội",
    image: "...",
    description: "...",
  },
];
```

Exact text must be populated from handbook/source material.

---

# 19. Asset strategy

Recommended folder:

```text
frontend/public/assets/youth-union/
```

Subfolders if needed:

```text
frontend/public/assets/youth-union/
├── hero/
├── activities/
└── logos/
```

Recommended assets:
- Đoàn logo
- Hội logo
- hero group image
- 11 activity images
- optional Liên chi contextual image
- optional CLB contextual image

Prefer existing official project/handbook assets when available.

Do not use AI-generated event photography as official evidence if official handbook images exist.

---

# 20. Source-of-truth workflow

Before final implementation:

Create:

```text
docs/UET_DTN_HSV_OFFICIAL_SOURCE.md
```

Include:
- handbook/flipbook URL
- Facebook URL
- official introduction
- exact naming
- descriptions for each activity
- activity order
- asset/source notes

Do not silently invent text missing from handbook.

---

# 21. Implementation scope

## Phase A — Source extraction
- Read handbook
- Create source snapshot
- Identify images/content
- No runtime UI changes

## Phase B — Route and navigation
- Add new route
- Add nav item between Giới thiệu chung and Liên chi Khoa/ Viện
- Preserve existing navigation implementation

## Phase C — Page skeleton
- Hero
- Overview
- Liên chi gateway
- CLB gateway
- Activities
- Facebook CTA

## Phase D — Content/assets
- Populate official text
- Use project/handbook assets
- Connect internal CTAs

## Phase E — Responsive/theme polish
- light/dark
- desktop/tablet/mobile
- accessibility
- regression

---

# 22. Scope guard

Do not rewrite:
- `/gioi-thieu`
- `/lien-chi`
- `/cau-lac-bo`
- `/ban-do`
- backend APIs
- Map integration

Only shared navigation may change to insert the new tab.

Do not add dependencies unless strictly necessary.

---

# 23. Acceptance criteria

The page is accepted when:

- New tab is between Giới thiệu chung and Liên chi Khoa/ Viện.
- Route works with browser back/forward.
- Hero clearly communicates ĐTN–HSV identity.
- Overview shows 8 Liên chi + 1 Cán bộ khối Hiệu bộ + 24 CLB.
- Liên chi section is editorial/textual, not 9 entity cards.
- Liên chi CTA opens `/lien-chi`.
- CLB section is editorial/category-based, not 24 entity cards.
- CLB CTA opens `/cau-lac-bo`.
- All 11 requested activity groups are present.
- Facebook CTA links to `https://www.facebook.com/DTNHSV.UET.VNU`.
- Light/dark both work.
- Mobile does not make text/cards tiny.
- No horizontal overflow.
- `npm run check` passes.
- Existing four routes remain functional.

---

# 24. Final visual rhythm

```text
Dark Hero
↓
White/light Overview card overlapping hero edge slightly
↓
Liên chi editorial section
↓
thin divider
↓
CLB editorial section
↓
Featured Activities image grid
↓
Facebook navy/blue CTA
↓
Dark Footer
```

This rhythm is the approved visual direction.
