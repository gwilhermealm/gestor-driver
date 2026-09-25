---
name: Gestor Drive Cockpit
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#93ccff'
  on-secondary: '#003351'
  secondary-container: '#3198dc'
  on-secondary-container: '#002c47'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-currency:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.03em
  display-currency-mobile:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  metric-tabular:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system powers an executive-grade mobile telemetry and financial cockpit built specifically for rideshare and logistics operators. The target audience comprises performance-driven on-demand drivers who need instant, high-contrast legibility across rapid context shifts—from glaring daytime cabin sunlight to pitch-black nighttime driving conditions. 

The aesthetic is precision-engineered minimalism blended with high-density data cockpits. It avoids decorative clutter in favor of tactical clarity, strict functional hierarchies, and immediate visual feedback. Key emotional drivers are control, profitability, speed, and operational resilience. The visual language utilizes luminous status indicators against a deep slate void, translating complex tax, fuel, and trip metrics into decisive glanceable figures.

## Colors
The system operates exclusively in an optimized dark mode to eliminate cabin glare, preserve night vision, and conserve OLED battery consumption during long shifts.

- **Primary (`#10B981` - Profit Emerald):** Reserved strictly for positive cashflow, net earnings, surplus metrics, and confirmation actions. It is the color of revenue and success.
- **Secondary (`#0284C7` - Telemetry Cyan):** Powers primary vehicle actions, navigation targets, active run time, efficiency scoring, and interactive UI states.
- **Tertiary (`#F59E0B` - Maintenance Amber):** Signals operating costs, fuel burns, platform service fees, urgent vehicle alerts, and expense entries.
- **Surface & Background Neutral (`#0F172A` - Deep Void Slate):** Serves as the bedrock canvas. Layered cards, telemetry tiles, and navigation tiers rise above this base through measured slate tonal steps (`#1E293B` for elevated containers, `#334155` for structural borders, and `#64748B` for subdued metadata).
- **Text & Foreground Neutral (`#F8FAFC` - Pure Slate):** Provides crisp, high-contrast legibility for primary values, backed by `#94A3B8` for secondary metric labels.

## Typography
Typography is tuned for split-second legibility at arm's length (dashboard phone mounts). 

- **Headline & Numeric Display (`Manrope`):** Geometric, robust, and open. The geometric numbers provide clear structural differentiation between digits (such as 8, 0, and 6) under extreme motion or brief driver checks. Currency formatting (`R$`) always adopts proportional tabular figures via `font-variant-numeric: tabular-nums` to prevent layout jitter during real-time value increments.
- **Body & Data (`Hanken Grotesk`):** Clean, sharp, neutral sans-serif providing tight tracking, distinct apertures, and clear legibility at compact sizes (`12px`-`14px`).
- **Caps Hierarchy (`label-caps`):** Used strictly for metric tags (e.g., `LUCRO LÍQUIDO`, `KM RODADOS`, `META DIÁRIA`) set with purposeful uppercase tracking for scan efficiency.

## Layout & Spacing
The layout model is mobile-first, engineered around a compact 4-column fluid grid tailored to single-handed in-cab use, expanding to an 8-column layout on tablets and dashboard-mounted widescreen tablets.

- **Touch Zones & Ergonomics:** All actionable control surfaces maintain a minimum touch target of 48px × 48px. Primary transaction triggers and the bottom command deck reside in the bottom third of the viewport (the natural thumb arc).
- **Rhythm & Padding:** Metric tiles utilize tight internal gap spacing (`space-sm` / 8px) with card padding locked to `space-md` (16px). Outer container margins remain at 16px (`1rem`) on standard mobile devices, expanding to 24px on tablets. Section-to-section flow adheres to a strict 16px baseline increment to maintain visual cadence.

## Elevation & Depth
Depth in the system avoids heavy, muddy drop shadows in favor of crisp tonal stacking and precise, translucent borders:

