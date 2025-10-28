# Components (Draft)

Specs are implementation-agnostic; clean-room authored.

## Primitives
- Button: sizes (sm, md, lg), variants (primary, secondary, ghost, destructive), states (hover, focus, active, disabled, loading)
- Input: label, helper, error; icons; required marker
- Select: searchable option list; clear; keyboard navigation
- Checkbox/Radio: labels clickable; indeterminate for checkbox
- Textarea: character count optional

## Feedback
- StatusPill/Badge: success/warn/danger/info; with icon + label
- Toast/Snackbar: 3–5s default; undo action support
- InlineError: compact error message with icon

## Data
- Card: header (title + actions), content; loading/empty states
- TableLite: sticky header; row selection; inline filters; pagination (cursor)
- ListRow: avatar/icon, title, meta, status pill, actions
- EmptyState: illustration/icon, description, primary CTA

## Navigation
- Tabs: underline/filled; keyboard navigable
- Stepper: numbered steps, Next/Back, AutosaveIndicator, UnsavedChangesGuard
- PageHeader: title, breadcrumbs optional, actions on the right
- PageToolbar: filters, segmented controls, date picker

## States & Accessibility
- Focus rings visible; tab order logical; ARIA labels for controls
- Contrast ≥ 4.5:1 for text; error borders + messages

Each component includes examples of loading, error, and disabled states to reduce edge-case UX drift.
