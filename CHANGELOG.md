# Changelog

## [1.7.0-beta.1] - 2026-05-17

### Changed
- Switch type (Switch / Outlet) is now configured per device instead of per individual switch
- All switches within a device share the same type, set once in the device settings
- Switch cards no longer show a type selector — type is shown in the collapsed summary from the device level

### Fixed
- Automatic migration: existing configs with per-switch `type` are migrated to device-level `switchType` on first UI save (first switch's type is used as the device type)

## [1.6.0] - 2026-03-22

### Added
- Multi-device support: create multiple separate HomeKit accessories, each with
  its own name, switch behavior mode, and set of switches
- `devices` array in config — each device becomes a separate accessory in HomeKit
- Master Switch option (available in Independent mode): adds an extra switch
  that turns all switches on or off at once
- Master switch type selection (Switch or Outlet)
- Collapsible device and switch cards in config UI with chevron animation
- Summary info shown when collapsed (switch count for devices, type/delay for switches)
- i18n localization with 14 languages: English, Turkish, German, French, Spanish,
  Portuguese, Italian, Russian, Chinese (Simplified), Japanese, Korean, Polish,
  Dutch, Arabic
- Custom UI (`homebridge-ui/public/`) with `homebridge.i18nCurrentLang()` for
  proper language detection
- Descriptions for both switch behavior modes (Independent / Single)
- ConfiguredName characteristic for correct switch names in HomeKit
- Homebridge v2 compatibility (`^2.0.0-beta.0` in engines)

### Changed
- Switch behavior now has two modes: Independent and Single (removed Master mode)
- Master switch type defaults to Switch instead of Outlet
- All devices and switches start collapsed when config UI is opened
- Services are recreated on each start to ensure fresh names in HomeKit

### Fixed
- Dark mode: custom `--ui-*` CSS variables with `@media (prefers-color-scheme: dark)`
  for reliable theme support inside iframe
- Switch names now correctly appear in HomeKit (cached services kept stale names)
- Backward compatibility: old configs with `switches` at root level auto-migrate
  to `devices` format

### Removed
- Lightbulb and Fan switch types (HomeKit natively converts switches to these)
- Master behavior mode (replaced by Master Switch option in Independent mode)

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
