import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from './ipfs'

import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer: null, ipfsHash: '' };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.set(5, { from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.get();

    // Update state with the result.
    this.setState({ storageValue: response.toNumber() });
  };

  captureFile(event){
   event.preventDefault()
   const file = event.target.files[0]
   const reader = new window.FileReader()
   reader.readAsArrayBuffer(file)
   reader.onloadend = () => {
     this.setState({buffer: Buffer(reader.result)})
     console.log('buffer', this.state.buffer)
   }
  }

  onSubmit(event){
   event.preventDefault()
   ipfs.files.add(this.state.buffer, (error,result) => {
    if(error){
     console.error(error)
     return
    }
   this.setState({ipfsHash: result[0].hash})
   console.log('ipfsHash', this.state.ipfsHash)
   })
  }

  render() {
    return (
      <div className="App">
	<nav className="navbar pure-menu pure-menu-horizontal">
	    <a href="#" className="pure-menu-heading pure-menu-link">IPFS File Upload DApp</a>
	</nav>
	<main className="container">
	 <div className="pure-g">
	  <div className="pure-u-1-1">
           <h1>Your image</h1>
           <p>This image is stored on IPFS & The Ethereum Blockchain</p>
           <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
	   <h2>Upload Image</h2>
	   <form onSubmit={this.onSubmit}>
             <input type='file' onChange={this.captureFile} />
	     <input type='submit'/> 
	   </form>
          </div>
         </div>
        </main>
       </div>
    );
  }
}

export default App;
