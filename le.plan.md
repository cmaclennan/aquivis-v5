<!-- fd3c829a-67f3-430e-b073-d69b58941ba1 5adbf802-f9ad-4fa5-a476-abbdb7db4517 -->
# Plan Versioning Policy (Draft)

### Goals

- Preserve all prior plan versions; avoid accidental overwrites.
- Provide a clear index to the latest and historical plans.

### Structure

- Create `docs/plan/` with versioned files: `PLAN_v1.3.md`, `PLAN_v1.4.md`, etc.
- Keep `PLAN.md` as a living index that links to the latest approved version and prior versions. Do not store full content there.
- Each version begins with: version number, date, status (Draft/Accepted), and a concise change log.

### Workflow

1. When a new revision is proposed, clone the last version into a new `PLAN_vX.Y.md` and apply changes there.
2. Add a CHANGE SUMMARY section listing deltas from prior version (bulleted, high‑signal).
3. Update `PLAN.md` to point to the new version and include a short summary table of versions.
4. Keep all ADR references stable; plans link to ADRs for decisions.

### Immediate Actions (upon approval)

- Create `docs/plan/` and move the current v1.3 content into `docs/plan/PLAN_v1.3.md`.
- Replace `PLAN.md` body with an index: latest version pointer + version table.
- Add `docs/plan/CHANGELOG.md` (optional) that aggregates summaries across versions.

### Safeguards

- Protect `PLAN.md` against direct content edits by CI check (optional future task).
- Require PR checklist item: “Plan version updated and indexed.”

### To-dos (Versioning Policy specific)

- [ ] Create `docs/plan/` directory
- [ ] Copy current plan to `docs/plan/PLAN_v1.3.md` (date, status, change summary)
- [ ] Update root `PLAN.md` to be an index pointing to latest version
- [ ] Add `docs/plan/CHANGELOG.md` aggregating version deltas
- [ ] Add PR checklist item: “Plan version updated and indexed”
- [ ] (Optional) Add CI check preventing direct content edits to `PLAN.md`
