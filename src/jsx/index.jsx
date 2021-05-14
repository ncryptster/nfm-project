import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3 from "web3";
import CardData from "../data/cardData";
import seedPhrase from "../data/seedPhrase";
import { nfmContractABI, nfmContractAddress } from "../data/nfmContract";
import { nfmtContractABI, nfmtContractAddress } from "../data/nfmtContract";
import {
  pswapLiquidityABI,
  psawpContractAddress,
} from "../data/pswapLiquidity";
import {
  marketplaceABI,
  marketplaceContractAddress,
} from "../data/marketplace";
import Homepage from "./pages/index";
import Dashboard from "./pages/dashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Marketplace from "./pages/marketplace";
import { Card, Form, Col, Button } from "react-bootstrap";
import {
  nfmViewerContractABI,
  nfmViewerContractAddress,
} from "../data/nfmViewerContract";

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
        const correctChainId = chainId == 97;
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
        const nfmVieverContract = new web3.eth.Contract(
          nfmViewerContractABI,
          nfmViewerContractAddress
        );
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
        const totalSupply = await nfmContract.methods.totalSupply().call();
        const isAuthorized = await this.isAuthorized();
        const isMarketAuthorized = await this.isMarketAuthorized();
        const cakeLpBalance = (Math.trunc((await psawpContract.methods.balanceOf(this.state.account).call() / 1000000000000000000)*100)/100).toFixed(2)
        const nfmtBalance = (Math.trunc((await nfmtContract.methods.balanceOf(this.state.account).call() / 1000000000000000000)*100)/100).toFixed(2)
        this.setState({
          nfmVieverContract,
          marketplaceContract,
          nfmContract,
          nfmtContract,
          psawpContract,
          totalSupply,
          isAuthorized,
          isMarketAuthorized,
          cakeLpBalance,
          nfmtBalance
        });
        await this.createTokenMaster();
        this.createUserData();
      } catch (error) {
        console.log(error);
      }
    }
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
    this.setState({ user });
  }

  async createTokenMaster() {
    /*************************************************************************************************
     * @desc creates a master list of tokens
     * *@param array tokenData - array of data from the nfmContract
     * * *@param string determination - number of card determined by blockchain
     * * *@param string get - random number used to make determination
     * * *@param string ipfs - Inter Planetary File System representation of the determined card
     * * *@param string rarity - The rarity of the determinded card
     * *@param array marketData - array of data from the marketPlaceContract
     * * *@param string index - index of the listing on the marketplace
     * * *@param string price - price token is listed for on the marketplace
     * * *@param string seller - address of the seller of the listed token on the marketplace
     * * *@param string tokenID - index of the token in the @param array tokenData
     * @reutrn array - a detailed array of tokens
     *************************************************************************************************/
    let result = [];
    const ownerData = await this.state.nfmVieverContract.methods
      .seeAllOwners()
      .call();
    const tokenData = await this.state.nfmVieverContract.methods
      .seeAllListingInfo()
      .call();
    const marketData = await this.state.marketplaceContract.methods
      .seeAllListingInfo()
      .call();
    for (let tokenId = 0; tokenId < tokenData.length; tokenId++) {
      const isListedForSale = () => {
        let listing = { listed: false, seller: "", price: "" };
        let verify = marketData.filter((listing) => {
          return listing.tokenID == tokenId;
        });
        if (verify.length > 0) {
          listing = {
            listed: true,
            seller: verify[0].seller,
            price: verify[0].price,
          };
        }
        return listing;
      };
      const cardData = () => {
        const data = CardData.filter((card) => {
          return card.cardNumber == tokenData[tokenId].determination;
        });
        return data[0];
      };
      const token = {
        tokenId: tokenId,
        tokenOwner: ownerData[tokenId],
        approvedForSale: false,
        listing: isListedForSale(),
        approvedForTrade: false,
        listedForTrade: false,
        card: {
          cardNumber: cardData().cardNumber,
          cardName: cardData().cardName,
          cardText: cardData().cardText,
          cardRarity: cardData().cardRarity,
          fileName: cardData().fileName,
        },
      };
      result.push(token);
    }
    this.setState({ allTokenData: result });
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
    const psawpContract = new this.state.web3.eth.Contract(
      pswapLiquidityABI,
      psawpContractAddress
    );
    const approvedFor = await psawpContract.methods
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
      this.priceCardBody(tokenID);
      this.openPriceModal();
    } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
      console.log(error);
    }
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
      this.createUserData();
    } catch (error) {
      if (error.code === 4001) {
        userReject();
      }
    }
  }

  approveCardBody(userCards, card, action) {
    let sizer = "";
    if (action == "sell") {
      const cardsForSale = userCards.filter(
        (item) => item.cardNumber == card.cardNumber
      );
      if (cardsForSale.length == 1) {
        sizer = "sm";
      } else if (cardsForSale.length > 3) {
        sizer = "lg";
      } else {
        sizer = "";
      }
      this.setState({
        modalBody: {
          render: (
            <Form>
              <Form.Row>
                {cardsForSale.map((card, key) => (
                  <Col
                    key={key}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card className="text-center">
                      <Card.Body>
                        <Card.Title>
                          #: {card.cardNumber} Id: {card.cardId}
                        </Card.Title>
                        <img
                          src={require("../images/cards/" + card.fileName)}
                          alt=""
                          width="125"
                        />
                      </Card.Body>

                      <Card.Footer className="text-muted">
                        <Button
                          variant="secondary"
                          onClick={(e) => {
                            this.approveNFMForMarketplace(card.cardId);
                            this.closeApproveModal();
                          }}
                        >
                          Approve
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Form.Row>
              <Form.Row></Form.Row>
            </Form>
          ),
          size: sizer,
        },
      });
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
      nfmVieverContract: null,
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
      showPriceModal: false,
      openPriceModal: this.openPriceModal.bind(this),
      closePriceModal: this.closePriceModal.bind(this),
      showApproveModal: false,
      openApproveModal: this.openApproveModal.bind(this),
      closeApproveModal: this.closeApproveModal.bind(this),
      approveCardBody: this.approveCardBody.bind(this),
      handleInputChange: this.handleInputChange.bind(this),
      handleSubmit: this.handleSubmit.bind(this),
    };
  }

  openPriceModal() {
    this.setState({ showPriceModal: true });
  }

  closePriceModal() {
    this.setState({ showPriceModal: false });
  }

  openApproveModal() {
    this.setState({ showApproveModal: true });
  }

  closeApproveModal() {
    this.setState({ showApproveModal: false });
  }

  handleSubmit = (event, tokenID) => {
    event.preventDefault();
    const listAmount = this.state.price;
    try {
      this.listAMeme(tokenID, listAmount);
      this.setState({ price: "" });
    } catch (error) {}
  };

  handleInputChange = (event) => {
    event.preventDefault();
    const text = event.target.value;
    this.setState({
      price: text,
    });
  };
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
