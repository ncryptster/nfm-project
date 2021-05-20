import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3 from "web3";
import seedPhrase from "../data/seedPhrase";
import { nfmContractABI, nfmContractAddress } from "../data/production/nfmContract";
import { nfmtContractABI, nfmtContractAddress } from "../data/production/nfmtContract";
import { pswapLiquidityABI, psawpContractAddress, } from "../data/production/pswapLiquidity";
import { marketplaceABI, marketplaceContractAddress, } from "../data/production/marketplace";
import { nfmViewerContractABI, nfmViewerContractAddress, } from "../data/production/nfmViewerContract";
import Homepage from "./pages/index";
import Dashboard from "./pages/dashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Marketplace from "./pages/marketplace";
import fetch from "node-fetch";


class Index extends Component {
  async connectWeb3() {
    const wrongChain = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            <span role="img" aria-label="blockchain">
              ⛓
            </span>
            Please connect to the Binance Smart ChainID 56 to enable this App
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const userReject = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            User Rejected Connection. Please re-connect
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const userDisconnect = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            All user accounts are Disconnected. Please re-connect
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log("Please connect to MetaMask, or Connect an account");
          userDisconnect();
        } else {
          this.setState({
            accounts,
          });
          const account = await window.ethereum.selectedAddress;
          this.setState({ account });
        }
        const web3 = new Web3(window.ethereum);
        this.setState({
          web3,
        });
        //const balance = await web3.eth.getBalance(this.state.account)
        // 97 test net 56 main net
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        // eslint-disable-next-line
        const correctChainId = chainId == 56;
        if (!correctChainId) {
          wrongChain();
          return;
        }
        window.ethereum.on("accountsChanged", function (accounts) {
          // Time to reload the interface interface
          if (accounts === 0) {
            userDisconnect();
          }
          window.location.reload();
        });
        window.ethereum.on("chainChanged", function (networkId) {
          // We recommend reloading the page, unless you must do otherwise
          window.location.reload();
        });

