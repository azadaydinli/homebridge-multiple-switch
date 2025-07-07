# homebridge-multiple-switch

![CI](https://github.com/azadaydinli/homebridge-multiple-switch/actions/workflows/ci.yml/badge.svg)
[![npm](https://img.shields.io/npm/v/homebridge-multiple-switch)](https://www.npmjs.com/package/homebridge-multiple-switch)
[![GitHub issues](https://img.shields.io/github/issues/azadaydinli/homebridge-multiple-switch)](https://github.com/azadaydinli/homebridge-multiple-switch/issues)
[![GitHub license](https://img.shields.io/github/license/azadaydinli/homebridge-multiple-switch)](https://github.com/azadaydinli/homebridge-multiple-switch/blob/master/LICENSE)

A lightweight Homebridge plugin that lets you create multiple customizable dummy switches under a single accessory — configurable as `Switch`, `Outlet`, `Lightbulb`, or `Fan`.  
Supports `Independent`, `Master`, and `Single` switch modes.

---

## ✨ Features

- Grouped multiple switches in one HomeKit tile
- Accessory type: `switch`, `outlet`, `lightbulb`, or `fan`
- **Independent Mode** – All switches operate separately
- **Master Mode** – One master switch controls the rest
- **Single Mode** – Only one switch can be active at a time
- Per-switch config support (type, auto-off, default state)
- Switch states are preserved after Homebridge restart
- Fully dynamic config reload (no need to restart Homebridge)
- Compatible with HomeKit and Siri

---

## 📦 Installation

Install via Homebridge UI:

1. Open **Plugins**
2. Search for `homebridge-multiple-switch`
3. Click **Install**

Or install via terminal:

```bash
npm install -g homebridge-multiple-switch
```

---

## ⚙️ Configuration (Platform Mode)

Configure from Homebridge UI or manually edit `config.json` like below:

```json
{
  "platform": "MultipleSwitchPlatform",
  "name": "Multiple Switches",
  "switches": [
    {
      "name": "Heater",
      "type": "outlet",
      "defaultState": true,
      "autoTurnOff": 10000
    },
    {
      "name": "Fan",
      "type": "fan"
    },
    {
      "name": "Light",
      "type": "lightbulb",
      "autoTurnOff": 5000
    }
  ],
  "mode": "single"
}
```

---

### 🔧 Configuration Options

| Field           | Type    | Required | Description                                                             |
|----------------|---------|----------|-------------------------------------------------------------------------|
| `name`          | string  | ✅       | Name of the platform instance                                           |
| `switches`      | array   | ✅       | List of switches to create                                              |
| `mode`          | string  | ❌       | `independent`, `master`, or `single`                                    |
| `type`          | string  | ❌       | Switch type: `switch`, `outlet`, `lightbulb`, `fan` (overridden per switch) |
| `autoTurnOff`   | number  | ❌       | Global auto-off (ms) – can be overridden per switch                     |
| `defaultState`  | boolean | ❌       | Default power state on restart – can be overridden per switch           |

Each object inside `switches[]` can include:  
- `name`: Name of the switch  
- `type`: Optional (`switch`, `outlet`, etc.)  
- `autoTurnOff`: Optional (in ms)  
- `defaultState`: Optional (true/false)

---

## 📣 Example Use Cases

- Simulate smart plugs for automation testing
- Trigger HomeKit scenes manually
- Create virtual switches for non-HomeKit devices
- Combine several virtual accessories under one tile

---

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/homebridge-multiple-switch)
- [Homebridge](https://homebridge.io/)
- [Plugin Issues](https://github.com/azadaydinli/homebridge-multiple-switch/issues)

---

## 📜 License

MIT © [Azad Aydınlı](https://github.com/azadaydinli)
