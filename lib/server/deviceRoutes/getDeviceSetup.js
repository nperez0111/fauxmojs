const debug = require("debug")("fauxmojs:server:routes:getDeviceSetup");
const express = require("express");
const bootId = require("../../shared/bootId");

const router = express.Router({ mergeParams: true });

function getDeviceSetupRouter() {
  debug("initialize");

  router.get("/", ({ device }, res) => {
    const deviceId = device.getId();
    debug("sending device setup response for device:", deviceId);
    bootId.increment();

    debug("rendering device setup for deviceId:", deviceId);

    return res.send(
      `<?xml version="1.0"?>
      <root>
        <device>
          <deviceType>urn:Fauxmo:device:controllee:1</deviceType>
          <friendlyName>${device.getName()}</friendlyName>
          <manufacturer>Belkin International Inc.</manufacturer>
          <modelName>Emulated Socket</modelName>
          <modelNumber>3.1415</modelNumber>
          <UDN>uuid:Socket-1_0-${deviceId}</UDN>
        </device>
      </root>`
    );
  });

  return router;
}

module.exports = getDeviceSetupRouter;
