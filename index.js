let Service, Characteristic;

module.exports = (homebridge) => {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("MultipleSwitchAccessory", MultipleSwitchAccessory);
};

class MultipleSwitchAccessory {
    constructor(log, config) {
        this.log = log;
        this.name = config.name || "Multiple Switch";
        this.addMasterSwitch = config.addMasterSwitch || false;
        this.switchNames = config.switchNames.map((name, index) => name || `Switch ${index + 1}`);

        this.switchStates = Array(this.switchNames.length).fill(false);
        this.services = [];

        if (this.addMasterSwitch) {
            const masterSwitchService = new Service.Switch(`${this.name} Master`, 'masterSwitch');
            masterSwitchService.getCharacteristic(Characteristic.On)
                .on('set', this.setMasterSwitch.bind(this))
                .on('get', this.getMasterSwitch.bind(this));
            this.services.push(masterSwitchService);
        }

        this.switchNames.forEach((name, i) => {
            const switchService = new Service.Switch(name, `switch${i + 1}`);
            switchService.getCharacteristic(Characteristic.On)
                .on('set', this.setOn.bind(this, i))
                .on('get', this.getOn.bind(this, i));
            this.services.push(switchService);
        });
    }

    setMasterSwitch(value, callback) {
        this.switchStates = this.switchStates.map(() => value);
        this.services.slice(1).forEach((service, i) => {
            service.getCharacteristic(Characteristic.On).updateValue(value);
        });
        callback(null);
    }

    getMasterSwitch(callback) {
        const allOn = this.switchStates.every(state => state === true);
        callback(null, allOn);
    }

    setOn(index, value, callback) {
        this.switchStates[index] = value;
        callback(null);
    }

    getOn(index, callback) {
        callback(null, this.switchStates[index]);
    }

    getServices() {
        return this.services;
    }
}