- **Level 0 (Base Canvas):** Solid `#0F172A`. All base backgrounds, dashboard surfaces, and full-screen layouts start here.
- **Level 1 (Telemetry Cards & Tiles):** Surface `#1E293B` elevated by a 1px structural outline of `rgba(255, 255, 255, 0.08)`. This keeps borders sharp without causing high-contrast distraction.
- **Level 2 (Active Sheets & Modals):** Surface `#243248` with a 1px border of `rgba(255, 255, 255, 0.14)` and a subtle directional ambient shadow: `0 8px 32px -4px rgba(0, 0, 0, 0.45)`.
- **Level 3 (Fixed Cockpit Deck / Bottom Nav):** Floating dock at `#0F172A` with `backdrop-filter: blur(16px)`, backed by a top rim highlight: `border-top: 1px solid rgba(255, 255, 255, 0.1)`.
- **Glow Accents:** Focused interactive elements receive subtle color-matched luminescence (e.g., net revenue cards have an inset edge glow of `0 0 12px rgba(16, 185, 129, 0.15)`).

## Shapes
The system relies on roundedness level `2` (8px base corner radius), balancing structural precision with tactile friendliness.

- **Base Components (Inputs, Chips, Small Tiles):** 8px (`0.5rem`) corner radius.
- **Cards & Data Modules (`rounded-lg`):** 16px (`1rem`) corner radius, creating clear visual clustering of financial data points.
- **Modals, Drawers & Action Deck (`rounded-xl`):** 24px (`1.5rem`) top radius, indicating draggable sheets and interactive depth.
- **Pill Badges & Action Buttons:** Full pill borders (`9999px`) are reserved solely for live telemetry pills (e.g., `● EM CORRIDA`) and floating action triggers.

## Components

### Metric Tiles (KPI Cards)
Constructed on `#1E293B` with 16px radius and a 1px border (`#334155`). Tile headers feature `label-caps` in `#94A3B8`, accompanied by an icon tinted according to category. The primary number is rendered using `metric-tabular` in `#F8FAFC`. If the tile displays profit, the typography renders in `#10B981`; if expenses, it renders in `#F59E0B`. Sub-values display percentage variance vs. yesterday with mini directional pill indicators.

### Brazilian Real (R$) Currency Badges & Displays
All financial totals feature explicit, standardized formatting: large bold integer values, smaller decimal super-scripts, and a muted, smaller prefix (`R$` in `#94A3B8` weight 600). Positive earnings are paired with a 2px micro-indicator bar in `#10B981` on the left card perimeter.

### Bottom Cockpit Deck & "Registrar" Center Action
A fixed floating dock spans the bottom viewport edge with safe-area padding. 
- Side destinations (Visão Geral, Corridas, Despesas, Relatórios) use 24px iconography with subtle 10px captions in `#64748B`, transitioning to `#0284C7` when active.
- Center Action (`Registrar`): A raised, prominent 56px circular action button or rounded pill elevating above the deck line. It features a solid `#10B981` fill with an interior `#0F172A` bold plus/trip icon, enveloped by a subtle pulse ring (`box-shadow: 0 0 20px rgba(16, 185, 129, 0.4)`). Tapping triggers a swift bottom modal sheet for rapid entry of rides, fuel, and daily operating expenses.

### Buttons & Interactive Controls
- **Primary Action:** Solid `#10B981` fill with `#0F172A` text (weight 700), height 48px, radius 8px.
- **Secondary Action (Vehicle/Service):** Solid `#0284C7` with `#FFFFFF` text.
- **Ghost/Outline:** 1px border of `#475569`, background transparent, text `#F8FAFC`.
- **Haptic Press Effect:** All buttons transform on press (`transform: scale(0.98); transition: transform 0.1s ease`).

### Input Fields & Rapid Keypads
Tailored for entry while parked. 52px minimum height, background `#0F172A`, border 1px `#334155`. On active focus, the border shifts to `#0284C7` with a matching 2px outer glow. Labels sit above inputs in `label-caps`. For monetary inputs, the `R$` token is pinned permanently to the left in `#94A3B8`.

### Telemetry Progress Bars (Daily Goal Trackers)
Trackers feature a track background of `#0F172A` with a 1px inset border and 8px height. Filled portions use a gradient from `#0284C7` to `#10B981` with rounded ends. When the daily target is reached (100%), the progress bar shifts to solid `#10B981` with an active shimmer overlay.