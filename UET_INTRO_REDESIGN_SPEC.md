# UET Navigator — Intro Page Redesign Spec

> Status: Visual direction approved
> Scope: `/gioi-thieu`
> Goal: Redesign the page from the strategic-content area downward so it feels cohesive, premium, responsive, and consistent with UET Navigator.
> Content rule: Official UET content remains 100% unchanged. This document defines layout, presentation, interaction, tokens, and implementation workflow only.

## 1. Design direction

### Core idea
Turn the current long, fragmented official-information page into a guided editorial experience:

**Context → Direction → Mission/Vision/Values → Key Tasks → Organization → 20+ Years Milestone**

The page should feel like a modern digital university profile, not a stack of unrelated images and text blocks.

### Visual tone
- Modern academic technology
- Clean / premium / institutional
- UET navy as the foundation
- Electric blue for interaction
- Orange only as a restrained highlight
- Generous white space
- Soft borders and subtle glow
- No gaming HUD style
- No excessive glassmorphism
- No oversized decorative graphics competing with content

## 2. Final information architecture

```text
Global Header
↓
Existing Intro Hero
↓
ĐỊNH HƯỚNG PHÁT TRIỂN
    ├── Bối cảnh
    │   ├── Quốc tế
    │   └── Trong nước
    │
    ├── Sứ mạng, tầm nhìn và giá trị cốt lõi
    │   ├── Sứ mạng
    │   ├── Tầm nhìn 2045
    │   ├── Triết lý giáo dục
    │   ├── Giá trị cốt lõi
    │   └── Khẩu hiệu hành động
    │
    └── Nhiệm vụ trọng tâm
        ├── Đào tạo
        ├── Khoa học và công nghệ
        ├── Tổ chức, đội ngũ và quản trị đại học
        └── Hội nhập quốc tế
↓
CƠ CẤU TỔ CHỨC
↓
20+ YEARS BANNER
↓
Footer
```

The 20-year banner becomes the closing visual statement rather than appearing before the main official content.

## 3. Desktop layout

### Existing hero
Keep the current approved hero unchanged.

### Strategic section
Container:

```css
max-width: 1280px;
margin-inline: auto;
padding-inline: 24px;
```

Heading:

```text
ĐỊNH HƯỚNG PHÁT TRIỂN
Nền tảng và tầm nhìn phát triển bền vững
```

The second line is presentation copy only; official content inside panels stays unchanged.

### Primary tabs
Three large segmented cards:

1. Bối cảnh
2. Sứ mạng, tầm nhìn và giá trị cốt lõi
3. Nhiệm vụ trọng tâm

Rules:
- height 64–72px
- radius 10–12px
- active = navy/blue fill, white text
- inactive = white/light surface, navy text
- subtle border
- small icon on left
- no heavy shadows

### Bối cảnh panel

```text
┌────────────┬─────────────────────────────────────────────┐
│ Quốc tế    │                                             │
│ Trong nước │             Official content                │
│            │                                             │
└────────────┴─────────────────────────────────────────────┘
```

Left navigation width: 160–190px. Content line-height: ~1.75. Body: 15–16px. Paragraph gap: 16–20px.

### Mission / Vision / Values
Use 5 visual cards on wide desktop when readable:

```text
Sứ mạng | Tầm nhìn 2045 | Triết lý giáo dục | Giá trị cốt lõi | Khẩu hiệu hành động
```

Cards must not truncate official text. At smaller widths use 2–3 column auto-fit.

### Key Tasks
Use full-width accordion rows. Do not expand all items by default.

### Organization + 20-year ending
Desktop recommendation:

```text
CƠ CẤU TỔ CHỨC

┌───────────────────────────────┐  ┌──────────────────────────┐
│    Organization chart         │  │    20+ year banner       │
│                               │  │                          │
│ [Xem ảnh lớn]                 │  │                          │
└───────────────────────────────┘  └──────────────────────────┘
```

Recommended grid:

```css
grid-template-columns: minmax(0, 1.15fr) minmax(340px, .85fr);
gap: 24px;
```

Reading order remains Organization → 20-year milestone. On narrower screens the banner moves below the chart.

## 4. Mobile design

The mobile version is NOT a scaled-down desktop page.

### General
- page padding: 16px
- card radius: 14–16px
- body: 15–16px
- headings: 28–34px
- minimum touch target: 44px
- section spacing: 48–64px

### Strategic navigation
Preferred mobile pattern:

```text
[ 🌐  Bối cảnh                              > ]
[ ◎   Sứ mạng, tầm nhìn và giá trị cốt lõi > ]
[ ▣   Nhiệm vụ trọng tâm                    > ]
```

Do not shrink text just to fit three long tabs on one row.

### Context sub-navigation

```text
[ Quốc tế ] [ Trong nước ]
```

Then one readable content stream below.

### Mission/Vision cards
Stack one card per row, or 2 columns only when readability remains strong.

### Key Tasks
Full-width accordions with large touch targets.

### Organization chart
Do not try to make every label readable in the inline 390px preview.

```text
┌─────────────────────────┐
│ organization thumbnail  │
│                         │
│  🔍 Xem sơ đồ đầy đủ    │
└─────────────────────────┘
```

Tap opens a fullscreen viewer using `contain`, with a 44px+ close control. Pinch/drag is desirable if feasible without new dependencies.

### 20-year banner
Always appears after organization on mobile. Full width inside 16px gutters. Never crop.

## 5. Color system

### Brand / Accent

