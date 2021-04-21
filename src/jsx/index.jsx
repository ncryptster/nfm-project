import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Web3 from 'web3'
import CardData from '../data/cardData'
import seedPhrase from '../data/seedPhrase'
import { nfmContractABI, nfmContractAddress } from "../data/nfmContractABI"
import { pswapLiquidityABI, psawpContractAddress } from "../data/pswapLiquidityABI";
import Homepage from './pages/index'
import Dashboard from './pages/dashboard'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

class Index extends Component {

  async componentDidMount() {
  //  await this.loadWeb3()
  //  await this.getData()
  }

  async connectWeb3() {
    const wrongChain = (payload) => toast.dark('⛓️ Plese connect to the Binance Test Net ChainID 56 to enable this App', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      })

    
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask, or Connect an account');
            } else {
                this.setState({
                    accounts
                })
                const account = await window.ethereum.selectedAddress
                this.setState({ account })
                
            }
            const web3 = new Web3(window.ethereum)
            this.setState({
                web3
            })
            const balance = await web3.eth.getBalance(this.state.account)
            // 97 test net 56 main net
            const chainId = await window.ethereum.request({
                method: 'eth_chainId'
            })
            // eslint-disable-next-line
            const correctChainId = chainId == 56
            this.setState({ correctChainId })
            if (!correctChainId) {
              wrongChain()
              return
            }
            window.ethereum.on('accountsChanged', function (accounts) {
                // Time to reload the interface interface
                window.location.reload()
            })
            window.ethereum.on('chainChanged', function (networkId) {
                // We recommend reloading the page, unless you must do otherwise
                window.location.reload()
            })
             
            await this.getData(web3)
        } catch (error) {
            if (error.code === 4001) {
                // User rejected request
            }

            console.log(error)
        }
    } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetMask!')
    }
}