        await this.getData(web3);
      } catch (error) {
        if (error.code === 4001) {
          userReject();
        }

        console.log(error);
      }
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetMask!"
      );
    }
  }

  async getData(web3) {
    if (web3) {
      try {
        await this.syncDatabase()
        // const nfmViewerContract = new web3.eth.Contract(
        //   nfmViewerContractABI,
        //   nfmViewerContractAddress
        // );
        const nfmContract = new web3.eth.Contract(
          nfmContractABI,
          nfmContractAddress
        );
        // const nfmtContract = new web3.eth.Contract(nfmtContractABI, nfmtContractAddress)
        const psawpContract = new web3.eth.Contract(
          pswapLiquidityABI,
          psawpContractAddress
        );
        const marketplaceContract = new web3.eth.Contract(
          marketplaceABI,
          marketplaceContractAddress
        );
        const nfmtContract = new web3.eth.Contract(
          nfmContractABI,
          nfmtContractAddress
        );
        this.setState({
          // nfmViewerContract,
          marketplaceContract,
          nfmContract,
          nfmtContract,
          psawpContract,
        })
        const isAuthorized = await this.isAuthorized();
        const isMarketAuthorized = await this.isMarketAuthorized();
        const cakeLpBalance = (Math.trunc((await psawpContract.methods.balanceOf(this.state.account).call() / 1000000000000000000)*100)/100).toFixed(2)
        const nfmtBalance = (Math.trunc((await nfmtContract.methods.balanceOf(this.state.account).call() / 1000000000000000000)*100)/100).toFixed(2)
        this.setState({
          
         isAuthorized,
         isMarketAuthorized,
         cakeLpBalance,
         nfmtBalance
        });
        this.createUserData();
      } catch (error) {
        console.log(error);
      }
    }
  }

  async updateToken(tokenId) {
    //const patch = await fetch(`http://localhost:5000/tokens/${tokenId}`, {method: 'PATCH'})
    const patch = await fetch(`https://nfmt-backend.herokuapp.com/tokens/${tokenId}`, {method: 'PATCH'})

  }

  async syncDatabase() {
    const sync = await fetch('https://nfmt-backend.herokuapp.com/tokens', {method: 'POST'})
    const result = await fetch('https://nfmt-backend.herokuapp.com/tokens', {method: 'GET'})
    // const sync = await fetch('http://localhost:5000/tokens', {method: 'POST'})
    // const result = await fetch('http://localhost:5000/tokens', {method: 'GET'})
        const data = await result.json()
        this.setState({ allTokenData: data })
  }

  createUserData() {
    const userTokens = this.state.allTokenData.filter((token) => {
      return (
        token.tokenOwner.toLowerCase() == this.state.account.toLocaleLowerCase()
      );
    });
    
    const fullSet = [
      ...new Map(this.state.allTokenData.map((item) => [item.card.cardName, item])).values(),
    ];
    const allMarketTokens = this.state.allTokenData.filter((token) => {
      return token.listing.listed == true;
    });
    const userSet = [
      ...new Map(userTokens.map((item) => [item.card.cardName, item])).values(),
    ];
    const isOriginal = (cardNumber) => {
      let result = false;
      const originalOwner = this.state.allTokenData.find((token) => {
        return token.card.cardNumber == cardNumber;
      }).tokenOwner;
      if (originalOwner.toLowerCase() == this.state.account.toLowerCase()) {
        result = true;
      }
      return result;
    };
    const isUnique = (cardNumber) => {
      let result = false;
      const numberOfCopies = this.state.allTokenData.filter((token) => {
        return token.card.cardNumber == cardNumber;
      });
      if (numberOfCopies.length == 1) {
        result = true;
      }
      return result;
    };
    const getQuantity = (cardNumber) => {
      const quantity = userTokens.filter((token) => {
        return token.card.cardNumber == cardNumber;
      }).length;
      return quantity;
    };
    const cardsForSale = allMarketTokens.filter((token) => {
      return (
        token.listing.seller.toLowerCase() != this.state.account.toLowerCase()
      );
    });
    const userCardsForSale = allMarketTokens.filter((token) => {
      return (
        token.listing.seller.toLowerCase() == this.state.account.toLowerCase()
      );
    });
    let dashboardCards = [];
    let dashboardOriginals = [];
    let dashboardUnique = [];
    let dashboardDuplicates = [];
    let dashboardNew = [];
    let scrubCards = [
      dashboardCards,
      dashboardOriginals,
      dashboardUnique,
      dashboardDuplicates,
      dashboardNew,
    ];
    for (let i = 0; i < userSet.length; i++) {
      let index = {
        card: userSet[i].card,
        quantity: getQuantity(userSet[i].card.cardNumber),
        isOriginal: isOriginal(userSet[i].card.cardNumber),
        isUnique: isUnique(userSet[i].card.cardNumber),
        isNew: false,
      };
      if (index.isOriginal) {
        dashboardOriginals.push(index);
      }
      if (index.isUnique) {
        dashboardUnique.push(index);
      }
      if (index.quantity > 1) {
        dashboardDuplicates.push(index);
      }
      if (index.isNew) {
        dashboardNew.push(index);
      }
      dashboardCards.push(index);
    }
    for (let i = 0; i < scrubCards.length; i++) {
      const index = scrubCards[i];
      index.sort((a, b) => (a.card.cardNumber > b.card.cardNumber ? 1 : -1));
    }
    let user = {
      account: this.state.account,
      isAuthorized: this.state.isAuthorized,
      isMarketAuthorized: this.state.isMarketAuthorized,
      cakeLpBalance: this.state.cakeLpBalance,
      nfmtBalance: this.state.nfmtBalance,
      fullSet: fullSet,
      allMarketTokens: allMarketTokens,
      userTokens: userTokens,
      dashboardCardData: {
        dashboardCards,
        dashboardOriginals,
        dashboardUnique,
        dashboardDuplicates,
        dashboardNew,
      },
      marketplaceCardData: {
        cardsForSale,
        userCardsForSale,
      },
      methods: {
        getMarketAuthorized: this.getMarketAuthorized.bind(this),
        getPswapAuthorized: this.getPswapAuthorized.bind(this),
        getRandomCard: this.getRandomCard.bind(this),
        getRandomCardPack: this.getRandomCardPack.bind(this),
        connectWeb3: this.connectWeb3.bind(this),
        approveNFMForMarketplace: this.approveNFMForMarketplace.bind(this),
        tokenIsApproved: this.tokenIsApproved.bind(this),
        listAMeme: this.listAMeme.bind(this),
        buyAMeme: this.buyAMeme.bind(this),
        cancelListing: this.cancelListing.bind(this),
      },
    };
    console.log('the user should change now');
    this.setState({ user });
  }

  
  async isMarketAuthorized() {
    let authorized = { authorized: false, balance: "0" };
    const account = this.state.account;
    const nfmtContract = new this.state.web3.eth.Contract(
      nfmtContractABI,
      nfmtContractAddress
    );
    const approvedFor = await nfmtContract.methods
      .allowance(account, marketplaceContractAddress)
      .call();
    // eslint-disable-next-line
    if (approvedFor != 0) {
      authorized.authorized = true;
      authorized.balance = approvedFor;
      return authorized;
    }
    return authorized;
  }

  async isAuthorized() {
    let authorized = { authorized: false, balance: "0" };
    const account = this.state.account;
    const approvedFor = await this.state.psawpContract.methods
      .allowance(account, nfmContractAddress)
      .call();
    // eslint-disable-next-line
    if (approvedFor != 0) {
      authorized.authorized = true;
      authorized.balance = approvedFor;
      return authorized;
    }
    return authorized;
  }

  async tokenIsApproved(tokenID) {
    let result = false;
    let check = await this.state.nfmContract.methods
      .getApproved(tokenID)
      .call();
    check = check.toLowerCase();
    const verify = "0x4FDEC6535Fea3Ab5A4f8fc97Fe4cf742d723A1C7";
    if (check == verify.toLowerCase()) {
      result = true;
    }
    return result;
  }
  async getMarketAuthorized() {
    const userReject = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            User Rejected Approval. Please try again.
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const gasPrice = await this.state.web3.eth.getGasPrice();
    const gasEstimate = await this.state.nfmtContract.methods
      .approve(
        marketplaceContractAddress,
        "999999999999999999999999999999999999999999"
      )
      .estimateGas({ from: this.state.account });
    try {
      await this.state.nfmtContract.methods
        .approve(
          marketplaceContractAddress,
          "999999999999999999999999999999999999999999"
        )
        .send({
          from: this.state.account,
          gasPrice: gasPrice,
          gas: gasEstimate,
        });
    } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
      console.log(error);
    }
    const isMarketAuthorized = await this.isMarketAuthorized();
    this.setState({ isMarketAuthorized });
    this.createUserData();
  }

  async getPswapAuthorized() {
    const userReject = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            User Rejected Approval. Please try again.
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const account = this.state.account;
    const psawpContract = new this.state.web3.eth.Contract(
      pswapLiquidityABI,
      psawpContractAddress
    );
    const approvalAmount = this.state.web3.utils.toWei("100000", "ether");
    const gasPrice = await this.state.web3.eth.getGasPrice();
    const gasEstimate = await psawpContract.methods
      .approve(nfmContractAddress, approvalAmount)
      .estimateGas({ from: account });
    try {
      await psawpContract.methods
        .approve(nfmContractAddress, approvalAmount)
        .send({ from: account, gasPrice: gasPrice, gas: gasEstimate });
    } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
      console.log(error);
    }
    const isAuthorized = await this.isAuthorized();
    this.setState({ isAuthorized });
    await this.syncDatabase()
    this.createUserData();
  }

  async getRandomCard() {
    const userReject = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            User Rejected. Please try again!
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const input = seedPhrase();
    const contract = this.state.nfmContract;
    const account = this.state.account;
    try {
      await contract.methods.roll(input).send({ from: account });
    } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
      console.log(error);
    }
    try {
    const result = await this.syncDatabase()
    } catch (err) {
      console.error(err)
    }
    this.createUserData();
  }

  async getRandomCardPack() {
    const userReject = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            User Rejected. Please try again!
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const input = seedPhrase();
    const contract = this.state.nfmContract;
    const account = this.state.account;
    try {
      await contract.methods.roll10(input).send({ from: account });
    } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
      console.log(error);
    }
    try {
      const result = await this.syncDatabase()
      } catch (err) {
        console.error(err)
      }
      this.createUserData();
  }

  async approveNFMForMarketplace(tokenID) {
    const userReject = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            User Rejected Approval. Please try again.
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const cardApproved = (tokenID) =>
      toast.dark(
        <div>
          <h5>🅲🅰🆁🅳 🅰🅿🅿🆁🅾🆅🅴🅳</h5>
          <p>The card with ID: {tokenID} has been approved</p>
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const gasPrice = await this.state.web3.eth.getGasPrice();
    const gasEstimate = await this.state.nfmContract.methods
      .approve(marketplaceContractAddress, tokenID)
      .estimateGas({ from: this.state.account });
    try {
      await this.state.nfmContract.methods
        .approve(marketplaceContractAddress, tokenID)
        .send({
          from: this.state.account,
          gasPrice: gasPrice,
          gas: gasEstimate,
        });
        cardApproved(tokenID);
      } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
      console.log(error);
    }
    await this.updateToken(tokenID)
    await this.syncDatabase()
  }

  async listAMeme(tokenID, listAmount) {
    listAmount = listAmount.toString();
    const userReject = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            User Rejected Setting Price. Please try again.
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const cardListed = (tokenID, listAmount) =>
      toast.dark(
        <div>
          {" "}
          <h5>🅲🅰🆁🅳 🅻🅸🆂🆃🅴🅳</h5>{" "}
          <p>
            The card with ID: {tokenID} has been Listed For: {listAmount} NFT
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    var listAmountAdjusted = this.state.web3.utils.toWei(listAmount, "ether");
    listAmountAdjusted = String(listAmountAdjusted);
    const gasPrice = await this.state.web3.eth.getGasPrice();
    const gasEstimate = await this.state.marketplaceContract.methods
      .list(tokenID, listAmount)
      .estimateGas({ from: this.state.account });
    try {
      await this.state.marketplaceContract.methods
        .list(tokenID, listAmountAdjusted)
        .send({
          from: this.state.account,
          gasPrice: gasPrice,
          gas: gasEstimate * 2,
        });
      cardListed(tokenID, listAmount);
      await this.updateToken(tokenID)
      await this.syncDatabase()
      this.createUserData();
    } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
    }
  }

  async buyAMeme(tokenID) {
    const userReject = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            {" "}
            <span role="img" aria-label="user">
              {" "}
              👤{" "}
            </span>{" "}
            User Rejected Approval. Please try again.{" "}
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const gasPrice = await this.state.web3.eth.getGasPrice();
    const gasEstimate = await this.state.marketplaceContract.methods
      .buy(tokenID)
      .estimateGas({ from: this.state.account });
    try {
      await this.state.marketplaceContract.methods
        .buy(tokenID)
        .send({
          from: this.state.account,
          gasPrice: gasPrice,
          gas: gasEstimate * 2,
        });
      await this.updateToken(tokenID)  
      await this.syncDatabase()
      this.createUserData();
    } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
    }
  }

  async cancelListing(tokenID) {
    const userReject = () =>
      toast.dark(
        <div>
          {" "}
          <h5>🅱🅻🅾🅲🅺🅲🅷🅰🅸🅽 🅰🅻🅴🆁🆃</h5>{" "}
          <p>
            {" "}
            <span role="img" aria-label="user">
              {" "}
              👤{" "}
            </span>{" "}
            User Rejected Approval. Please try again.{" "}
          </p>{" "}
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    const gasPrice = await this.state.web3.eth.getGasPrice();
    const gasEstimate = await this.state.marketplaceContract.methods
      .cancel(tokenID)
      .estimateGas({ from: this.state.account });
    try {
      await this.state.marketplaceContract.methods
        .cancel(tokenID)
        .send({
          from: this.state.account,
          gasPrice: gasPrice,
          gas: gasEstimate * 2,
        });
      await this.updateToken(tokenID)
      await this.syncDatabase()
      this.createUserData();
    } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      marketplaceContract: null,
      nfmViewerContract: null,
      nfmContract: null,
      nfmtContract: null,
      psawpContract: null,
      totalSupply: 0,
      web3: "",
      modalBody: "",
      allTokenData: [
        {
          tokenId: "",
          tokenOwner: "",
          approvedForSale: false,
          listing: { listed: false, seller: "", price: "" },
          approvedForTrade: false,
          listedForTrade: false,
          card: {
            cardNumber: "",
            cardName: "",
            cardText: "",
            cardRarity: "",
            fileName: "60.png",
          },
        },
      ],
      user: {
        account: "",
        isAuthorized: { authorized: false, balance: "0" },
        isMarketAuthorized: { authorized: false, balance: "0" },
        cakeLpBalance: "0",
        nfmtBalance: "0",
        fullSet: [],
        allMarketTokens: [],
        userTokens: [],
        dashboardCardData: {
          dashboardCards: [],
          dashboardOriginals: [],
          dashboardUnique: [],
          dashboardDuplicates: [],
          dashboardNew: [],
        },
        marketplaceCardData: { cardsForSale: [], userCardsForSale: [] },
        methods: {
          getPswapAuthorized: this.getPswapAuthorized.bind(this),
          getMarketAuthorized: this.getMarketAuthorized.bind(this),
          getRandomCard: this.getRandomCard.bind(this),
          getRandomCardPack: this.getRandomCardPack.bind(this),
          connectWeb3: this.connectWeb3.bind(this),
          tokenIsApproved: this.tokenIsApproved.bind(this),
          listAMeme: this.listAMeme.bind(this),
          buyAMeme: this.buyAMeme.bind(this),
          cancelListing: this.cancelListing.bind(this),
        },
      },
      
    };
  }

  
  render() {
    return (
      <>
        <BrowserRouter basename={"/"}>
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
              <Route
                path="/"
                exact
                render={(props) => (
                  <Homepage {...props} user={this.state.user} />
                )}
              />
              <Route
                path="/dashboard"
                exact
                render={(props) => (
                  <Dashboard {...props} user={this.state.user} />
                )}
              />
              <Route
                path="/Marketplace"
                exact
                render={(props) => (
                  <Marketplace {...props} user={this.state.user} />
                )}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </>
    );
  }
}

export default Index;
