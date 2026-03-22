'use strict';

const PLUGIN_NAME = 'homebridge-multiple-switch';
const PLATFORM_NAME = 'MultipleSwitchPlatform';

const SERVICE_TYPES = {
  switch: 'Switch',
  outlet: 'Outlet',
};

const MASTER_SUBTYPE = 'master_switch';

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
    this.deviceServices = new Map();

    this.api.on('didFinishLaunching', () => {
      this.log.info('MultipleSwitchPlatform started.');
      this.setupAccessories();
    });
  }

  configureAccessory(accessory) {
    this.cachedAccessories.set(accessory.UUID, accessory);
  }

  getDevices() {
    if (Array.isArray(this.config.devices) && this.config.devices.length > 0) {
      return this.config.devices;
    }

    if (Array.isArray(this.config.switches) && this.config.switches.length > 0) {
      return [{
        name: this.config.name || 'Multiple Switch Panel',
        switchBehavior: this.config.switchBehavior || 'independent',
        switches: this.config.switches,
      }];
    }

    return [];
  }

  setupAccessories() {
    const devices = this.getDevices();

    if (devices.length === 0) {
      this.log.warn('No devices configured. Removing stale accessories.');
      this.removeStaleCachedAccessories();
      return;
    }

    for (const device of devices) {
      this.setupDevice(device);
    }

    this.removeStaleCachedAccessories();
  }

  setupDevice(device) {
    const switches = device.switches;
    if (!Array.isArray(switches) || switches.length === 0) {
      this.log.warn(`Device "${device.name}" has no switches, skipping.`);
      return;
    }

    const name = device.name || 'Multiple Switch Panel';
    const behavior = device.switchBehavior || 'independent';
    const hasMaster = behavior === 'independent' && device.masterSwitch === true;
    const uuid = this.api.hap.uuid.generate(name);

    let accessory = this.cachedAccessories.get(uuid);
    const isNew = !accessory;

    if (isNew) {
      accessory = new this.api.platformAccessory(name, uuid);
    }

    accessory.context.switchBehavior = behavior;
    accessory.context.hasMaster = hasMaster;
    accessory.context.switchStates = accessory.context.switchStates || {};

    const services = new Map();
    this.deviceServices.set(uuid, services);

    this.reconcileServices(accessory, device, switches, services, hasMaster);

    if (isNew) {
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    }

    this.cachedAccessories.delete(uuid);
  }

  setServiceName(service, displayName) {
    service.displayName = displayName;
    service.setCharacteristic(this.Characteristic.Name, displayName);
    if (this.Characteristic.ConfiguredName) {
      if (!service.testCharacteristic(this.Characteristic.ConfiguredName)) {
        service.addOptionalCharacteristic(this.Characteristic.ConfiguredName);
      }
      service.setCharacteristic(this.Characteristic.ConfiguredName, displayName);
    }
  }

  reconcileServices(accessory, device, switches, services, hasMaster) {
    // Remove ALL existing subtype services (ensures fresh names and correct order)
    const subtypeServices = accessory.services.filter((s) => s.subtype);
    subtypeServices.forEach((s) => accessory.removeService(s));

    // Remove existing ServiceLabel if present, then re-add to ensure ordering
    const existingLabel = accessory.services.find(
      (s) => s.UUID === this.Service.ServiceLabel.UUID
    );
    if (existingLabel) accessory.removeService(existingLabel);

    const labelService = accessory.addService(this.Service.ServiceLabel);
    labelService.setCharacteristic(
      this.Characteristic.ServiceLabelNamespace,
      this.Characteristic.ServiceLabelNamespace.ARABIC_NUMERALS
    );

    let labelIndex = 1;
    const orderedServices = [];

    // 1. Create master switch FIRST if enabled (appears at top in HomeKit)
    if (hasMaster) {
      const MasterServiceClass = this.getServiceClass(device.masterSwitchType || 'switch');
      const masterService = accessory.addService(MasterServiceClass, 'Master', MASTER_SUBTYPE);

      this.setServiceName(masterService, 'Master');
      masterService.addOptionalCharacteristic(this.Characteristic.ServiceLabelIndex);
      masterService.setCharacteristic(this.Characteristic.ServiceLabelIndex, labelIndex++);
      this.configureMasterHandler(accessory, masterService, services);

      services.set(MASTER_SUBTYPE, masterService);
      orderedServices.push(masterService);

      if (accessory.context.switchStates[MASTER_SUBTYPE] === undefined) {
        accessory.context.switchStates[MASTER_SUBTYPE] = false;
      }
    }

    // 2. Create regular switches in config order
    switches.forEach((sw, index) => {
      const subtype = `switch_${index}`;

      const ServiceClass = this.getServiceClass(sw.type);
      const service = accessory.addService(ServiceClass, sw.name, subtype);

      this.setServiceName(service, sw.name);
      service.addOptionalCharacteristic(this.Characteristic.ServiceLabelIndex);
      service.setCharacteristic(this.Characteristic.ServiceLabelIndex, labelIndex++);
      this.configureSwitchHandlers(accessory, service, sw, subtype, services);

      services.set(subtype, service);
      orderedServices.push(service);

      if (accessory.context.switchStates[subtype] === undefined) {
        accessory.context.switchStates[subtype] = sw.defaultState || false;
      }
    });

    // Link all services to ServiceLabel for HomeKit ordering
    for (const svc of orderedServices) {
      labelService.addLinkedService(svc);
    }

    // Log service order for debugging
    this.log.info(`[${device.name}] Service order: ${orderedServices.map((s, i) => `${i + 1}. ${s.displayName}`).join(', ')}`);

    // Clean up states for removed switches
    const activeKeys = new Set(services.keys());
    for (const key of Object.keys(accessory.context.switchStates)) {
      if (!activeKeys.has(key)) {
        delete accessory.context.switchStates[key];
      }
    }
  }

  configureSwitchHandlers(accessory, service, sw, subtype, services) {
    service.getCharacteristic(this.Characteristic.On)
      .onGet(() => accessory.context.switchStates[subtype] ?? false)
      .onSet((value) => {
        accessory.context.switchStates[subtype] = value;
        this.log.info(`[${sw.name}] ${value ? 'ON' : 'OFF'}`);

        const behavior = accessory.context.switchBehavior;

        if (behavior === 'single' && value) {
          this.turnOffOthers(accessory, subtype, services);
        }

        if (value && sw.delayOff > 0) {
          this.scheduleAutoOff(accessory, service, sw, subtype);
        }
      });
  }

  configureMasterHandler(accessory, masterService, services) {
    masterService.getCharacteristic(this.Characteristic.On)
      .onGet(() => accessory.context.switchStates[MASTER_SUBTYPE] ?? false)
      .onSet((value) => {
        accessory.context.switchStates[MASTER_SUBTYPE] = value;
        this.log.info(`[Master] ${value ? 'ON' : 'OFF'}`);

        for (const [key, svc] of services) {
          if (key !== MASTER_SUBTYPE) {
            accessory.context.switchStates[key] = value;
            svc.updateCharacteristic(this.Characteristic.On, value);
          }
        }
      });
  }

  turnOffOthers(accessory, excludeSubtype, services) {
    for (const [key, svc] of services) {
      if (key !== excludeSubtype && key !== MASTER_SUBTYPE) {
        accessory.context.switchStates[key] = false;
        svc.updateCharacteristic(this.Characteristic.On, false);
      }
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
