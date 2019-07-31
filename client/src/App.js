import React, { Component } from "react";
import PetitionManager from "./contracts/PetitionManager.json";
import getWeb3 from "./utils/getWeb3";
import Button from '@material-ui/core/Button';

import "./App.css";

class App extends Component {
  state = { petitionNumber: -1, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PetitionManager.networks[networkId];
      const instance = new web3.eth.Contract(
        PetitionManager.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.idGenerator().call();

    // Update state with the result.
    this.setState({ petitionNumber: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>There are {this.state.petitionNumber} active petitions right now!</h1>
        <Button variant="contained" color="primary">
           Hello World
        </Button>
      </div>
    );
  }
}

export default App;
