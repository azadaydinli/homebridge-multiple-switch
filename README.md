# homebridge-multiple-switch

![CI](https://github.com/azadaydinli/homebridge-multiple-switch/actions/workflows/ci.yml/badge.svg)
![npm](https://img.shields.io/npm/v/homebridge-multiple-switch)
[Changelog](https://github.com/azadaydinli/homebridge-multiple-switch/blob/master/CHANGELOG.md)
[![npm](https://img.shields.io/npm/v/homebridge-multiple-switch)](https://www.npmjs.com/package/homebridge-multiple-switch)
[![GitHub issues](https://img.shields.io/github/issues/azadaydinli/homebridge-multiple-switch)](https://github.com/azadaydinli/homebridge-multiple-switch/issues)
[![GitHub license](https://img.shields.io/github/license/azadaydinli/homebridge-multiple-switch)](https://github.com/azadaydinli/homebridge-multiple-switch/blob/master/LICENSE)

A lightweight Homebridge plugin that lets you create multiple customizable dummy switches (Outlet/Fan/Light/Switch) with different behavior modes including Independent, Master, and Single-Switch Mode.

---

## ✨ Features

- Multiple switches in a single accessory
- Each switch can be `switch`, `outlet`, `lightbulb`, or `fan`
- **Independent Mode** – all switches work separately
- **Master Mode** – adds a master switch that controls all other switches
- **Single Mode** – only one switch can be on at any time
- Auto turn-off (in milliseconds)
- Works seamlessly with HomeKit and Siri

---

## 📦 Installation

Install the plugin via the Homebridge UI:

1. Go to **Plugins**
2. Search for `homebridge-multiple-switch`
3. Click **Install**

Or use the command line:

```bash
npm install -g homebridge-multiple-switch
```

---

## ⚙️ Configuration

You can configure the plugin directly via the Homebridge UI, or manually in config.json:

```bash
{
  "accessory": "MultipleSwitchAccessory",
  "name": "My Multi Switch",
  "switchCount": 3,
  "type": "outlet",
  "mode": "independent",
  "autoTurnOff": 1000,
  "defaultState": false,
  "states": [
    { "type": "switch", "autoTurnOff": 3000 },
    { "type": "fan" },
    { "type": "lightbulb", "defaultState": true }
  ]
}
```

### 🔧 Configuration Options

| Field         | Type    | Required | Description                                                                 |
|---------------|---------|----------|-----------------------------------------------------------------------------|
| `name`        | string  | ✅       | Name of the accessory                                                       |
| `switchCount` | number  | ✅       | Number of switches to create (max depends on HomeKit limits)               |
| `type`        | string  | ❌       | Default type: `switch`, `outlet`, `lightbulb`, or `fan`                    |
| `mode`        | string  | ❌       | `independent`, `master`, or `single`                                       |
| `autoTurnOff` | number  | ❌       | Global auto-off in milliseconds                                            |
| `defaultState`| boolean | ❌       | Default on/off state on restart                                            |
| `states`      | array   | ❌       | Per-switch custom settings (overrides global config)                       |