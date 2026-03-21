'use strict';

const PLUGIN_NAME = 'homebridge-multiple-switch';
const PLATFORM_NAME = 'MultipleSwitchPlatform';

const SERVICE_TYPES = {
  switch: 'Switch',
  lightbulb: 'Lightbulb',
  fan: 'Fan',
  outlet: 'Outlet',
};

module.exports = (api) => {
  api.registerPlatform(PLATFORM_NAME, MultipleSwitchPlatform);
};

class MultipleSwitchPlatform {
  constructor(log, config, api) {
    this.log = log;
    this.config = config || {};
    this.api = api;
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;
    this.cachedAccessories = new Map();
    this.switchServices = new Map();

    this.api.on('didFinishLaunching', () => {
      this.log.info('MultipleSwitchPlatform started.');
      this.setupAccessories();
    });
  }

  configureAccessory(accessory) {
    this.cachedAccessories.set(accessory.UUID, accessory);
  }

  setupAccessories() {
    const switches = this.config.switches;
    if (!Array.isArray(switches) || switches.length === 0) {
      this.log.warn('No switches configured. Removing stale accessories.');
      this.removeStaleCachedAccessories();
      return;
    }

    const name = this.config.name || 'Multiple Switch Panel';
    const behavior = this.config.switchBehavior || 'independent';
    const uuid = this.api.hap.uuid.generate(name);

    let accessory = this.cachedAccessories.get(uuid);
    const isNew = !accessory;

    if (isNew) {
      accessory = new this.api.platformAccessory(name, uuid);
    }

    accessory.context.switchBehavior = behavior;
    accessory.context.switchStates = accessory.context.switchStates || {};

    this.reconcileServices(accessory, switches);

    if (isNew) {
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    }

    this.cachedAccessories.delete(uuid);
    this.removeStaleCachedAccessories();
  }

  reconcileServices(accessory, switches) {
    const activeSubtypes = new Set();

    switches.forEach((sw, index) => {
      const subtype = `switch_${index}`;
      activeSubtypes.add(subtype);

      const ServiceClass = this.getServiceClass(sw.type);
      let service = accessory.getServiceById(ServiceClass, subtype);

      if (!service) {
        service = accessory.addService(ServiceClass, sw.name, subtype);
      }

      service.setCharacteristic(this.Characteristic.Name, sw.name);
      this.configureSwitchHandlers(accessory, service, sw, subtype);

      this.switchServices.set(subtype, service);

      if (accessory.context.switchStates[subtype] === undefined) {
        accessory.context.switchStates[subtype] = sw.defaultState || false;
      }
    });

    const servicesToRemove = accessory.services.filter((s) => {
      return s.subtype && !activeSubtypes.has(s.subtype);
    });
    servicesToRemove.forEach((s) => accessory.removeService(s));
  }

  configureSwitchHandlers(accessory, service, sw, subtype) {
    service.getCharacteristic(this.Characteristic.On)
      .onGet(() => accessory.context.switchStates[subtype] ?? false)
      .onSet((value) => {
        accessory.context.switchStates[subtype] = value;
        this.log.info(`[${sw.name}] ${value ? 'ON' : 'OFF'}`);

        const behavior = accessory.context.switchBehavior;

        if (behavior === 'single' && value) {
          this.turnOffOthers(accessory, subtype);
        }

        if (behavior === 'master') {
          this.setAll(accessory, value);
        }

        if (value && sw.delayOff > 0) {
          this.scheduleAutoOff(accessory, service, sw, subtype);
        }
      });
  }

  turnOffOthers(accessory, excludeSubtype) {
    for (const [key, svc] of this.switchServices) {
      if (key !== excludeSubtype) {
        accessory.context.switchStates[key] = false;
        svc.updateCharacteristic(this.Characteristic.On, false);
      }
    }
  }

  setAll(accessory, value) {
    for (const [key, svc] of this.switchServices) {
      accessory.context.switchStates[key] = value;
      svc.updateCharacteristic(this.Characteristic.On, value);
    }
  }

  scheduleAutoOff(accessory, service, sw, subtype) {
    setTimeout(() => {
      if (accessory.context.switchStates[subtype]) {
        accessory.context.switchStates[subtype] = false;
        service.updateCharacteristic(this.Characteristic.On, false);
        this.log.info(`[${sw.name}] auto-off after ${sw.delayOff}ms`);
      }
    }, sw.delayOff);
  }

  getServiceClass(type) {
    const key = (type || 'outlet').toLowerCase();
    const name = SERVICE_TYPES[key] || SERVICE_TYPES.outlet;
    return this.Service[name];
  }

  removeStaleCachedAccessories() {
    if (this.cachedAccessories.size === 0) return;
    const stale = [...this.cachedAccessories.values()];
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, stale);
    this.cachedAccessories.clear();
  }
}
