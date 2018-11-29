import React, { Component } from 'react'
import Gallery from 'react-photo-gallery'
import Lightbox from 'react-images' 
import SimpleStorageContract from '../contracts/SimpleStorage.json'
import getWeb3 from '../utils/getWeb3'
import ipfs from '../ipfs'
import { auth, provider } from '../firebase.js';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
/*
import Button from 'react-bootstrap/lib/Button';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Routes from "../Routes";
import {Link} from "react-router-dom";
*/
import '../css/pure-min.css'
import '../boot/css/bootstrap.css'
import '../App.css'
var Loader = require('react-loader');
const photos= [
/*	
	{ 
		src: "https://ipfs.io/ipfs/QmXTGTkN2LxP3aeAw12Lf25Q9mZgL8xYKUNbqMEueCGyEk",
		width: 1,
		height: 1
	},
	{ 
		src: "https://ipfs.io/ipfs/QmefX88N41ga9ZT6Ya23pERtSsDWNLLPawPKGFoqmievLa",
		width: 1,
		height: 1
	}
*/	
];

class Upload extends Component {

  constructor(props) {
    super(props)

    this.state = {
	username: '',
	user: null,
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      number: 0,
	  currentImage: 0,
      loadingImages: false,
      recentImages: [],
	  
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
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

componentDidMount() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      this.setState({ user });
    } 
  });
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

handleChange(e) {
  /* ... */
}
logout() {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
}
login() {
  auth.signInWithPopup(provider) 
    .then((result) => {
      const user = result.user;
      this.setState({
        user
      });
    });
}

    onSubmit(event) {
        event.preventDefault()
		var exit = 0;	
        ipfs.files.add(this.state.buffer, (error, result) => {
			for(let i = 0; i < this.state.recentImages.length; i++){	
				let object = this.state.recentImages[i];
				if(result[0].hash === object.hashContent){
					console.log("reeeepost");
					exit = 1;
					return
				}
			}	
			if(exit === 1){
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
			console.log("loading image");
            this.simpleStorageInstance.lastHashId ({from: this.state.account}).then((lastHash) =>{ 
				console.log("loading image");
                for(let i = lastHash; i >= 1; i--){
                   this.simpleStorageInstance.get(i, {form: this.state.account}).then((recentHash) => {
						
						console.log("loading image");
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


render(){
return(
		<Grid fluid>
          <Row  className="show-grid">
            <Col md={12} xsOffset={5}>
				{this.state.user ?
				<div>
				  <h3>Welcome</h3>
				  <div className='user-profile'>
					<img src={this.state.user.photoURL} alt=""/>
				  </div>
				</div>
				:
				<div className='wrapper'>
				</div>
			  }      			
              <h1>Upload Image</h1>
			</Col>
		   </Row>
           <Row  className="show-grid">
            <Col md={5} xsOffset={4}>
              <form onSubmit={this.onSubmit} >
		      	<Col md={6} >
              		<input type='file' onChange={this.captureFile} />
				</Col>
				<Col md={4}>
              		<input type='submit' />
			  	</Col>
              </form>
			</Col>
          </Row>
		<Row>
			<Col md={12} xsOffset={5}>
				<h3>Submissions</h3>
			</Col>
		</Row>
		<Row>
		  <Col> 
            <Loader loaded={!this.state.loadingImages}>
                {/* {this.state.recentImages.map((submission) => this.renderImages(submission))}*/ }
				
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
		</Col>
		</Row >
		</Grid>
);
}
}
export default Upload 
