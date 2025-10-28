# UI Tokens (Draft)

All tokens are authored clean-room. No code or assets copied.

## Color

Two palette proposals; Palette A is selected. Palette B retained for future consideration.

### Palette A – Aquivis Blue (Selected)
- primary: #2090C3 (buttons, active accents)
- primary-600: #1878A3
- primary-50: #E6F4FA
- neutral-900: #0A0A0B (text)
- neutral-700: #3A3B3D (secondary text)
- neutral-300: #D2D4D7 (borders)
- neutral-100: #F4F5F6 (surfaces)
- success: #10B981
- warning: #F59E0B
- danger: #EF4444

### Palette B – Slate & Teal (Alternative; not active)
- primary: #0EA5A6
- primary-600: #0B8687
- primary-50: #E5FAFA
- neutral-900: #0B0C0F
- neutral-700: #363A3F
- neutral-300: #CDD1D6
- neutral-100: #F5F7F9
- success: #0BBF7A
- warning: #F2A900
- danger: #E23D3D

Status colors require text/icon + color (not color alone) and 4.5:1 contrast where applicable.

## Typography
- Family: Inter (or Manrope). Poppins acceptable if preferred; use one consistently.
- Scale:
  - h1 32/40 semibold
  - h2 24/32 semibold
  - h3 20/28 medium
  - body 16/24 regular
  - caption 12/16 regular

## Spacing
- Base unit: 8px. Common spacings: 4, 8, 12, 16, 24, 32, 48.

## Radii
- Control: 8px; Cards: 12–16px; Modals: 16px.

## Shadows
- Card: 0 1px 2px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.08)
- Popover: 0 8px 24px rgba(0,0,0,0.14)

## Motion
- Standard: 150–200ms ease-out for UI; 250–300ms for overlays
- Respect `prefers-reduced-motion`
