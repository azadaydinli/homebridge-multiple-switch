<p align="center">
  <img src="https://raw.githubusercontent.com/azadaydinli/homebridge-multiple-switch/master/banner.svg" width="800">
</p>

<span align="center">

# Homebridge Multiple Switch

A lightweight Homebridge plugin that lets you create multiple customizable dummy switches in HomeKit. Supports multi-device, master switch, configurable default states, and 14 languages.

[![verified-by-homebridge](https://img.shields.io/badge/homebridge-verified-blueviolet?color=%23491F59&style=flat)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![npm](https://img.shields.io/npm/v/homebridge-multiple-switch)](https://www.npmjs.com/package/homebridge-multiple-switch)
[![npm](https://img.shields.io/npm/dw/homebridge-multiple-switch)](https://www.npmjs.com/package/homebridge-multiple-switch)
[![npm](https://img.shields.io/npm/dt/homebridge-multiple-switch)](https://www.npmjs.com/package/homebridge-multiple-switch)

</span>

---

## Features

- **Multi-device support** — create multiple separate HomeKit accessories
- **Device-level switch type** — set `switch` or `outlet` once per device; all switches inherit it
- **Independent Mode** — all switches operate separately
- **Single Mode** — only one switch can be active at a time
- **Master Switch** (Independent mode) — one switch controls all others, uses the device type
- Per-switch config: auto-off delay and flexible default state
- **Default State** per switch: Remember Last State / Always On / Always Off
- Collapsible config UI with dark mode support
- i18n localization (14 languages)
- Homebridge v2 compatible
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

Configure from the Homebridge UI or manually edit `config.json`:

```json
{
  "platform": "MultipleSwitchPlatform",
  "name": "Multiple Switch Platform",
  "devices": [
    {
      "name": "Living Room",
      "switchBehavior": "independent",
      "switchType": "outlet",
      "masterSwitch": true,
      "switches": [
        {
          "name": "Lamp",
          "defaultState": "remember",
          "delayOff": 0
        },
        {
          "name": "Heater",
          "defaultState": "off",
          "delayOff": 10000
        }
      ]
    },
    {
      "name": "Bedroom",
      "switchBehavior": "single",
      "switchType": "switch",
      "switches": [
        { "name": "Scene 1", "defaultState": "remember" },
        { "name": "Scene 2", "defaultState": "remember" }
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

| Field            | Type    | Required | Default         | Description                                      |
|------------------|---------|----------|-----------------|--------------------------------------------------|
| `name`           | string  | Yes      | —               | Device name (becomes the HomeKit accessory name) |
| `switchBehavior` | string  | No       | `independent`   | `independent` or `single`                        |
| `switchType`     | string  | No       | `outlet`        | `switch` or `outlet` — applies to all switches   |
| `masterSwitch`   | boolean | No       | `false`         | Adds a master switch (Independent mode only)     |
| `switches`       | array   | Yes      | —               | List of switches for this device                 |

### Per-Switch Options

| Field          | Type   | Required | Default    | Description                                        |
|----------------|--------|----------|------------|----------------------------------------------------|
| `name`         | string | Yes      | —          | Display name of the switch                         |
| `defaultState` | string | No       | `remember` | `remember`, `on`, or `off` (see below)             |
| `delayOff`     | number | No       | `0`        | Auto turn off after N milliseconds (`0` = disabled)|

#### Default State options

| Value      | Behaviour                                          |
|------------|----------------------------------------------------|
| `remember` | Keeps the last known state across Homebridge restarts |
| `on`       | Always starts ON on every restart                  |
| `off`      | Always starts OFF on every restart                 |

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
