function DeviceManager() {
  const devices = [];
  return {
    add(device) {
      const port = device.getPort();
      if (devices.some((d) => d.getPort() === port)) {
        throw new Error("Device with port already exists");
      }

      devices.push(device);
    },
    remove(deviceId) {
      devices.splice(
        devices.findIndex((device) => device.getId() === deviceId),
        1
      );
    },
    get() {
      return devices;
    },
    find(deviceId) {
      return devices.find((device) => device.getId() === deviceId);
    },
  };
}

module.exports = DeviceManager();
