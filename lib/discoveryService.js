const debug = require("debug")("fauxmojs:discoveryService");
const dgram = require("dgram");
const interalIp = require("internal-ip");
const bootId = require("./shared/bootId");
const devices = require("./shared/devices");

function getDiscoveryResponses(ipAddress) {
  const responses = devices.get().map((device) => {
    const responseString = `HTTP/1.1 200 OK\r
CACHE-CONTROL: max-age=86400\r
DATE: 2018-06-13\r
EXT:\r
LOCATION: http://${ipAddress}:${device.getPort()}/${device.getId()}/setup.xml\r
OPT: "http://schemas.upnp.org/upnp/1/0/"; ns=01\r
01-NLS: ${bootId.getId()}\r
SERVER: Unspecified, UPnP/1.0, Unspecified\r
ST: urn:Belkin:device:**\r
USN: uuid:Socket-1_0-${device.getId()}::urn:Belkin:device:**\r\n\r\n`;

    return Buffer.from(responseString);
  });
  return responses;
}
function discoveryFactory() {
  let udpServer;

  async function stopDiscoveryServer() {
    if (!udpServer) {
      debug("server is not running");
      return;
    }
    await new Promise((resolve, reject) => {
      debug("try to stop udpServer");
      try {
        udpServer.close(() => {
          debug("udp server stopped");
          resolve();
        });
      } catch (err) {
        debug("failed to close udp server: %s", err.message);
        // ? swallow this error
        reject(err);
      }
    });
  }

  async function startDiscoveryServer() {
    const ipAddress = await interalIp.v4();
    await stopDiscoveryServer();
    udpServer = dgram.createSocket({ type: "udp4", reuseAddr: true });

    udpServer.on("error", (err) => {
      debug(`server error:\n${err.stack}`);
      throw err;
    });

    udpServer.on("message", async (msg, { address, port }) => {
      debug(`message from ${address}:${port}`);

      if (msg.indexOf("ssdp:discover") > 0) {
        try {
          const responses = await getDiscoveryResponses(ipAddress);
          await responses.reduce(async (p, response) => {
            await p;
            return new Promise((resolve, reject) => {
              udpServer.send(response, port, address, (err) => {
                if (err) {
                  reject(err);
                }
                resolve();
              });
            });
          }, Promise.resolve());

          debug("sent all devices");
        } catch (err) {
          // Swallow error
          debug(`Received error:`, err);
        }
      }
    });

    debug("binding to port 1900 for ssdp discovery");

    await new Promise((resolve, reject) => {
      try {
        udpServer.bind(1900);
      } catch (err) {
        debug("error binding udp server: %s", err.message);
        throw err;
      }
      udpServer.on("listening", () => {
        try {
          const { address, port } = udpServer.address();
          debug(`listening ${address}:${port}`);
          udpServer.addMembership("239.255.255.250");
          resolve();
        } catch (err) {
          debug("udp server error: %s", err.message);
          reject(err);
        }
      });
    });

    return stopDiscoveryServer;
  }

  return {
    stop: stopDiscoveryServer,
    start: startDiscoveryServer,
  };
}

module.exports = discoveryFactory();
