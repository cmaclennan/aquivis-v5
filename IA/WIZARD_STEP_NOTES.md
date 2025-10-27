# Service Wizard – step notes (v5)

Reference: [cmaclennan/aquivis](https://github.com/cmaclennan/aquivis.git)

## Flow (6 steps)
1. Type (service type, unit selection)
2. Test (water chemistry inputs)
3. Chemicals (dosages added)
4. Maintenance (checklist items)
5. Equipment (notes/updates)
6. Photos → Review (attachments, confirm)

## Autosave
- Persist draft after each step; tie to `service_id` draft record
- Mobile: local draft with background sync; Web: server draft

## Validation (Zod in packages/types)
- Test ranges (PH, chlorine/bromine, alkalinity, calcium, CYA, salt, temp)
- Required fields per step; soft warnings vs hard errors

## UX considerations
- Task-first entry from Inbox with preselected unit/property
- Minimal fields by default; expand advanced sections on demand
- Offline-friendly on mobile; retry uploads

## Data mapping
- water_tests rows linked to `services(id)`
- chemical_additions rows per chemical
- maintenance_tasks linked to service


