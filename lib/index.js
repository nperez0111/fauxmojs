const debug = require("debug")("fauxmo:server");

const discoveryService = require("./discoveryService");
const deviceEndpoints = require("./deviceEndpoints");
const deviceTypes = require("./devices");
const devices = require("./shared/devices");
const config = require("./shared/config");

async function FauxMoManager({ port = 3000 } = {}) {
  const deviceTypeMap = Object.values(deviceTypes).reduce(
    (out, DeviceBuilder) => {
      // eslint-disable-next-line no-param-reassign
      out[DeviceBuilder.type] = DeviceBuilder;
      return out;
    },
    {}
  );

  const { devices: rawDevices } = await config();
  if (!rawDevices) {
    throw new Error("Unable to find configuration");
  }

  if (!Array.isArray(rawDevices) || rawDevices.length === 0) {
    debug("empty devices array");
    throw new Error("Devices must be provided");
  }

  rawDevices.forEach((device) => {
    const Device = deviceTypeMap[device.type];
    if (!Device) {
      throw new Error(`Device of type ${device.type} does not exist`);
    }
    devices.add(new Device(device));
  });

  await Promise.all([
    discoveryService.start(this.ipAddress),
    deviceEndpoints.start(port),
  ]);

  return () => {
    return Promise.all([discoveryService.stop(), deviceEndpoints.stop()]);
  };
}

module.exports = FauxMoManager;
