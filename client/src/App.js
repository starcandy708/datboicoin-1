import React, { Component } from 'react'
import  { auth, provider } from './firebase.js';
import Button from 'react-bootstrap/lib/Button';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Routes from "./Routes";
import {Link} from "react-router-dom";
import './css/pure-min.css'
import './boot/css/bootstrap.css'
import './App.css'

class App extends Component {
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
  render() {
    return (
	<div>
		<Navbar fixedTop fluid>
	  		<Nav>
				<NavItem>
		  			<Link to="/">Home</Link>
				</NavItem>
				<NavItem>
		  			<Link to="/upload">Upload and View</Link>
				</NavItem>
	  		</Nav>
			<Nav pullRight>
				<Navbar.Form>
					{this.state.user ? <Button onClick={this.logout}>Log Out</Button> : <Button onClick={this.login}>Log In</Button>}
				</Navbar.Form>
			</Nav>
		</Navbar>
		<Routes />
	</div>
    );
  }
}

export default App
