function isTest() {
  return process.env.ENVIRON === "test";
}

export default isTest;
