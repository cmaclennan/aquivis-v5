# Task Inbox + Side Panel – Visual Example (Draft)

Palette: A (Aquivis Blue). Typography: Inter.

## Wireframe (ASCII)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Top Nav …                                                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Filters: Date [Today▼] Status [All▼] Property [Any▼] Unit [Any▼]  ▢ Reset     │
├──────────────────────────────────────────────────────────────────────────────┤
│ List (left)                                          │ Side Panel (right)     │
│ ┌───────────────────────────────────────────────────┐│┌──────────────────────┐│
│ │ • 08:00  Sea Temple – Main Pool   [Due]   ▸       │││ Task Details         ││
│ │ • 09:15  Sheraton – Villa 21      [In Prog] ▸     │││ Property / Unit      ││
│ │ • 10:30  Lagoon – Spa             [Pending] ▸     │││ Notes                ││
│ └───────────────────────────────────────────────────┘││ Actions:              ││
│ Pagination ◂ 1 ▸                                      ││ [Start Service]       ││
│                                                       ││ [Add Photo] [Mark Done]││
│                                                       │└──────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────┘
```

## Annotations
- Filter toolbar stays near content; chips/segmented controls for quick scope.
- List rows show time, property, unit, and a StatusPill.
- Side panel exposes quick actions and summary; non-blocking.
- Saved views: Today, This Week; reflect in URL for shareability.

## States
- Empty: friendly message, CTA to adjust filters.
- Loading: skeleton rows; panel skeleton.
- Errors: inline with retry.
