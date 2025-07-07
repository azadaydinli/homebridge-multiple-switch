# homebridge-multiple-switch

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