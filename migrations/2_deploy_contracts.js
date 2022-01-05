var FungeToken = artifacts.require("../contracts/FungeToken.sol");

module.exports = async function (deployer) {
  await deployer.deploy(FungeToken, 1000000);
};
