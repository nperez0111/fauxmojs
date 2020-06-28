const Device = require("../Device");

const ON = "on";
const OFF = "off";

class ExampleDevice extends Device {
  constructor({ name, port }) {
    super({ name, port });
    this.currentStatus = OFF;
  }

  static get type() {
    return "ExampleDevice";
  }

  status() {
    return this.currentStatus === ON;
  }

  async on() {
    this.currentStatus = ON;
  }

  async off() {
    this.currentStatus = OFF;
  }
}

module.exports = ExampleDevice;
