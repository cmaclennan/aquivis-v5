# ADR 2025-10-28: UI Color Palette Selection

## Status
Accepted

## Context
We require a consistent, accessible color system for Aquivis v5. Two clean-room palettes were proposed in `UX/design/TOKENS.md`: Palette A (Aquivis Blue) and Palette B (Slate & Teal). Both meet contrast targets when applied correctly.

## Decision
Select Palette A (Aquivis Blue) as the primary palette for v5:
- primary: #2090C3
- primary-600: #1878A3
- primary-50: #E6F4FA
- neutral-900: #0A0A0B
- neutral-700: #3A3B3D
- neutral-300: #D2D4D7
- neutral-100: #F4F5F6
- success: #10B981
- warning: #F59E0B
- danger: #EF4444

Retain Palette B (Slate & Teal) as an alternative documented in TOKENS.md for future A/B or brand refresh.

## Rationale
- Aligns with prior brand direction (blue primary) while remaining clean-room.
- Strong contrast on light backgrounds; accessible status colors available.
- Versatile across dashboard, tables, and wizard flows.

## Consequences
- Implement tokens for Palette A across packages/ui and apps.
- Validate contrast during component implementation.
- Keep Palette B documented but unused unless a change is explicitly approved via new ADR.
