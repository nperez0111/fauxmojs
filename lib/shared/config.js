const { cosmiconfig } = require("cosmiconfig");

const explorer = cosmiconfig("fauxmo");

module.exports = async function loadConfig() {
  const { config } = (await explorer.search()) || {};

  return config;
};
