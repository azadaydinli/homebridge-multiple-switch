// homebridge-multiple-switch: index.js (Platform plugin, bir Accessory, çox Service)

let Service, Characteristic, UUIDGen;

module.exports = (api) => {
  Service = api.hap.Service;
  Characteristic = api.hap.Characteristic;
  UUIDGen = api.hap.uuid;

  api.registerPlatform('homebridge-multiple-switch', 'MultipleSwitchPlatform', MultipleSwitchPlatform);
};

class MultipleSwitchPlatform {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.accessories = [];

    this.api.on('didFinishLaunching', () => {
      this.log('🔌 MultipleSwitchPlatform başladıldı.');
      this.setupAccessories();
    });
  }

  setupAccessories() {
    const switches = this.config.switches || [];
    const behavior = this.config.switchBehavior || 'independent';
    const name = this.config.name || 'Multiple Switch Panel';
    
    const uuid = UUIDGen.generate(name);
    let accessory = this.accessories.find(acc => acc.UUID === uuid);

    if (!accessory) {
      this.log('Creating new accessory:', name);
      accessory = new this.api.platformAccessory(name, uuid);
      
      // Initialize context for NEW accessories only
      accessory.context.switchStates = {};
      accessory.context.switchServices = {};
      accessory.context.switchBehavior = behavior;
      
      this.api.registerPlatformAccessories(
        'homebridge-multiple-switch',
        'MultipleSwitchPlatform',
        [accessory]
      );
      this.accessories.push(accessory);
    } else {
      this.log('Reusing existing accessory:', name);
      
      // Preserve existing state and behavior
      accessory.context.switchStates = accessory.context.switchStates || {};
      accessory.context.switchBehavior = behavior; // Update behavior from config
      
      // Clear old services
      const servicesToRemove = accessory.services.filter(
        service => service.UUID !== Service.AccessoryInformation.UUID
      );
      servicesToRemove.forEach(service => {
        accessory.removeService(service);
      });
      
      // Reset switchServices since we're recreating them
      accessory.context.switchServices = {};
    }

    switches.forEach((sw, index) => {
      const id = `switch_${index}`;
      const service = this.createSwitchService(accessory, sw, id);
      
      accessory.addService(service);
      
      // Preserve existing state, or use default for new switches
      if (accessory.context.switchStates[id] === undefined) {
        accessory.context.switchStates[id] = sw.defaultState || false;
      }
      
      accessory.context.switchServices[id] = service;
    });
  }

  createSwitchService(accessory, sw, id) {
    const ServiceType = this.getServiceClass(sw.type);
    const service = new ServiceType(sw.name, id);

    service.getCharacteristic(Characteristic.On)
      .onGet(() => {
        return accessory.context.switchStates[id];
      })
      .onSet((value) => {
        const behavior = accessory.context.switchBehavior;
        accessory.context.switchStates[id] = value;
        this.log(`[${sw.name}] → ${value ? 'ON' : 'OFF'}`);

        if (behavior === 'single' && value) {
          Object.keys(accessory.context.switchStates).forEach(key => {
            if (key !== id) {
              accessory.context.switchStates[key] = false;
              accessory.context.switchServices[key].updateCharacteristic(Characteristic.On, false);
            }
          });
        }

        if (behavior === 'master') {
          Object.keys(accessory.context.switchStates).forEach(key => {
            accessory.context.switchStates[key] = value;
            accessory.context.switchServices[key].updateCharacteristic(Characteristic.On, value);
          });
        } else {
          if (value && sw.delayOff > 0) {
            setTimeout(() => {
              accessory.context.switchStates[id] = false;
              service.updateCharacteristic(Characteristic.On, false);
              this.log(`[${sw.name}] auto-off after ${sw.delayOff}ms`);
            }, sw.delayOff);
          }
        }
      });

    return service;
  }

  getServiceClass(type) {
    switch ((type || '').toLowerCase()) {
      case 'switch': return Service.Switch;
      case 'lightbulb': return Service.Lightbulb;
      case 'fan': return Service.Fan;
      case 'outlet':
      default: return Service.Outlet;
    }
  }

  configureAccessory(accessory) {
    this.accessories.push(accessory);
  }
}