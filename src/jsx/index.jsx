import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Web3 from 'web3'
import CardData from '../data/cardData'
import seedPhrase from '../data/seedPhrase'
import { nfmContractABI, nfmContractAddress } from "../data/nfmContractABI"
import { pswapLiquidityABI, psawpContractAddress } from "../data/pswapLiquidityABI";
import Homepage from './pages/index'
import Dashboard from './pages/dashboard'

class Index extends Component {

  async componentDidMount() {
    await this.loadWeb3()
    await this.getData()
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
      window.alert('Non-Ethereum browser detected. You should consider trying MetMask!')
    }
  }

  async getData() {
    const web3 = window.web3
    if (web3) {
      this.setState({ web3 })
      const accounts = await web3.eth.getAccounts()
      const account = accounts[0]
      //Set the state of the account to pass to the dashboard (user identifcation)
      this.setState({ account })
      const isPswapAuthorized = await this.isPswapAuthorized()
      this.setState({isPswapAuthorized})
      const nfmContract = new web3.eth.Contract(nfmContractABI,nfmContractAddress)
      this.setState({nfmContract})
      const totalSupply = await nfmContract.methods.totalSupply().call()
      this.setState({totalSupply})
      const cards = []
      for (let i = 0; i < totalSupply; i++) {
        const card = {}
        const data = await nfmContract.methods.meme(i).call()
        const cardNumber = data[1].toString()
        card.cardNumber = cardNumber
        const ownerOfCard = await nfmContract.methods.ownerOf(i).call()
        card.ownerOfCard = ownerOfCard
        card.name = CardData[cardNumber - 1].cardName
        card.text = CardData[cardNumber - 1].cardText
        card.rarity = CardData[cardNumber - 1].cardRarity
        card.fileName = CardData[cardNumber - 1].fileName
        card.badges = []

        cards.push(card)
    
      this.setState({cards})
      }
      this.setState({loaded: true})
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
    const currentCards = this.state.cards
    const account = this.state.account
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
        const hasNewBadge = cardBadges.some((item) => {return item.badge == 'New'})
        if (hasNewBadge) {
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
      card.ownerOfCard = ownerOfCard
      card.name = CardData[cardNumber - 1].cardName
      card.text = CardData[cardNumber - 1].cardText
      card.rarity = CardData[cardNumber - 1].cardRarity
      card.fileName = CardData[cardNumber - 1].fileName
      card.badges = [{badge: 'New', color: "success"}]
      newCards.push(card)
    }
    currentCards.push(...newCards)
    console.log(currentCards);
    this.setState({ cards: currentCards })
    this.setState({loaded: true})
  }



  






  constructor(props) {
    super(props)
    this.state = {
      account: '',
      nfmContact: null,
      totalSupplt: 0,
      web3: "",
      cards: [],
      loaded: false,
      getPswapAuthorized: this.getPswapAuthorized.bind(this),
      getRandomCard: this.getRandomCard.bind(this),
      getRandomCardPack: this.getRandomCardPack.bind(this),
      isPswapAuthorized: false
    }
  }

  render() {
    return (
      <>
        <BrowserRouter basename={'/'}>
          <div id="main-wrapper">
            <Switch>
              <Route path="/" exact render={props => <Homepage
                {...props}
                cards={this.state.cards}
              />} />
              <Route path="/dashboard" exact render={props => <Dashboard
                {...props}
                cards={this.state.cards}
                account={this.state.account}
                loaded={this.state.loaded}
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