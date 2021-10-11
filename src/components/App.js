
/* eslint-disable */
import React, { Component } from 'react';
import DVideo from '../abis/DVideo.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //Load accounts
    //Add first account the the state
		const accounts = await web3.eth.getAccounts()
		console.log(accounts)
		this.setState({account: accounts[0]});

    //Get network ID
		const networkId = await web3.eth.net.getId();
    //Get network data
		const networkData = DVideo.networks[networkId];

    //Check if net data exists, then
		if(networkData){
			//Assign dvideo contract to a variable
			const dVideo = new web3.eth.Contract(DVideo.abi, DVideo.networks[networkId].address)
      //Add dvideo to the state
			this.setState({dVideo})

      //Get videoAmounts from blockchain
			const videosCount = await dVideo.methods.videoCount().call()
      //Add videAmounts to the state
      this.setState({ videosCount })

      //Iterate throught videos and add them to the state (by newest)
      // Load videos, sort by newest
      for (var i=videosCount; i>=1; i--) {
        const video = await dVideo.methods.videos(i).call()
        this.setState({
          videos: [...this.state.videos, video]
        })
      }

      //Set latest video and it's title to view as default 
      //Set loading state to false
			const latest = await dVideo.methods.videos(videosCount).call()
			this.setState({
				currentHash: latest.hash,
				currentTitle: latest.title
			})
			this.setState({ loading: false})

      //If network data doesn't exisits, log error
  	} else {
			window.alert('The contract not deployed to the detected network')
		}
	}

  //Get video
  captureFile = event => {

  }

  //Upload video
  uploadVideo = title => {

  }

  //Change Video
  changeVideo = (hash, title) => {

  }

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      account: '',
      dvideo: null,
      videos: [],
      loading: true,
      currentHash: null,
      currentTitle: null
    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar 
          account={this.state.account} 
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              //states&functions
            />
        }
      </div>
    );
  }
}

export default App;