/* eslint-disable no-param-reassign */
const debug = require("debug")("fauxmojs:server:middleware:error");

function middleware(req, res, next) {
  res.error = function resError(err) {
    let code;
    let message;
    let trace;

    if (err.isBoom) {
      code = err.output.payload.statusCode;
      message = `[${err.output.payload.error}] `;
      message += err.output.payload.message || err.message;
      trace = err.stack;
    } else if (err instanceof Error) {
      debug("generic error caught; use boom if possible.");
      code = isNaN(err.code) ? 500 : err.code; // eslint-disable-line no-restricted-globals, max-len
      message = err.message || err.toString();
      trace = err.stack;
    } else if (typeof err === "number" && err >= 400 && err < 600) {
      debug("invalid error signature; use boom instead.");

      code = err;
      message = "[E1] Error";
    } else if (typeof err === "string") {
      debug("invalid error signature; use boom instead.");

      code = 500;
      message = `[E2] ${err}`;
    }

    trace = trace || new Error().stack;

    return res.status(code).send({
      message,
      httpStatus: code,
      httpMethod: req.method,
      url: req.url,
      user: req.agilemd ? req.agilemd.ownerId : null,
      trace: trace.split("\n"),
    });
  };

  next();
}

module.exports = middleware;
