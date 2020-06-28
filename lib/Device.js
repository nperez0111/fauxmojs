const aGuid = require("aguid");

const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

class Device {
  constructor({ name, port }) {
    this.port = port;
    this.name = name;
  }

  static get type() {
    return "Device";
  }

  getId() {
    return aGuid(`${this.name}-${this.port}`);
  }

  getPort() {
    return this.port;
  }

  setPort(port) {
    this.port = port;
    this.onChange("port", port);
  }

  setName(name) {
    this.name = name;
    this.onChange("name", name);
  }

  getName() {
    return this.name;
  }

  // eslint-disable-next-line class-methods-use-this
  onChange() {
    // Unimplemented
  }

  // eslint-disable-next-line class-methods-use-this
  async on() {
    throw new Error("Unimplemented");
  }

  // eslint-disable-next-line class-methods-use-this
  async off() {
    throw new Error("Unimplemented");
  }

  // eslint-disable-next-line class-methods-use-this
  async status() {
    throw new Error("Unimplemented");
  }

  async setOn() {
    return Promise.race([this.on(), delay(5000)]);
  }

  async setOff() {
    return Promise.race([this.off(), delay(5000)]);
  }

  async getStatus() {
    return Promise.race([this.status(), delay(5000)]);
  }
}

module.exports = Device;
