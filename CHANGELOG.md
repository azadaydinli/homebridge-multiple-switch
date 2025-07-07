# Changelog

All notable changes to this project will be documented in this file.

---

## [1.1.6] - 2025-07-08

### Added
- Added support for multiple switches under a single platform accessory, grouped in HomeKit as a single tile.
- Configurable accessory types: users can now choose `Switch`, `Outlet`, or `Lightbulb` for each individual switch via config.
- Added support for accessory modes: `Independent`, `Master`, and `Single` control logic.
- Added default state and auto-off delay per switch.
- Switch states are now restored after Homebridge restarts.

### Fixed
- Resolved issues with accessory naming consistency in HomeKit.
- Improved HomeKit response timing and accessory identification.

---

## [1.1.5] - 2025-07-04

### Added
- Initial support for dynamic configuration reload (no need to restart Homebridge when config is changed).
- Improved error handling and logging.

---

## [1.1.0] - 2025-07-01

### Added
- Initial public release of the plugin.
- Basic support for multiple switches exposed via HomeKit.
