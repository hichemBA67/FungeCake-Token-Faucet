const Token = artifacts.require("FungeToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({ path: "../.env" });

contract("Token Test", async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    this.fungeToken = await Token.new(process.env.INITIAL_TOKENS);
  });

  it("All tokens should be in my account", async () => {
    let instance = this.fungeToken;
    let totalSupply = await instance.totalSupply();

    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
    //  Other possible solution
    // let balance = await instance.balanceOf(accounts[0]);
    // assert.equal(
    //   balance.valueOf(),
    //   initialSupply.valueOf,
    //   "The balance was not the same"
    // );
  });

  //   it("Is possible to send tokens between accounts", async () => {
  //     const sendTokens = 1;
  //     let instance = this.fungeToken;
  //     let totalSupply = await instance.totalSupply();

  //     expect(
  //       instance.balanceOf(deployerAccount)
  //     ).to.eventually.be.a.bignumber.equal(totalSupply);
  //     expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
  //     expect(
  //       instance.balanceOf(deployerAccount)
  //     ).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
  //     return expect(
  //       instance.balanceOf(recipient)
  //     ).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
  //   });

  //   it("Is not possible to send more tokens than available in total", async () => {
  //     let instance = this.fungeToken;
  //     let balanceOfDeployer = await instance.balanceOf(deployerAccount);

  //     expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to
  //       .eventually.be.rejected;

  //     return expect(
  //       instance.balanceOf(deployerAccount)
  //     ).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
  //   });
});
