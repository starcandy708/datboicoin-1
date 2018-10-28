import React, { Component } from 'react'
import SimpleStorageContract from './contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

import './css/pure-min.css'
import './App.css'
var Loader = require('react-loader');

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      number: 0,
      loadingImages: false,
      recentImages: []
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.loadImages = this.loadImages.bind(this);
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

async  instantiateContract() {
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
      this.state.web3.eth.getAccounts( async (error, accounts) => { 
         simpleStorage.deployed().then(async (instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worke/d.
        
        this.loadImages();  
        console.log("Array after function call" + this.state.recentImages);
        return this.simpleStorageInstance.get(2)
      }).then((ipfsHash) => { 
         // Update state with the result. 
    //    await this.loadImages();  
        this.setState({ ipfsHash})  
      }) 
    })
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
            console.log('saving ifpsHash-'+ this.state.ipfsHash)
        })
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

    returnArray(event){
        event.preventDefault();
        console.log("Images Recent-"+this.state.ipfsHash); 
    }
  
    async loadImages(){
            this.setState({loadingImages: true, recentImages: []}); 
            let recentImages = []; 
            this.simpleStorageInstance.lastHashId ({from: this.state.account}).then((lastHash) =>{ 
                const firstHash = Math.max(1, lastHash - 5);
                for(let i = lastHash; i >= firstHash; i--){
                   this.simpleStorageInstance.get(i, {form: this.state.account}).then((recentHash) => {
                        let submission = {};
                        submission.hashContent = recentHash;
                        submission.hashId = i;
                        recentImages.push(submission);
                        this.setState(recentImages: recentImages);
                        //console.log("Hash id -" + submission.hashId + "Hash -" + submission.hashContent);
                        console.log("array in function" + this.state.recentImages);
                    }) 
                }
    
                console.log("array in function before return" + this.state.recentImages);
                return this.setState({loadingImages: false, recentImages: recentImages});  
            })
    }
    renderImages(submission){

        console.log("array in function" + this.state.recentImages);
        return(
            <div className="RecentImage" key={submission.hashId}>
              <div className="pure-g">
                <img src={`https://ipfs.io/ipfs/${submission.hashContent}`} alt=""/> 
              </div>
            </div>);
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
              <h2>Upload Image</h2>
              <form onSubmit={this.onSubmit} >
                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
              <button onClick = {this.returnArray}>
                ReturnArray
              </button>
            </div>
          </div>
        <div className="RecentSubmissions">
          <div className="pure-u-1-1">
            <h3>Recent Submissions</h3>
            <Loader loaded={!this.state.loadingImages}>
              {this.state.recentImages.map((submission) => this.renderImages(submission))}
            </Loader>
          </div>
        </div>

        </main>
      </div>
    );
  }
}

export default App
