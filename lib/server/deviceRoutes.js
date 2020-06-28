const boom = require("@hapi/boom");
const express = require("express");
const morgan = require("morgan");
const expressHealthcheck = require("express-healthcheck");

const error = require("./middleware/error");

const getDeviceSetupRouter = require("./routes/getDeviceSetup");
const deviceControlRouter = require("./routes/deviceControl");

module.exports = (device) => {
  const app = express();
  app.disable("x-powered-by");

  app.use(
    morgan("tiny", {
      skip: (req) => req.path === "/healthcheck",
    })
  );
  app.use((req, _, next) => {
    req.device = device;
    next();
  });
  app.use(error);

  app.use("/healthcheck", expressHealthcheck());
  app.use("/:deviceId/setup.xml", getDeviceSetupRouter());
  app.use("/upnp/control/basicevent1", deviceControlRouter());

  app.use((req, res, next) =>
    next(boom.notFound("unmatched route", { path: req.url }))
  );
  app.use((err, _, res) => res.error(boom.boomify(err)));

  return app;
};
