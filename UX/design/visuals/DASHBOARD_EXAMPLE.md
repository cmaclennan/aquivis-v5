# Dashboard – Visual Example (Draft)

Palette: A (Aquivis Blue). Typography: Inter.

## Wireframe (ASCII)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Top Nav: [Aquivis]  Dashboard  Tasks  Properties  Services  Schedule  ▢  ⚙  👤 │
├──────────────────────────────────────────────────────────────────────────────┤
│ KPIs:  [Total Tasks 128  (+12%)]  [On-Time 92%  (–3%)]  [Open Issues 7]      │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Attendance Report ▸]               [Employee Composition ▸]                  │
│ ┌───────────────┐                   ┌───────────────┐                         │
│ │ 63↑ 12↓       │    sparkline      │ 345 total      │     donut               │
│ └───────────────┘                   └───────────────┘                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Schedule]                      [Hiring Statistics]                           │
│ ┌───────────────┐              ┌───────────────┐                              │
│ │ Today  • • •  │              │ 2024▼  ————   │                              │
│ └───────────────┘              └───────────────┘                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Annotations
- Top nav: horizontal, primary sections visible; actions right-aligned.
- KPI row: 3 tiles; big number, delta pill, optional sparkline.
- Cards: titled headers with subtle border and 12–16px radius; primary action ▸.
- Density: comfortable spacing; 8px grid; 24–32px gutters.
- States: loading skeletons, empty states with a single CTA.

## Notes
- Keep charts minimal (sparklines/donut). Avoid heavy chart ink.
- Use StatusPills for deltas; include +/- label, not just color.
