import React, { Component } from "react";
import PetitionManager from "./contracts/PetitionManager.json";
import getWeb3 from "./utils/getWeb3";
import RegisterForm from './components/RegisterForm'
import CreatePetitionForm from './components/CreatePetitionForm'
import PetitionNumber from './components/PetitionNumber'
import PetitionGrid from './components/PetitionGrid'
import Address from './components/Address'
import "./App.css";

class App extends Component {
  state = { petitionNumber: -1,
          web3: null,     
          accounts: null,
          contract: null,
          isUser: false,
          identity: {name:"",ens:"",ipfs:""},
          petitions:[] };

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
      this.setState({ web3, accounts, contract: instance }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  setIdentity = (name,ens,ipfs_avatar) =>{
    this.setState({isUser:true, identity:{name,ens,ipfs_avatar} })
  }

  fetchPetitions = async () =>{
    const contract  = this.state.contract;
    // if petitionNumber is set to initial value -1, we fetch all the petitions
    const oldPetitionNumber = this.state.petitionNumber=== -1 ? 0 : this.state.petitionNumber;
    const newPetitionNumber = await contract.methods.idGenerator().call();
    this.setState({ petitionNumber: newPetitionNumber });
    const newPetitions = [];

    //Two calls for each petition to get also the creator data, signers fetch is done separately
    for(let i = oldPetitionNumber; i<newPetitionNumber; i++){
      const petitionData = await contract.methods.petitions(i).call();
      const creatorData = await contract.methods.users(petitionData.creator).call();
      petitionData.identity = creatorData;
      newPetitions.push(petitionData);
    }

    console.dir(newPetitions)
    this.setState(prevState => ({
      petitions: [...prevState.petitions, ...newPetitions]
    }))
  }

  fetchSignatures = async (petitionIndex,totalSignatures) => {
    const contract  = this.state.contract;
    const signatures = []
    for(let i = 0 ; i < totalSignatures ; i++){
      const signature = await contract.methods.getSignaturesFromIndex(i, petitionIndex).call();

      if(signature.name !== ""){
        signatures.push(signature);
      }
    }
    return signatures;
  }

  fetchPetition = async (petitionIndex) =>{
    const contract  = this.state.contract;
    // if petitionNumber is set to initial value -1, we fetch all the petitions
    const petitionData = await contract.methods.petitions(petitionIndex).call();
    const creatorData = await contract.methods.users(petitionData.creator).call();
    petitionData.identity = creatorData;

    this.setState(prevState => ({
    petitions: [
      ...prevState.petitions.slice(0,petitionIndex), petitionData, ...prevState.petitions.slice(petitionIndex+1)]
    }))
  }

  checkUser = async () =>{
    const { accounts, contract } = this.state;
    const isUserResponse = await contract.methods.users(accounts[0]).call();
    console.log(isUserResponse);
    if(isUserResponse.name !== ""){
      this.setIdentity(isUserResponse.name, isUserResponse.ens, isUserResponse.ipfs_avatar);
    }
  }

  runInit = async () => {
    this.fetchPetitions();
    this.checkUser();
  };

  handleRegistration = async (name,ens,ipfs) => {
    const { accounts, contract } = this.state;

    console.log(name + " app")

    const registrationResponse = await contract.methods.createUser(name,ens,ipfs).send({from: accounts[0]})
    if(registrationResponse){
      this.checkUser();
    }
  };

  handleCreatePetition = async (name, description, link, ipfs, target) => {
    const { accounts, contract } = this.state;

    const petitionCreationResponse = await contract.methods.createPetition(name, description, link, ipfs, target).send({from: accounts[0]})
    if(petitionCreationResponse){
      this.fetchPetitions()
    }
  }

  handleSignPetition = async (petitionIndex) =>{
    const { accounts, contract } = this.state;
    const petitionSignResponse = await contract.methods.signPetition(petitionIndex).send({from:accounts[0]})
    if(petitionSignResponse){
      this.fetchPetition(petitionIndex)
    }

  } 
  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Address address={this.state.accounts[0]} identity={this.state.identity}/>
        {!this.state.isUser && <div> <h4>You are not registered to the service!</h4>
        <RegisterForm handleRegistration={this.handleRegistration} myAddress={this.state.accounts[0]} web3={this.state.web3}/>
        </div>}
        {this.state.isUser && <div><CreatePetitionForm handleCreatePetition={this.handleCreatePetition}/></div>}
         {(this.state.petitionNumber > 0 && this.state.isUser) && <div> <PetitionGrid petitionData={this.state.petitions} 
          handleSignPetition={this.handleSignPetition} fetchSignatures={this.fetchSignatures} myAddress={this.state.accounts[0]} /> </div>} 
        <PetitionNumber count={this.state.petitionNumber} />
      </div>
    );
  }
}

export default App;
