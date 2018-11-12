import React, { Component } from 'react'
import Gallery from 'react-photo-gallery'
import Lightbox from 'react-images' 
import SimpleStorageContract from './contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'


import './css/pure-min.css'
import "./App.css"

<div className="pure-menu pure-menu-horizontal">
    <a href="#" class="pure-menu-heading pure-menu-link">DatBoiCoin</a>
    <ul className="pure-menu-list">
	<li><a href="#"><img src="datboicoin.gif"></a></li>
        <li className="pure-menu-item"><a href="#" class="pure-menu-link">Create Account</a></li>
        <li className="pure-menu-item"><a href="#" class="pure-menu-link">Upload Image</a></li>
        <li className="pure-menu-item"><a href="#" class="pure-menu-link">View Image</a></li>
    </ul>
</div>

