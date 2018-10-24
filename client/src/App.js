import React, { Component } from 'react'
import SimpleStorageContract from './contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      recentImages: []
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.returnHash = this.returnHash.bind(this);
    console.log('hash' + this.state.ipfsHash) 
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)
    console.log('Starting Contract getting account')
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worke/d.
        return this.simpleStorageInstance.get(0)
      }).then((ipfsHash) => { 
         // Update state with the result. 
        let lastHashId =  this.state.simpleStorageInstance.lastHashId();
        lastHashId = lastHashId.toNumber();
        console.log("last Hash:"+lastHashId);  
        return this.setState({ ipfsHash }) 
      })
    })
  }
    loadRecentImages(event){
            let recentImages = []; 
            let lastHash =  this.state.simpleStorageInstance.lastHashId();
            const firstHash = Math.max(1, lastHash - 5);
            for(let i = lastHash; i >= firstHash; i--){
                let image =  this.loadImage(i);
                recentImages.push(image); 
            }
    }
    loadImage(hash){
        let hashMap = {};
        this.simpleStorageInstance.get(hash).then((value) =>  {
        hashMap.ipfsHashString = value[0];
        console.log("hash map HERE:"+hashMap.ipfsHashString);
        });
        return(hashMap);
    
    }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      //console.log('buffer' + this.state.buffer)
    }
  }

  onSubmit(event) {
    event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
        return this.setState({ ipfsHash: result[0].hash })
      })
    
        console.log('ifpsHash'+ this.state.ipfsHash)
    })
    
  }
  returnHash(event){
    event.preventDefault()
    console.log('hash' + this.state.ipfsHash) 
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
              <h1>Your Image</h1>
              <p>This Meme is being stored on DatBoiCoin</p>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
              <h2>Upload Image</h2>
              <form onSubmit={this.onSubmit} >
                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
              <button onClick = {this.loadRecentImages}>
                load Images
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
