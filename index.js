// homebridge-multiple-switch: index.js (Platform plugin, bir Accessory, çox Service)

let Service, Characteristic, UUIDGen;

module.exports = (api) => {
  Service = api.hap.Service;
  Characteristic = api.hap.Characteristic;
  UUIDGen = api.hap.uuid;

  api.registerPlatform('MultipleSwitchPlatform', MultipleSwitchPlatform);
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
    const accessory = new this.api.platformAccessory(name, uuid);

    accessory.context.switchStates = {};
    accessory.context.switchServices = {};
    accessory.context.switchBehavior = behavior;

    switches.forEach((sw, index) => {
      const id = `switch_${index}`;
      const service = this.createSwitchService(accessory, sw, id);

      accessory.addService(service);
      accessory.context.switchStates[id] = sw.defaultState || false;
      accessory.context.switchServices[id] = service;
    });

    this.api.registerPlatformAccessories(
      'homebridge-multiple-switch',
      'MultipleSwitchPlatform',
      [accessory]
    );
    this.accessories.push(accessory);
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
