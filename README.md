# homebridge-multiple-switch

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

![CI](https://github.com/azadaydinli/homebridge-multiple-switch/actions/workflows/ci.yml/badge.svg)
[![npm](https://img.shields.io/npm/v/homebridge-multiple-switch)](https://www.npmjs.com/package/homebridge-multiple-switch)
[![GitHub issues](https://img.shields.io/github/issues/azadaydinli/homebridge-multiple-switch)](https://github.com/azadaydinli/homebridge-multiple-switch/issues)
[![GitHub license](https://img.shields.io/github/license/azadaydinli/homebridge-multiple-switch)](https://github.com/azadaydinli/homebridge-multiple-switch/blob/master/LICENSE)

A lightweight Homebridge plugin that lets you create multiple customizable dummy switches in HomeKit. Supports multi-device, master switch, and 14 languages.

---

## Features

- **Multi-device support** — create multiple separate HomeKit accessories
- Accessory type: `switch` or `outlet`
- **Independent Mode** – All switches operate separately
- **Single Mode** – Only one switch can be active at a time
- **Master Switch** (Independent mode) — one switch controls all others
- Per-switch config support (type, auto-off delay, default state)
- Collapsible config UI with dark mode support
- i18n localization (14 languages)
- Homebridge v2 compatible
- Switch states preserved across restarts via cached accessories
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
  "name": "Multiple Switch Platform",
  "devices": [
    {
      "name": "Living Room",
      "switchBehavior": "independent",
      "masterSwitch": true,
      "masterSwitchType": "switch",
      "switches": [
        {
          "name": "Lamp",
          "type": "outlet",
          "defaultState": false,
          "delayOff": 0
        },
        {
          "name": "Heater",
          "type": "switch",
          "delayOff": 10000
        }
      ]
    },
    {
      "name": "Bedroom",
      "switchBehavior": "single",
      "switches": [
        {
          "name": "Scene 1",
          "type": "switch"
        },
        {
          "name": "Scene 2",
          "type": "switch"
        }
      ]
    }
  ]
}
```

---

### Platform Options

| Field     | Type   | Required | Description                   |
|-----------|--------|----------|-------------------------------|
| `name`    | string | Yes      | Name of the platform instance |
| `devices` | array  | Yes      | List of devices to create     |

### Device Options

| Field              | Type    | Required | Description                                     |
|--------------------|---------|----------|-------------------------------------------------|
| `name`             | string  | Yes      | Device name (becomes HomeKit accessory name)     |
| `switchBehavior`   | string  | No       | `independent` or `single` (default: independent) |
| `masterSwitch`     | boolean | No       | Enable master switch (Independent mode only)     |
| `masterSwitchType` | string  | No       | `switch` or `outlet` (default: switch)           |
| `switches`         | array   | Yes      | List of switches for this device                 |

### Per-Switch Options

| Field          | Type    | Required | Description                                       |
|----------------|---------|----------|---------------------------------------------------|
| `name`         | string  | Yes      | Name of the switch                                |
| `type`         | string  | No       | `switch` or `outlet` (default: outlet)            |
| `defaultState` | boolean | No       | Initial power state (default: `false`)            |
| `delayOff`     | number  | No       | Auto turn off after N milliseconds (default: `0`) |

---

## Example Use Cases

- Simulate smart plugs for automation testing
- Trigger HomeKit scenes manually
- Create virtual switches for non-HomeKit devices
- Group several virtual accessories under one device

---

## Links

- [NPM Package](https://www.npmjs.com/package/homebridge-multiple-switch)
- [Homebridge](https://homebridge.io/)
- [Plugin Issues](https://github.com/azadaydinli/homebridge-multiple-switch/issues)

---

## License

MIT © [Azad Aydınlı](https://github.com/azadaydinli)
