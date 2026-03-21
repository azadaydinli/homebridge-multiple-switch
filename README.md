# homebridge-multiple-switch

![CI](https://github.com/azadaydinli/homebridge-multiple-switch/actions/workflows/ci.yml/badge.svg)
[![npm](https://img.shields.io/npm/v/homebridge-multiple-switch)](https://www.npmjs.com/package/homebridge-multiple-switch)
[![GitHub issues](https://img.shields.io/github/issues/azadaydinli/homebridge-multiple-switch)](https://github.com/azadaydinli/homebridge-multiple-switch/issues)
[![GitHub license](https://img.shields.io/github/license/azadaydinli/homebridge-multiple-switch)](https://github.com/azadaydinli/homebridge-multiple-switch/blob/master/LICENSE)

A lightweight Homebridge plugin that lets you create multiple customizable dummy switches under a single accessory — configurable as `Switch`, `Outlet`, `Lightbulb`, or `Fan`.
Supports `Independent`, `Master`, and `Single` switch modes.

---

## Features

- Grouped multiple switches in one HomeKit tile
- Accessory type: `switch`, `outlet`, `lightbulb`, or `fan`
- **Independent Mode** – All switches operate separately
- **Master Mode** – One switch controls all others
- **Single Mode** – Only one switch can be active at a time
- Per-switch config support (type, auto-off delay, default state)
- Switch states preserved across Homebridge restarts via cached accessories
- Automatic cleanup of stale accessories on config change
- Compatible with HomeKit and Siri

---

## Installation

Install via Homebridge UI:

1. Open **Plugins**
2. Search for `homebridge-multiple-switch`
3. Click **Install**

Or install via terminal:

```bash
npm install -g homebridge-multiple-switch
```

---

## Configuration

Configure from Homebridge UI or manually edit `config.json`:

```json
{
  "platform": "MultipleSwitchPlatform",
  "name": "Multiple Switches",
  "switchBehavior": "single",
  "switches": [
    {
      "name": "Heater",
      "type": "outlet",
      "defaultState": true,
      "delayOff": 10000
    },
    {
      "name": "Fan",
      "type": "fan"
    },
    {
      "name": "Light",
      "type": "lightbulb",
      "delayOff": 5000
    }
  ]
}
```

---

### Platform Options

| Field            | Type   | Required | Description                          |
|------------------|--------|----------|--------------------------------------|
| `name`           | string | Yes      | Name of the platform instance        |
| `switchBehavior` | string | No       | `independent`, `master`, or `single` |
| `switches`       | array  | Yes      | List of switches to create           |

### Per-Switch Options

| Field          | Type    | Required | Description                                      |
|----------------|---------|----------|--------------------------------------------------|
| `name`         | string  | Yes      | Name of the switch                               |
| `type`         | string  | No       | `switch`, `outlet`, `lightbulb`, or `fan`        |
| `defaultState` | boolean | No       | Initial power state (default: `false`)           |
| `delayOff`     | number  | No       | Auto turn off after N milliseconds (default: `0`) |

---

## Example Use Cases

- Simulate smart plugs for automation testing
- Trigger HomeKit scenes manually
- Create virtual switches for non-HomeKit devices
- Combine several virtual accessories under one tile

---

## Links

- [NPM Package](https://www.npmjs.com/package/homebridge-multiple-switch)
- [Homebridge](https://homebridge.io/)
- [Plugin Issues](https://github.com/azadaydinli/homebridge-multiple-switch/issues)

---

## License

MIT © [Azad Aydınlı](https://github.com/azadaydinli)
