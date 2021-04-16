import React, {  } from 'react'
import { Link } from 'react-router-dom'
import Header1 from '../layout/header1'
import CardExplorer from "./../element/card-explorer"
import Footer1 from '../layout/footer1'





function Homepage(props) {
    let cards = props.cards
    cards.sort(function (a, b) {
        return a.cardNumber - b.cardNumber;
      })
    cards = getUniqueListBy(cards, 'cardNumber') 
    return (
        <>
            <Header1 />



            <div className="intro" id="home">
                <div className="container">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-xl-6 col-lg-6 col-12">
                            <div className="intro-content">
                                <h1>Roll for Collectable Meme Cards with <strong className="text-primary">NonFungibleMeme.App</strong>. <br /> Take you chance NOW!
                            </h1>
                                <p>Can you be the the first to collect each card? Can you collect the whole set? Trade with others for their cards or sell them on the marketplace.</p>
                            </div>

                            <div className="intro-btn">
                                <Link to={'./blank'} className="btn btn-primary">Get Started</Link>

                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6 col-12 justify-content-center">
                            <div className="Blank Card">
                                <img src={require('./../../images/empty-card.png')} alt="" width="300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="portfolio section-padding" id="attributes">
                <div className="container">
                    <div className="row py-lg-5 justify-content-center">
                        <div className="col-xl-7">
                            <div className="section-title text-center">
                                <h2>Card Attributes</h2>
                                <p>Each card has the following attributes</p>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-between">
                        <div className="col-xl-7 col-lg-6">
                            <div className="portfolio_list">
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="media">
                                            <span className="port-icon"> <i className="las la-file-signature"></i></span>
                                            <div className="media-body">
                                                <h4>Card Name</h4>
                                                <p>This area contains the name of the card
                                            </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="media">
                                            <span className="port-icon"> <i className="las la-percentage"></i></span>
                                            <div className="media-body">
                                                <h4>Rarity</h4>
                                                <p>There are four rarity levels of cards. Each indicated on the card in 3 ways. Color, Symbol and Text
                                            </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="media">
                                            <span className="port-icon"> <i className="las la-photo-video"></i></span>
                                            <div className="media-body">
                                                <h4>Media</h4>
                                                <p>This area displays the media of the meme
                                            </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="media">
                                            <span className="port-icon"> <i className="las la-comment"></i></span>
                                            <div className="media-body">
                                                <h4>Text</h4>
                                                <p>The section displays the text of the meme
                                            </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6">
                            <div className="portfolio_img" align="center">
                                <img src={require('./../../images/card-description.png')} alt="" className="img-fluid" width="300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="trade-app section-padding" id="marketplace">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6">
                            <div className="section-title text-center">
                                <h2>Collect Trade Sell</h2>
                                <p> Each released set will contain 60 diffenet cards ranging in rarity from COMMON, RARE, EPIC, and LEGENDAY. The odds of getting each teir increases.
                            </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-12">
                            <div className="card trade-app-content">
                                <div className="card-body">
                                    <span><i className="las la-clipboard-check"></i></span>
                                    <h4 className="card-title">Collect</h4>
                                    <p>Be the FIRST to unlock each card and be the "Original Owner". Flex your NERD and be the first to collect the whole set.</p>

                                    <Link to={'./blank'}> Know More <i className="la la-arrow-right"></i> </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-12">
                            <div className="card trade-app-content">
                                <div className="card-body">
                                    <span><i className="las la-sync"></i></span>
                                    <h4 className="card-title">Trade</h4>
                                    <p>Have friends that own a card that you don't? Make an OFFER of TRADE for a card they don't have and if they accept, it's all yours.</p>

                                    <Link to={'./blank'}> Know More <i className="la la-arrow-right"></i> </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-12">
                            <div className="card trade-app-content">
                                <div className="card-body">
                                    <span><i className="las la-wallet"></i></span>
                                    <h4 className="card-title">Market</h4>
                                    <p>Have a card that no one else does? Want to sell your cards? Just list it on the marketplace for your asking price and see if there are any takers.</p>

                                    <Link to={'./blank'}> Know More <i className="la la-arrow-right"></i> </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="testimonial section-padding" id="discovery">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6">
                            <div className="section-title">
                                <h2>Curently Discovered Cards: {cards.length} / 60</h2>

                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-10">
                            <div className="testimonial-content">
                            <CardExplorer {...props} cards = {cards}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="promo section-padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8">
                            <div className="section-title text-center">
                                <h2>A Decentralized Application Powered by the block chain and secured through MetaMask</h2>
                                <p> Current technology for a digital age
                            </p>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center py-5">
                        <div className="col-xl-4 col-lg-4 col-md-4">
                            <div className="promo-content">
                                <div className="promo-content-img">
                                    <img className="img-fluid" src={require('./../../images/binance.svg')} alt="" />
                                </div>
                                <h3>Binance Smart Chain </h3>
                                <p>ERC-721 non-fungable token smart contract deployed on the Binance Smart Chain a new fork of the Ethereum Network
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4">
                            <div className="promo-content">
                                <div className="promo-content-img">
                                    <img className="img-fluid" src={require('./../../images/dapp.svg')} alt="" />
                                </div>
                                <h3>Decentralized Application</h3>
                                <p>Decentralized applications (dApps) exist and run on a blockchain or P2P network of computers instead of a single computer</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4">
                            <div className="promo-content">
                                <div className="promo-content-img">
                                    <img className="img-fluid" src={require('./../../images/cbp.svg')} alt="" />
                                </div>
                                <h3>Industry best practices</h3>
                                <p>Using the Metamask Interface ensures the privacy of you wallet and tokens. This information is never stored on our servers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <Footer1 />
        </>
    )
}

function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}
export default Homepage;










