const axios = require("axios");
const Device = require("../Device");

const ON = "on";
const OFF = "off";

class ExampleDevice extends Device {
  constructor({
    name,
    port,
    baseURL,
    onURL,
    onOptions = {},
    offURL,
    offOptions = {},
    statusURL,
    statusOptions = {},
    axiosOptions = {},
  }) {
    super({ name, port });
    this.currentStatus = OFF;

    this.onURL = onURL;
    this.onOptions = onOptions;
    this.offURL = offURL;
    this.offOptions = offOptions;
    this.statusURL = statusURL;
    this.statusOptions = statusOptions;

    this.axios = axios.create({ baseURL, ...axiosOptions });
  }

  static get type() {
    return "HTTPDevice";
  }

  async status() {
    await this.axios({ url: this.statusURL, ...this.statusOptions });
    return this.currentStatus === ON;
  }

  async on() {
    await this.axios({ url: this.onURL, ...this.onOptions });
    this.currentStatus = ON;
  }

  async off() {
    await this.axios({ url: this.offURL, ...this.offOptions });
    this.currentStatus = OFF;
  }
}

module.exports = ExampleDevice;
