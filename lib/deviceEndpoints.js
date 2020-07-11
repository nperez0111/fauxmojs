const debug = require("debug")("fauxmojs:deviceEndpoints");
const createServer = require("./server");
const deviceRouter = require("./server/deviceRouter");
const devices = require("./shared/devices");

function serverFactory() {
  let servers = [];

  function stopServers() {
    if (servers.length) {
      debug("Servers stopping.");
      servers.forEach((stopServer) => stopServer());
      servers = [];
    }
  }
  async function startServers() {
    debug("Servers starting.");
    await stopServers();
    servers = await Promise.all(
      devices
        .get()
        .map((device) =>
          createServer(deviceRouter(device), { port: device.getPort() })
        )
    );
    debug("Servers running.");
  }

  return { start: startServers, stop: stopServers };
}

module.exports = serverFactory();
