# Aquivis v5 – Plan v1.3 (Design‑specified, Clean‑room)

Status: Draft  •  Date: 2025‑10‑28

## Non‑negotiables
- Clean‑room build: no code/assets reused; insights only.
- Spec‑first: ADR + UX spec + API/DB/RLS spec before implementation.
- Evidence‑driven: each change ships with tests, EXPLAIN/Server‑Timing, a11y (axe/LH), and rollback plan.
- No shortcuts: reviewed from UX, data, performance, security, and operability angles.
- RLS‑first and contract‑first APIs; migrations are deterministic, forward‑only with rollback scripts.
- Accessibility: WCAG AA as a gate (keyboard/focus rings/reduced motion).

## Highlights vs v1.2 (Change Summary)
- Added design‑system specifics (Palette A, Inter, tokens, components, layouts).
- Introduced visual example docs and hi‑fi SVGs (illustrative only).
- Added CI gates: axe checks and visual snapshots.
- Clarified navigation (top bar), layout templates, and density options.

## Remainder of plan
See root `PLAN.md` for original v5 scope and `DB/docs/*`, `UX/design/*`, `API/*` for detailed specs. This version augments those areas with design decisions and quality gates.
