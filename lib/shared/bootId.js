function bootIdGenerator() {
  let bootId = 1;
  return {
    increment() {
      bootId += 1;
    },
    getId() {
      return bootId;
    },
  };
}

module.exports = bootIdGenerator();
