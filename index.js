let Accessory, Service, Characteristic, UUIDGen;

module.exports = (api) => {
  Accessory = api.hap.Accessory;
  Service = api.hap.Service;
  Characteristic = api.hap.Characteristic;
  UUIDGen = api.hap.uuid;

  api.registerAccessory("MultipleSwitchAccessory", MultipleSwitchAccessory);
};

class MultipleSwitchAccessory {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.name = config.name;
    this.switches = config.switches || [];
    this.mode = config.switchBehavior || "independent";
    this.services = [];

    const uuid = UUIDGen.generate(this.name);
    this.accessory = new Accessory(this.name, uuid);
    this.switchStates = Array(this.switches.length).fill(false);

    this.switches.forEach((sw, index) => {
      const service = new Service.Outlet(sw.name, "switch_" + index);
      service
        .getCharacteristic(Characteristic.On)
        .onGet(() => this.switchStates[index])
        .onSet((value) => this.setState(index, value));
      this.accessory.addService(service);
      this.services.push(service);
    });

    if (this.mode === "master") {
      const master = new Service.Outlet("Master", "master");
      master
        .getCharacteristic(Characteristic.On)
        .onGet(() => this.switchStates.every((s) => s))
        .onSet((value) => this.setAll(value));
      this.accessory.addService(master);
      this.services.unshift(master);
    }
  }

  setState(index, value) {
    if (this.mode === "single" && value) {
      this.switchStates = this.switchStates.map((_, i) => i === index);
    } else {
      this.switchStates[index] = value;
    }
    this.updateStates();
  }

  setAll(value) {
    this.switchStates = this.switchStates.map(() => value);
    this.updateStates();
  }

  updateStates() {
    this.switches.forEach((_, i) => {
      this.services
        .find((s) => s.subtype === "switch_" + i)
        ?.getCharacteristic(Characteristic.On)
        .updateValue(this.switchStates[i]);
    });
  }

  getServices() {
    return [this.accessory.getService(Service.AccessoryInformation), ...this.accessory.services];
  }
}