| Token | Hex | Usage |
|---|---|---|
| `--uet-navy-950` | `#031426` | deepest dark background |
| `--uet-navy-900` | `#061B33` | primary dark page/header |
| `--uet-navy-800` | `#0B2A4D` | dark cards / active states |
| `--uet-blue-600` | `#146BFF` | primary interaction |
| `--uet-blue-500` | `#2B7FFF` | hover / secondary blue |
| `--uet-cyan-400` | `#31B8FF` | subtle tech accent |
| `--uet-orange-500` | `#FF7A2F` | key highlight only |
| `--uet-orange-400` | `#FF9A55` | softer orange |

### Light theme

| Token | Hex |
|---|---|
| `--page-bg` | `#F7FAFE` |
| `--surface` | `#FFFFFF` |
| `--surface-soft` | `#F1F6FC` |
| `--text-primary` | `#071B35` |
| `--text-secondary` | `#5F7087` |
| `--border` | `#D8E5F2` |
| `--grid-line` | `#EAF1F8` |

### Dark theme

| Token | Hex |
|---|---|
| `--page-bg` | `#06172A` |
| `--surface` | `#0B2038` |
| `--surface-soft` | `#0E2948` |
| `--text-primary` | `#F5F8FC` |
| `--text-secondary` | `#A9BCD0` |
| `--border` | `#1B456E` |
| `--grid-line` | `rgba(79,148,217,.10)` |

Recommended balance:

```text
Navy / neutral: 75–80%
Blue:           15–20%
Orange:         3–5%
```

Orange is an accent, not a dominant theme color.

## 6. Typography

Primary:

```css
font-family: "Be Vietnam Pro", system-ui, sans-serif;
```

Scale:

```text
Hero H1 desktop        56–68px / 800
Section H2 desktop     32–40px / 750–800
Section eyebrow        12px / 700 / letter-spacing .12em
Card title             17–20px / 700
Body desktop           15–16px / 400–500
Body mobile            15–16px / 400–500
Button                  14–15px / 600
```

Do not reduce official body text to tiny sizes to save space.

## 7. Surface styling

Card:

```css
border: 1px solid var(--border);
border-radius: 14px;
background: var(--surface);
box-shadow: 0 10px 30px rgba(3,20,38,.05);
```

Active tab:

```css
background: linear-gradient(135deg, #0B2A4D, #0E4B92);
color: white;
border-color: rgba(43,127,255,.55);
```

Orange underline:

```css
width: 32px;
height: 2px;
background: #FF7A2F;
```

Subtle light grid:

```css
background-image:
  linear-gradient(rgba(20,107,255,.035) 1px, transparent 1px),
  linear-gradient(90deg, rgba(20,107,255,.035) 1px, transparent 1px);
background-size: 48px 48px;
```

## 8. Interaction rules

### Tabs
- semantic `button`
- `role="tab"`
- `aria-selected`
- arrow-key navigation

### Accordion
- semantic button/summary
- `aria-expanded`
- 44px+ tap target
- restrained 180–240ms motion

### Organization lightbox
- portal if using React
- Escape closes
- backdrop closes
- scroll lock
- focus returns to trigger

## 9. Responsive breakpoints

Suggested:

```css
@media (max-width: 1199px) { ... }
@media (max-width: 900px)  { ... }
@media (max-width: 640px)  { ... }
```

Behavior:
- >1200: 3 primary tabs, 5 mission cards if readable, organization + banner side by side
- 901–1199: mission cards 2–3 columns
- 641–900: organization + banner stack
- <=640: 16px gutters, single-column long content, full-width accordion, organization preview + fullscreen viewer, banner below chart

## 10. Content integrity

Source of truth:

```text
docs/UET_INTRO_OFFICIAL_SOURCE.md
```

Runtime:

```text
frontend/src/content/introContent.js
```

Never summarize, rewrite, correct or truncate official content as part of redesign.

# 11. Redesign implementation plan

## CHECKPOINT R1 — Structural redesign
Goal:
- reorder sections
- strategic content before organization
- move 20-year banner to final position
- establish desktop/mobile structural layout

User verifies information order, page rhythm, banner position, organization position and mobile stacking.

**STOP after R1.**

## CHECKPOINT R2 — Strategic component redesign
Implement:
- polished primary tabs
- context sub-tabs
- mission/vision cards
- key-task accordion
- mobile strategic navigation

User verifies tabs, readability, content density and touch usability.

**STOP after R2.**

## CHECKPOINT R3 — Organization + milestone treatment
Implement:
- organization chart card
- fullscreen viewer
- mobile `Xem sơ đồ đầy đủ`
- desktop organization + milestone composition
- mobile stack organization → banner

User verifies chart usability, fullscreen viewer and intentional page ending.

**STOP after R3.**

## CHECKPOINT R4 — Theme / responsive / polish
Validate:
- light / dark
- 1440 / 1024 / 768 / 390
- typography
- spacing
- focus/hover
- overflow

Run:

```bash
npm run check
git diff --check
```

**STOP after R4 for final user acceptance.**

## 12. Scope guard

Do not modify during this redesign:
- `/ban-do`
- external virtual tour integration
- `/lien-chi`
- `/cau-lac-bo`
- backend/API/data
- routes
- dependencies
- approved hero unless explicitly requested

Map integration stays a separate session after Intro is frozen.

## 13. Final acceptance criteria

- strategic content comes before organization/banner
- page feels continuous rather than fragmented
- official text unchanged
- no tiny primary text on mobile
- touch controls >=44px
- organization chart viewable at useful scale
- 20-year banner acts as closing visual statement
- light/dark both intentional
- no horizontal overflow
- `npm run check` PASS
- real-mobile visual approval
