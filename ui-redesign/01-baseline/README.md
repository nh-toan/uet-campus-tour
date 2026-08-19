# UET Navigator UI baseline

## Locked design direction
- Brand mood: modern, minimal, premium, future-facing, technology + human.
- Light mode: school/about + Khoa/Viện.
- Dark mode: map/explorer + community/CLB.
- Main font: Be Vietnam Pro.
- Technical labels: IBM Plex Mono.
- Layout max-width: 1480px.
- Cards: 18px radius; panels 22–36px.
- Primary blue: #146BFF.
- Deep navy: #04152A.
- Main ink: #0A1B33.
- Light surface: #F7FAFE.

## Components represented
- Header / PrimaryNav
- Hero + CampusVisual placeholder
- StatsBar
- Mission/Vision/CoreValue cards
- AcademicUnitCard
- AcademicUnitDetailPanel
- ClubCard
- ClubDetailPanel
- Search / FilterChip

## Integration note
This prototype is layout/design only. In the React UET repo:
- keep DOM/SVG UI in components/
- do not move Three/R3F rendering into components/
- replace the hero visual placeholder with the existing scene/Canvas from scenes/
- map these CSS variables into src/styles/tokens.css rather than introducing a second token system
- use existing Lucide React icons instead of text symbols
- keep faculty/club data typed and separate from rendering
