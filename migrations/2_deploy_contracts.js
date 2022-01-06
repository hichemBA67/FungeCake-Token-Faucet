var FungeToken = artifacts.require("FungeToken");
var FungeTokenSale = artifacts.require("FungeTokenSale");
var MyKycContract = artifacts.require("KycContact");
require("dotenv").config({ path: "../.env" });

module.exports = async function (deployer) {
  let address = await web3.eth.getAccounts();
  await deployer.deploy(FungeToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(MyKycContract);
  await deployer.deploy(
    FungeTokenSale,
    1,
    address[0],
    FungeToken.address,
    MyKycContract.address
  );
  let instance = await FungeToken.deployed();
  await instance.transfer(FungeToken.address, process.env.INITIAL_TOKENS);
};
