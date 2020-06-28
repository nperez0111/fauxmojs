const debug = require("debug")("fauxmojs:server");
const http = require("http");

module.exports = function createServer(router, { port } = {}) {
  debug("initialize");
  const server = http.createServer(router);

  server.listen(port);

  return new Promise((resolve, reject) => {
    server.on("error", (err) => {
      debug("server error", err);
      reject(err);
    });
    server.on("listening", () => {
      debug("listening", server.address());
      resolve(() => server.close());
    });
  });
};
