# Service Wizard – Visual Example (Draft)

Palette: A (Aquivis Blue). Typography: Inter.

## Wireframe (ASCII)
```
┌───────────────────────────────────────────────────────────┐
│ Stepper: 1 Type • 2 Test • 3 Chemicals • 4 Maint • 5 Equip • 6 Photos │
├───────────────────────────────────────────────────────────┤
│ [Type]                                                     │
│ Unit ▸  [Sea Temple – Main Pool]                           │
│ Service Type ▸ [Routine]                                   │
│ Notes [______________________________]                     │
│                                                            │
│ Autosave ✓  Last saved 10s ago                             │
├───────────────────────────────────────────────────────────┤
│ ◂ Back                              Next ▸                 │
└───────────────────────────────────────────────────────────┘
```

## Annotations
- Autosave after field blur/step change; show indicator and timestamp.
- Validation: inline messages; step cannot advance on hard errors.
- Mobile: persistent Next/Back at bottom; large controls.
- Photos step: offline-first uploads with retry queue.
