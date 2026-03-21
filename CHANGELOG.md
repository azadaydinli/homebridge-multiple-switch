# Changelog

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
