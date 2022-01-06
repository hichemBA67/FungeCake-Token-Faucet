import React, { Component } from "react";
import FungeToken from "./contracts/FungeToken.json";
import FungeTokenSale from "./contracts/FungeTokenSale.json";
import KycContract from "./contracts/KycContact.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    loaded: false,
    kycAddress: "0x123",
    tokenSaleAddress: null,
    userTokens: 0,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.tokenInstance = new this.web3.eth.Contract(
        FungeToken.abi,
        FungeToken.networks[this.networkId] &&
          FungeToken.networks[this.networkId].address
      );
      this.tokenSaleInstance = new this.web3.eth.Contract(
        FungeTokenSale.abi,
        FungeTokenSale.networks[this.networkId] &&
          FungeTokenSale.networks[this.networkId].address
      );
      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] &&
          KycContract.networks[this.networkId].address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState(
        {
          loaded: true,
          tokenSaleAddress: FungeTokenSale.networks[this.networkId].address,
        },
        this.updateUserTokens,
        this.runExample
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods
      .balanceOf(this.accounts[0])
      .call();
    this.setState({ userTokens: userTokens });
  };

  listenToTokenTransfer = () => {
    this.tokenInstance.events
      .Transfer({ to: this.accounts[0] })
      .on("data", this.updateUserTokens);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    console.log("test");
  };

  handleBuyTokens = async () => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({
      from: this.accounts[0],
      value: this.web3.utils.toWei("1", "wei"),
    });
  };

  handleKycWhitelisting = async () => {
    await this.kycInstance.methods
      .setKycCompleted(this.state.kycAddress)
      .send({ from: this.accounts[0] });
    alert("KYC for " + this.state.kycAddress + " is completed!");
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>FungeCake Token Sale</h1>
        <p>Get your tokens today</p>
        <h2>Kyc Whitelisting</h2>
        Address to allow:{" "}
        <input
          type="text"
          name="kycAddress"
          value={this.state.kycAddress}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleKycWhitelisting}>
          Whitelist
        </button>
        <h2>Buy Tokens</h2>
        <p>
          To buy tokens: Send Wei to this address: {this.state.tokenSaleAddress}
        </p>
        <p>You currently have: {this.state.userTokens} FungeCake Tokens</p>
        <button type="button" onClick={this.handleBuyTokens}>
          Buy more FungeCake Tokens
        </button>
      </div>
    );
  }
}

export default App;
