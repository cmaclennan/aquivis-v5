# Accessibility Guidelines (Draft)

## Contrast & Color
- Text contrast ≥ 4.5:1; large text ≥ 3:1
- Status = color + icon + label; never color-only indicators

## Keyboard & Focus
- All interactive elements reachable via Tab/Shift+Tab
- Visible focus rings; logical order; skip-to-content link

## Semantics & Labels
- Use semantic elements; ARIA only to supplement semantics
- Form controls have associated labels and described-by for errors

## Motion & Timing
- Honor prefers-reduced-motion; no essential info conveyed via motion
- Toasts remain long enough to read; offer undo where applicable

## Error Handling
- Clear messages near the field; summary for form-level errors

## Testing
- Keyboard-only test per page; screen reader smoke (NVDA/JAWS/VoiceOver)
- Automated checks in CI; manual spot checks before release
