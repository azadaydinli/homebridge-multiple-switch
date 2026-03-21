# Changelog

## [1.6.0-beta.6] - 2026-03-21

### Changed
- Master switch type now defaults to Switch instead of Outlet (both UI and backend)

## [1.6.0-beta.5] - 2026-03-21

### Fixed
- Switch names now correctly appear in HomeKit — services are recreated on each
  start with fresh displayName, Name, and ConfiguredName (cached services kept
  stale names from initial creation)
- Master switch now always appears first in HomeKit — all subtype services are
  removed and recreated in correct order (master first, then switches)

### Changed
- Master switch type selector now inline with the toggle (same row)

## [1.6.0-beta.4] - 2026-03-21

### Added
- Master switch type selection (Switch or Outlet) — appears when master switch is enabled
- `masterSwitchType` config option

### Changed
- All devices and switches now start collapsed when config UI is opened
- New devices/switches still open expanded when freshly added

## [1.6.0-beta.3] - 2026-03-21

### Fixed
- Switch names now display correctly in HomeKit using `ConfiguredName`
  characteristic (previously all showed the device name)
- Master switch now always appears first in HomeKit (created before regular switches)

## [1.6.0-beta.2] - 2026-03-21

### Fixed
- Master Switch now available in Independent mode (was incorrectly in Single mode)
- Behavior description now appears below the select dropdown instead of above

## [1.6.0-beta.1] - 2026-03-21

### Removed
- Master switch behavior mode — replaced by a more useful master switch option
  within Single mode

### Changed
- Switch behavior now only has two modes: Independent and Single
- Added descriptions to both behavior modes explaining how they work

### Added
- Master Switch option (available in Single mode only): adds an extra switch
  that turns all switches on or off at once
- New i18n keys for behavior descriptions, master switch label/description

## [1.5.1] - 2026-03-21

### Added
- Collapsible device cards — click the device header to expand/collapse
- Collapsible switch cards — click the switch header to expand/collapse
- Summary info shown when collapsed (switch count for devices, type/delay for switches)
- Chevron indicator (▶) with rotation animation for open/closed state

## [1.5.0] - 2026-03-21

### Added
- Multi-device support: create multiple separate HomeKit accessories, each with
  its own name, switch behavior mode, and set of switches
- `devices` array in config — each device becomes a separate accessory in HomeKit
- Full backward compatibility: existing configs with `switches` at root level
  continue to work and are auto-migrated to the new `devices` format in the UI

## [1.4.1] - 2026-03-21

### Fixed
- Dark mode: replaced Bootstrap CSS variables (not available inside iframe) with
  custom `--ui-*` variables and `@media (prefers-color-scheme: dark)` for reliable
  light/dark theme detection across all elements (cards, inputs, labels, borders)

## [1.4.0] - 2026-03-21

### Removed
- Lightbulb and Fan switch types (HomeKit natively converts switches to these)

### Fixed
- Custom UI white background in dark mode — set `background: transparent !important`
  on html/body so the iframe inherits the Homebridge theme

## [1.3.3] - 2026-03-21

### Fixed
- Custom UI light/dark mode support: all labels, inputs, cards, and borders
  now use Homebridge Bootstrap CSS variables (`--bs-body-color`, `--bs-body-bg`,
  `--bs-border-color`, `--bs-tertiary-bg`) for proper theme adaptation

## [1.3.2] - 2026-03-21

### Changed
- Replaced static i18n folder with Custom UI (`homebridge-ui/public/`) using
  `homebridge.i18nCurrentLang()` for proper language detection
- Plugin config UI now renders a fully localized form that matches the
  Homebridge UI language setting

### Fixed
- i18n translations not being applied (Homebridge does not support automatic
  schema-level i18n; Custom UI is required)

## [1.3.1] - 2026-03-21

### Added
- i18n localization support for Homebridge UI config with 14 languages:
  English, Turkish, German, French, Spanish, Portuguese, Italian, Russian,
  Chinese (Simplified), Japanese, Korean, Polish, Dutch, Arabic
- Descriptions added to all config.schema.json fields

## [1.3.0] - 2026-03-21

### Changed
- Replaced global mutable variables with instance properties
- Refactored accessory setup to reuse cached accessories instead of creating duplicates on restart
- Extracted switch behavior logic into dedicated methods (`turnOffOthers`, `setAll`, `scheduleAutoOff`)
- Used `Map` for service and accessory tracking instead of plain objects
- Service type lookup uses a constant map instead of a switch statement
- Auto-off now checks current state before turning off (prevents stale timeouts)
- Updated minimum Node.js version from 14 to 18
- Updated GitHub Actions from v3 to v4
- Cleaned up CI workflow

### Fixed
- `delayOff` not working in `master` mode due to if/else logic bug
- Cached accessories not being restored on Homebridge restart (caused duplicate accessories)
- Services stored in `accessory.context` which is not serializable
- README field names (`autoTurnOff`, `mode`) now match actual config schema (`delayOff`, `switchBehavior`)

### Added
- Automatic removal of stale cached accessories when config changes
- Service reconciliation: adds new services and removes old ones on config update
- Validation for empty or missing switches array

## [1.2.0] - 2025-01-01

- Initial published version with independent, master, and single switch modes
- Support for switch, outlet, lightbulb, and fan accessory types
- Per-switch config: type, defaultState, delayOff
- Homebridge UI config schema
