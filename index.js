let Accessory, Service, Characteristic;

module.exports = (homebridge) => {
  Accessory = homebridge.platformAccessory || homebridge.hap.Accessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory(
    'homebridge-multiple-switch',
    'MultipleSwitchAccessory',
    MultipleSwitchAccessory
  );
};

class MultipleSwitchAccessory {
  constructor(log, config) {
    this.log = log;
    this.config = config;
    this.name = config.name || 'Multiple Switch';
    this.switches = config.switches || [];
    this.services = [];

    const infoService = new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Manufacturer, 'Custom')
      .setCharacteristic(Characteristic.Model, 'MultipleSwitch')
      .setCharacteristic(Characteristic.SerialNumber, 'v1.0.0');

    this.services.push(infoService);

    const serviceTypes = {
      switch: Service.Switch,
      outlet: Service.Outlet,
      lightbulb: Service.Lightbulb,
      fan: Service.Fan
    };

    this.switches.forEach((conf, index) => {
      const switchName = conf.name || `Switch ${index + 1}`;
      const type = (conf.type || 'outlet').toLowerCase();
      const ServiceClass = serviceTypes[type];

      if (!ServiceClass) {
        this.log.warn(`"${switchName}" üçün tanınmayan növ: "${type}". Default olaraq Outlet istifadə olunur.`);
        return;
      }

      conf.state = conf.defaultState === true;

      const service = new ServiceClass(switchName, `subtype-${index}`);

      service
        .getCharacteristic(Characteristic.On)
        .on('get', (callback) => {
          callback(null, conf.state);
        })
        .on('set', (value, callback) => {
          conf.state = value;
          this.log(`"${switchName}" vəziyyəti dəyişdi: ${value}`);

          if (value && conf.delayOff && conf.delayOff > 0) {
            setTimeout(() => {
              conf.state = false;
              service.getCharacteristic(Characteristic.On).updateValue(false);
              this.log(`"${switchName}" auto turn off tətbiq olundu`);
            }, conf.delayOff); // saniyəni ms-ə çeviririk
          }

          callback();
        });

      this.services.push(service);
    });
  }

  getServices() {
    return this.services;
  }
}