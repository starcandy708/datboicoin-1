import React, { Component } from 'react'
import Gallery from 'react-photo-gallery'
import Lightbox from 'react-images' 
import SimpleStorageContract from './contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

import './css/pure-min.css'
import './App.css'
var Loader = require('react-loader');


const photos= [];
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      number: 0,
	  currentImage: 0,
      loadingImages: false,
      recentImages: []
    }
    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
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
        //console.log("Array after function call" + this.state.recentImages);
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
		var exit = 0;	
        ipfs.files.add(this.state.buffer, (error, result) => {
			for(let i = 0; i < this.state.recentImages.length; i++){	
				let object = this.state.recentImages[i];
				if(result[0].hash == object.hashContent){
					console.log("reeeepost");
					exit = 1;
					return
				}
			}	
			if(exit == 1){
				console.log("exit");
				return
			}
            if(error) {
                console.error(error)
                return
            }	
            this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
                return this.setState({ ipfsHash: result[0].hash })
            })
            //console.log('saving ifpsHash-'+ this.state.ipfsHash)
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
 
    loadImages(){
            this.setState({loadingImages: true, recentImages: []}); 
            let recentImages = []; 
			//let photos = [];
            this.simpleStorageInstance.lastHashId ({from: this.state.account}).then((lastHash) =>{ 
                for(let i = lastHash; i >= 1; i--){
                   this.simpleStorageInstance.get(i, {form: this.state.account}).then((recentHash) => {
                        let photo = {src:"",width:1,height:1};
						let submission = {};
						var ipfs = "https://ipfs.io/ipfs/"
						var hash = recentHash[0];
						var url = ipfs.concat(hash); 	
						console.log("URL-"+url);
						photo.src = url;
						var img = new Image(); 
						img.src = url;
						console.log(img.width+" "+img.height);	
						photo.width = img.width;						
						photo.height = img.height;
						photos.push(photo);
						
						//this.setState(photos: photos);
	
                        submission.hashContent = recentHash[0];
                        submission.sender = recentHash[1];
                        submission.time = recentHash[2].toNumber(); 
                        submission.hashId = i.toString();
                        recentImages.push(submission);
                        this.setState(recentImages: recentImages);
                    }) 
                }
    
                return this.setState({loadingImages: false, recentImages: recentImages});  
            })
    }
	openLightbox(event, obj) {
	this.setState({
	  currentImage: obj.index,
	  lightboxIsOpen: true,
	});
	}
	closeLightbox() {
	this.setState({
	  currentImage: 0,
	  lightboxIsOpen: false,
	});
	}
	gotoPrevious() {
	this.setState({
	  currentImage: this.state.currentImage - 1,
	});
	}
	gotoNext() {
	this.setState({
	  currentImage: this.state.currentImage + 1,
	});
	}
    renderImages(submission){
        return(
            <div className="RecentImage" >
                <div className="pure-g" > 
                    <div className="pure-u-1-2"> 
                        <div className="pure-g">
                            <div className="pure-u-1-1"> 
                                <label className="submission-label">Sender:</label>
                                <span className="submission-id">{submission.sender}</span>
                            </div>
                        </div>
                        <div className="pure-g">
                            <div className="pure-u-1-1"> 
                                <label className="submission-label">Time:</label>
                                <span className="submission-timestamp">{new Date(submission.time*1000).toISOString()}</span>
                            </div>
                        </div>
                        <div className="pure-g">
                            <div className="pure-u-1-1"> 
                                <label className="submission-label">Hash:</label>
                                <span className="submission-hashID">{submission.hashId}</span>
                            </div>
                        </div>
                    </div>
                    <div className="pure-u-1-2"> 
						<img className="pure-img"  src={`https://ipfs.io/ipfs/${submission.hashContent}`} alt=""/> 	
                    </div>
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
            </div>
          </div>
        <div className="RecentSubmissions">
          <div className="pure-u-1-1">
            <h3>Recent Submissions</h3>
            <Loader loaded={!this.state.loadingImages}>
                {/* {this.state.recentImages.map((submission) => this.renderImages(submission))} */}
				
				<div className="test">
					<Gallery photos={photos} onClick={this.openLightbox}/>
					<Lightbox images={photos}
						onClose={this.closeLightbox}
         	 			onClickPrev={this.gotoPrevious}
          				onClickNext={this.gotoNext}
          				currentImage={this.state.currentImage}
          				isOpen={this.state.lightboxIsOpen}
        			/>
				</div>
            </Loader>
            </div>	
          </div>
        </main>
      </div>
    );
  }
}

export default App
