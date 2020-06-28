const debug = require("debug")("fauxmojs:server:routes:deviceControl");
const boom = require("@hapi/boom");
const express = require("express");

const router = express.Router({ mergeParams: true });

function deviceControlRouter() {
  debug("initialize");

  router.post("/", async (req, res) => {
    const { device } = req;

    const payload = await new Promise((resolve) => {
      const partials = [];
      req
        .on("data", (chunk) => {
          partials.push(chunk);
        })
        .on("end", () => {
          // on end of data, perform necessary action
          resolve(Buffer.concat(partials).toString());
        });
    });

    if (!payload) {
      return boom.badRequest();
    }

    try {
      const isSetAction = payload.includes("</u:SetBinaryState>");
      let status = null;
      if (!isSetAction) {
        status = await device.getStatus();
        debug(
          `Device: "${device.getName()}" Current Status: ${
            status ? "on" : "off"
          }`
        );
      } else if (payload.includes("<BinaryState>1</BinaryState>")) {
        debug(`Device: "${device.getName()}" turning on`);
        status = await device.setOn();
      } else if (payload.includes("<BinaryState>0</BinaryState>")) {
        debug(`Device: "${device.getName()}" turning off`);
        status = await device.setOff();
      }

      return res.send(`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
        <u:GetBinaryStateResponse xmlns:u="urn:Belkin:service:basicevent:1">
        <BinaryState>${status ? 1 : 0}</BinaryState>
        </u:GetBinaryStateResponse>
        </s:Body>
        </s:Envelope>`);
    } catch (err) {
      debug("Error thrown when running handler", err);
      return res.send({ ok: false });
    }
  });

  return router;
}

module.exports = deviceControlRouter;