async getData(web3) {
        if (web3) {
            try {
                const nfmContract = new web3.eth.Contract(nfmContractABI, nfmContractAddress)
                const psawpContract = new web3.eth.Contract(pswapLiquidityABI, psawpContractAddress)
                const totalSupply = await nfmContract.methods.totalSupply().call()
                const isPswapAuthorized = await this.isPswapAuthorized()
                this.setState({nfmContract, psawpContract, totalSupply, isPswapAuthorized})
                if (this.state.cards.length === 0 || this.state.totalSupply < totalSupply) {
                    const cards = []
                    for (let i = 0; i < totalSupply; i++) {
                        const card = {}
                        const data = await nfmContract.methods.meme(i).call()
                        const cardNumber = data[1].toString()
                        card.cardNumber = cardNumber
                        const ownerOfCard = await nfmContract.methods.ownerOf(i).call()
                        card.ownerOfCard = ownerOfCard.toLowerCase()
                        card.name = CardData[cardNumber - 1].cardName
                        card.text = CardData[cardNumber - 1].cardText
                        card.rarity = CardData[cardNumber - 1].cardRarity
                        card.fileName = CardData[cardNumber - 1].fileName
                        card.badges = []
                        cards.push(card)

                        this.setState({
                            cards
                        })
                    }
                    this.setState({loaded: true})
                }

            } catch (error) {
                console.log(error)
            }
        }
}



  async isPswapAuthorized() {
    const account = this.state.account
    const psawpContract = new this.state.web3.eth.Contract(pswapLiquidityABI, psawpContractAddress)
    const approvedFor = await psawpContract.methods.allowance(account, nfmContractAddress).call()
    // eslint-disable-next-line
    if (approvedFor != 0) {
      return true
    }
    return false
  }

  async getPswapAuthorized() {
    const account = this.state.account
    const psawpContract = new this.state.web3.eth.Contract(pswapLiquidityABI, psawpContractAddress)
    const approvalAmount = this.state.web3.utils.toWei('100000', 'ether')
    const gasPrice = await this.state.web3.eth.getGasPrice()
    const gasEstimate = await psawpContract.methods.approve(nfmContractAddress, approvalAmount).estimateGas({ from: account })
    await psawpContract.methods.approve(nfmContractAddress, approvalAmount).send({ from: account, gasPrice: gasPrice, gas: gasEstimate })
    const isPswapAuthorized = true
    this.setState({isPswapAuthorized})
  }

  async getRandomCard() {
    this.setState({ loaded: false })
    const input = seedPhrase()
    const contract = this.state.nfmContract
    const account = this.state.account
    await contract.methods.roll(input).send({ from: account })
    await this.updateCardsArray(1)
  }

  async getRandomCardPack() {
    this.setState({ loaded: false })
    const input = seedPhrase()
    const contract = this.state.nfmContract
    const account = this.state.account
    await contract.methods.roll10(input).send({ from: account })
    await this.updateCardsArray(10)
  }

  async updateCardsArray(num) {
    const newCard = (card) => toast.success(`New Card Added: ${card.name} Number: ${card.cardNumber}`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      })
    const currentCards = this.state.cards
    // eslint-disable-next-line
    const allMyCards = currentCards.filter((item => item.ownerOfCard == this.account))
    let myCards
    myCards = getUniqueListBy(allMyCards, 'cardNumber')
    myCards.sort(function (a, b) {
      return a.cardNumber - b.cardNumber;
    })
    for (let i = 0; i < myCards.length; i++) {
      const element = myCards[i]
      if (element.copiesOwned > 1) {
        const cardBadges = myCards[i].badges
        // eslint-disable-next-line
        const hasNewBadge = cardBadges.some((item) => {return item.badge == 'New'})
        if (hasNewBadge) {
          // eslint-disable-next-line
            const newBadge = cardBadges.find((item)=>{return item.badge == 'New'})
            const newBadgeIndex = cardBadges.map(function(e) { return e.badge; }).indexOf('New')
            const numberOfDupes = newBadge.quantity
            if (numberOfDupes < element.copiesOwned) {
                myCards[i].badges[newBadgeIndex].quantity = element.copiesOwned
            }
        } else if (!hasNewBadge) {
            myCards[i].badges.push({badge: 'New', quantity: element.copiesOwned, color: 'danger'})    
        }
        
      }
    }
    const firstIndex = currentCards.length
    const lastIndex = firstIndex + num
    const newCards = []
    for (let i = firstIndex; i < lastIndex; i++) {
      const card = {}
      const data = await this.state.nfmContract.methods.meme(i).call()
      const cardNumber = data[1].toString()
      card.cardNumber = cardNumber
      const ownerOfCard = await this.state.nfmContract.methods.ownerOf(i).call()
      card.ownerOfCard = ownerOfCard.toLowerCase()
      card.name = CardData[cardNumber - 1].cardName
      card.text = CardData[cardNumber - 1].cardText
      card.rarity = CardData[cardNumber - 1].cardRarity
      card.fileName = CardData[cardNumber - 1].fileName
      card.badges = [{badge: 'New', color: "success"}]
      newCard(card)
      newCards.push(card)
    }
    currentCards.push(...newCards)
    this.setState({ cards: currentCards })
    this.setState({loaded: true})
  }


  
  






  constructor(props) {
    super(props)
    this.state = {
      account: '',
      nfmContract: null,
      psawpContract: null,
      totalSupply: 0,
      web3: "",
      cards: [],
      loaded: false,
      connectWeb3: this.connectWeb3.bind(this),
      getPswapAuthorized: this.getPswapAuthorized.bind(this),
      getRandomCard: this.getRandomCard.bind(this),
      getRandomCardPack: this.getRandomCardPack.bind(this),
      isPswapAuthorized: false,
      correctChainId: false
    }
  }

  render() {
    return (
      <>
        <BrowserRouter basename={'/'}>
          <div id="main-wrapper">
          <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
          />
            <Switch>
              <Route path="/" exact render={props => <Homepage
                {...props}
                cards={this.state.cards}
              />} />
              <Route path="/dashboard" exact render={props => <Dashboard
                {...props}
                cards={this.state.cards}
                account={this.state.account}
                accounts={this.state.accounts}
                loaded={this.state.loaded}
                connectWeb3={this.state.connectWeb3}
                correctChainId={this.state.correctChainId}
                getPswapAuthorized={this.state.getPswapAuthorized}
                isPswapAuthorized={this.state.isPswapAuthorized}
                getRandomCard={this.state.getRandomCard}
                getRandomCardPack={this.state.getRandomCardPack}
              />} />
            </Switch>
          </div>
        </BrowserRouter>
      </>
    )
  }
}
function getUniqueListBy(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}
export default Index;