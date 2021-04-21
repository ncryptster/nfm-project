import React, {  } from 'react'
import Header2 from '../layout/header2'
import Sidebar from '../layout/sidebar'





function Dashboard(props) {
    const account = props.account
    if (props.cards.length > 112) {
        console.log(props.cards[40].ownerOfCard)
        console.log(account)
        console.log(props.accounts);
    }
    
    // eslint-disable-next-line
    const allMyCards = props.cards.filter((item => item.ownerOfCard == props.account))
    let myCards
    myCards = getUniqueListBy(allMyCards, 'cardNumber')
    myCards.sort(function (a, b) {
      return a.cardNumber - b.cardNumber;
    })
    // rearange cards to put anything with a New tag to the front of the array
    for (let i = 0; i < myCards.length; i++) {
        const element = myCards[i];
        
        const cardBadges = element.badges
        if (element.badges.length > 0) {
            // eslint-disable-next-line
            const hasNewBadge = cardBadges.some((item) => {return item.badge == 'New'})
            if (hasNewBadge) {
                const indexOfNew = myCards.indexOf(element)
                myCards.unshift(myCards.splice(indexOfNew, 1)[0]);
            }
        }
    }
    // set card states
    // unique
    for (let i = 0; i < myCards.length; i++) {
        const numberOfCopies = props.cards.filter((item) => {
            // eslint-disable-next-line
          return item.cardNumber == myCards[i].cardNumber
        })
        myCards[i].numberOfCopies = numberOfCopies.length
    }
    for (let i = 0; i < myCards.length; i++) {
      const element = myCards[i];
      // eslint-disable-next-line
      if (element.numberOfCopies == 1) {
          const cardBadges = myCards[i].badges
          // eslint-disable-next-line
          if (cardBadges.length == 0) {
              myCards[i].badges.push({badge: 'unique', color: 'warning'})
          }
          // eslint-disable-next-line
          const hasUniqueBadge = cardBadges.some((item) => {return item.badge == 'unique'})
          if (!hasUniqueBadge) {
            myCards[i].badges.push({badge: 'unique', color: 'warning'})
          }
          
      }
    }
    //has duplicates
    for (let i = 0; i < myCards.length; i++) {
      const numberOfCopies = allMyCards.filter((item) => {
          // eslint-disable-next-line
        return item.cardNumber == myCards[i].cardNumber
      })
      myCards[i].copiesOwned = numberOfCopies.length
      }
      
    for (let i = 0; i < myCards.length; i++) {
      const element = myCards[i]
      if (element.copiesOwned > 1) {
          const cardBadges = myCards[i].badges
          // eslint-disable-next-line
            if (cardBadges.length == 0) {
                myCards[i].badges.push({badge: 'Duplicates', quantity: element.copiesOwned, color: 'danger'})
        }
        // eslint-disable-next-line
        const hasDupesBadge = cardBadges.some((item) => {return item.badge == 'Duplicates'})
        if (hasDupesBadge) {
            // eslint-disable-next-line
            const dupesBadge = cardBadges.find((item)=>{return item.badge == 'Duplicates'})
            const dupesBadgeIndex = cardBadges.map(function(e) { return e.badge; }).indexOf('Duplicates')
            const numberOfDupes = dupesBadge.quantity
            if (numberOfDupes < element.copiesOwned) {
                myCards[i].badges[dupesBadgeIndex].quantity = element.copiesOwned
            }
        } else if (!hasDupesBadge) {
            myCards[i].badges.push({badge: 'Duplicates', quantity: element.copiesOwned, color: 'danger'})    
        }
        
      }
    }
    const duplicates = myCards.filter((item) => {return item.copiesOwned > 1}).reduce((copies, item) => { return item.copiesOwned + copies -1},0)
    // eslint-disable-next-line
    const unique = myCards.filter((item) => {return item.numberOfCopies == 1}).length
    
    //If Account is loaded and isAuthorized but is awaiting card Data
    // eslint-disable-next-line
    if (account && props.isPswapAuthorized && props.cards.length == 0 && props.loaded == false){
    return (
        <>
        <Header2 {...props} account={props.account} cards={props.cards} loaded={props.loaded}/>
                <Sidebar />
        <div className="content-body " id="dashboard">
                    <div className="container-fluid ">
                        <div className="row">

                            <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Your Account</h4>
                                    </div>
                                    <div className="card-body your-position">

                                        <ul className="list-group">
                                            <li
                                                className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                Collected:
                                            <span className="strong"> {myCards.length}/60</span>
                                            </li>
                                            <li
                                                className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                Unique: **Only Owner**
                                            <span className="strong"> {unique}</span>
                                            </li>
                                            <li
                                                className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                Duplicate:
                                            <span className="strong">{duplicates}</span>
                                            </li>
                                            <li
                                                className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                For Sale:
                                            <span className="strong">0</span>
                                            </li>
                                            <li
                                                className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                Sold:
                                            <span className="strong">0</span>
                                            </li>
                                            <li
                                                className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                Traded:
                                            <span className="strong">0</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                <div className="card align-items-center">
                                    <div className="card-header">
                                        <h4 className="card-title">Buy 1 Card</h4>
                                    </div>
                                    <div className="card-body your-position2">

                                        <img src={require('../../images/card.png')} alt="" width="97" />

                                    </div>
                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        props.getRandomCard()
                                    }} className="card-footer">
                                        <button className="button btn btn-primary" type="submit" disabled>Buy Now</button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                <div className="card align-items-center">
                                    <div className="card-header">
                                        <h4 className="card-title">Buy 10 Card Bundle</h4>
                                    </div>
                                    <div className="card-body your-position2">
                                        <div className="row"><img src={require('../../images/cards.png')} alt="" width="90" /></div>

                                    </div>
                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        props.getRandomCardPack()
                                    }} className="card-footer">
                                        <button className="button btn btn-primary" type="submit"disabled>Buy Now</button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                <div className="card align-items-center">
                                    <div className="card-header">
                                        <h4 className="card-title">Marketplace</h4>
                                    </div>
                                    <div className="card-body your-position2">
                                        <div className="row"><img src={require('../../images/market.svg')} alt="" width="131" /></div>
                                    </div>
                                    <div className="card-footer"><button className="button btn btn-primary"disabled>Comming Soon</button></div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                <div className="card align-items-center">
                                    <div className="card-header">
                                        <h4 className="card-title">Trade Cards</h4>
                                    </div>
                                    <div className="card-body your-position2">
                                        <div className="row"><img src={require('../../images/trade.svg')} alt="" width="131" /></div>
                                    </div>
                                    <div className="card-footer"><button className="button btn btn-primary"disabled>Comming Soon</button></div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                <div className="card align-items-center">
                                    <div className="card-header">
                                        <h4 className="card-title">Authorize PancakeSwap</h4>
                                    </div>
                                    <div className="card-body your-position2">
                                        <div className="row"><img src={require('../../images/pancakeswap.png')} alt="" width="131" /></div>
                                    </div>

                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        props.getPswapAuthorized()
                                    }} className="card-footer">
                                        <button className="button btn btn-primary" type="submit" disabled>Authorize</button>
                                    </form>

                                </div>
                            </div>

                        </div>
                        


                    </div>
                </div>
          
          
        
        </>
        
    )
    // eslint-disable-next-line
    } else if (account && props.isPswapAuthorized && props.cards.length != 0 && props.loaded == true){
        return (
            <>
            <Header2 {...props} account={props.account} cards={props.cards} loaded={props.loaded}/>
                    <Sidebar />
            <div className="content-body " id="dashboard">
                        <div className="container-fluid ">
                            <div className="row">
    
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Your Account</h4>
                                        </div>
                                        <div className="card-body your-position">
    
                                            <ul className="list-group">
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Collected:
                                                <span className="strong"> {myCards.length}/60</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Unique: **Only Owner**
                                                <span className="strong"> {unique}</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Duplicate:
                                                <span className="strong">{duplicates}</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    For Sale:
                                                <span className="strong">0</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Sold:
                                                <span className="strong">0</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Traded:
                                                <span className="strong">0</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Buy 1 Card</h4>
                                        </div>
                                        <div className="card-body your-position2">
    
                                            <img src={require('../../images/card.png')} alt="" width="97" />
    
                                        </div>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.getRandomCard()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit" >Buy Now</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Buy 10 Card Bundle</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/cards.png')} alt="" width="90" /></div>
    
                                        </div>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.getRandomCardPack()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit">Buy Now</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Marketplace</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/market.svg')} alt="" width="131" /></div>
                                        </div>
                                        <div className="card-footer"><button className="button btn btn-primary"disabled>Comming Soon</button></div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Trade Cards</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/trade.svg')} alt="" width="131" /></div>
                                        </div>
                                        <div className="card-footer"><button className="button btn btn-primary"disabled>Comming Soon</button></div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Add PancakeSwap Liquidity</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/pancakeswap.png')} alt="" width="131" /></div>
                                        </div>
    
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            window.open("https://exchange.pancakeswap.finance/#/add/BNB/0x46c3d9853eF62a68bDecCc110C37c6b207ab733d", "_blank")
                                        }} className="card-footer">
                                            <button className="button btn btn-success" type="submit">Add Liquidity</button>
                                        </form>
    
                                    </div>
                                </div>
    
                            </div>
                            <div className="row">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-xxl-12 ">
                                    <div className="card align-items-center border border-primary" width="">
    
                                        <div className="card-body your-position2 ">
                                        <div className="btn btn-success align-self-center" style={{width: '200px'}}>Collection Dowloaded</div>
                                            <div className="row"></div>
                                        </div>
    
                                    </div>
                                </div>
    
                            </div>
                            <div className="row">
                            {myCards.map((card, key) =>
                                    <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6" key={key}>
                                        <div className="card align-items-center">
                                            <div className="card-header">
                                                <div className="row">
                                                    <div className="col">
                                                        #{card.cardNumber}
                                                    </div>
                                                    {card.badges.map((i, key) => 
                                                    <div className="col" key={key}>
                                                    <span className={`badge badge-pill badge-${i.color}`} style={{paddingLeft: '-2px'}}>{i.badge}<span className="badge badge-pill badge-dark" style={{marginLeft: '2px'}}>{i.quantity}</span></span>
                                                </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="card-body your-position2">
                                                <div className="row"><img src={require('../../images/cards/'+ card.fileName)} alt="" width="200" /></div>
    
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
    
    
                            </div>
    
    
                        </div>
                    </div>
              
              
            
            </>
            
        )
        }
    //If Account is loaded and isAuthorized and card Data is achieved
    // eslint-disable-next-line
    else if (account && props.isPswapAuthorized && props.cards.length != 0 && props.loaded == false) 
    {
        return (
            <>
            <Header2 {...props} account={props.account} cards={props.cards} loaded={props.loaded}/>
                    <Sidebar />
            <div className="content-body " id="dashboard">
                        <div className="container-fluid ">
                            <div className="row">
    
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Your Account</h4>
                                        </div>
                                        <div className="card-body your-position">
    
                                            <ul className="list-group">
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Collected:
                                                <span className="strong"> {myCards.length}/60</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Unique: **Only Owner**
                                                <span className="strong"> {unique}</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Duplicate:
                                                <span className="strong">{duplicates}</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    For Sale:
                                                <span className="strong">0</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Sold:
                                                <span className="strong">0</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Traded:
                                                <span className="strong">0</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Buy 1 Card</h4>
                                        </div>
                                        <div className="card-body your-position2">
    
                                            <img src={require('../../images/card.png')} alt="" width="97" />
    
                                        </div>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.getRandomCard()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit" disabled>Buy Now</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Buy 10 Card Bundle</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/cards.png')} alt="" width="90" /></div>
    
                                        </div>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.getRandomCardPack()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit" disabled>Buy Now</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Marketplace</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/market.svg')} alt="" width="131" /></div>
                                        </div>
                                        <div className="card-footer"><button className="button btn btn-primary" disabled>Comming Soon</button></div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Trade Cards</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/trade.svg')} alt="" width="131" /></div>
                                        </div>
                                        <div className="card-footer"><button className="button btn btn-primary" disabled>Comming Soon</button></div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Add PancakeSwap Liquidity</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/pancakeswap.png')} alt="" width="131" /></div>
                                        </div>
    
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            window.open("https://exchange.pancakeswap.finance/#/add/BNB/0x46c3d9853eF62a68bDecCc110C37c6b207ab733d", "_blank")
                                        }} className="card-footer">
                                            <button className="button btn btn-success" type="submit">Add Liquidity</button>
                                        </form>
    
                                    </div>
                                </div>
    
                            </div>
                            <div className="row">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-xxl-12 ">
                                    <div className="card align-items-center border border-primary" width="">
    
                                        <div className="card-body your-position2 ">
                                        <div className="btn btn-warning align-self-center" style={{width: '200px'}}><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"style={{marginRight: '5px'}}></span>Loading Collection</div>
                                            <div className="row"></div>
                                        </div>
    
                                    </div>
                                </div>
    
                            </div>
                            <div className="row">
                            {myCards.map((card, key) =>
                                    <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6" key={key}>
                                        <div className="card align-items-center">
                                            <div className="card-header">
                                                <div className="row">
                                                    <div className="col">
                                                        #{card.cardNumber}
                                                    </div>
                                                    {card.badges.map((i, key) => 
                                                    <div className="col" key={key}>
                                                    <span className={`badge badge-pill badge-${i.color}`} style={{paddingLeft: '-2px'}}>{i.badge}<span className="badge badge-pill badge-dark" style={{marginLeft: '2px'}}>{i.quantity}</span></span>
                                                </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="card-body your-position2">
                                                <div className="row"><img src={require('../../images/cards/'+ card.fileName)} alt="" width="200" /></div>
    
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
    
    
                            </div>
    
    
                        </div>
                    </div>
              
              
            
            </>
        )}
        // Account is loaded but customer is not authorized yet
     else if (account && !props.isPswapAuthorized){
        return (
            <>
            <Header2 {...props} account={props.account} cards={props.cards} loaded={props.loaded} />
                    <Sidebar />
            <div className="content-body " id="dashboard">
                        <div className="container-fluid ">
                            <div className="row">
    
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Your Account</h4>
                                        </div>
                                        <div className="card-body your-position">
    
                                            <ul className="list-group">
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Collected:
                                                <span className="strong"> {myCards.length}/60</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Unique: **Only Owner**
                                                <span className="strong"> {unique}</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Duplicate:
                                                <span className="strong">{duplicates}</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    For Sale:
                                                <span className="strong">0</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Sold:
                                                <span className="strong">0</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Traded:
                                                <span className="strong">0</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Buy 1 Card</h4>
                                        </div>
                                        <div className="card-body your-position2">
    
                                            <img src={require('../../images/card.png')} alt="" width="97" />
    
                                        </div>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.getRandomCard()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit"disabled>Buy Now</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Buy 10 Card Bundle</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/cards.png')} alt="" width="90" /></div>
    
                                        </div>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.roll10()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit" disabled>Buy Now</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Marketplace</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/market.svg')} alt="" width="131" /></div>
                                        </div>
                                        <div className="card-footer"><button className="button btn btn-primary" disabled>Comming Soon</button></div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Trade Cards</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/trade.svg')} alt="" width="131" /></div>
                                        </div>
                                        <div className="card-footer"><button className="button btn btn-primary" disabled>Comming Soon</button></div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Authorize PancakeSwap</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/pancakeswap.png')} alt="" width="131" /></div>
                                        </div>
    
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.getPswapAuthorized()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit" >Authorize</button>
                                        </form>
    
                                    </div>
                                </div>
    
                            </div>
                            
                                
    
    
                            
    
    
                        </div>
                    </div>
              
              
            
            </>
        )
    } else {
        return (
            <>
            <Header2 {...props} account={props.account} cards={props.cards} loaded={props.loaded} />
                    <Sidebar />
            <div className="content-body " id="dashboard">
                        <div className="container-fluid ">
                            <div className="row">
    
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Your Account</h4>
                                        </div>
                                        <div className="card-body your-position">
    
                                            <ul className="list-group">
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Collected:
                                                <span className="strong"> {myCards.length}/60</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Unique: **Only Owner**
                                                <span className="strong"> {unique}</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Duplicate:
                                                <span className="strong">{duplicates}</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    For Sale:
                                                <span className="strong">0</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Sold:
                                                <span className="strong">0</span>
                                                </li>
                                                <li
                                                    className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                    Traded:
                                                <span className="strong">0</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Buy 1 Card</h4>
                                        </div>
                                        <div className="card-body your-position2">
    
                                            <img src={require('../../images/card.png')} alt="" width="97" />
    
                                        </div>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.getRandomCard()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit"disabled>Buy Now</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Buy 10 Card Bundle</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/cards.png')} alt="" width="90" /></div>
    
                                        </div>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.roll10()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit" disabled>Buy Now</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Marketplace</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/market.svg')} alt="" width="131" /></div>
                                        </div>
                                        <div className="card-footer"><button className="button btn btn-primary" disabled>Comming Soon</button></div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Trade Cards</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/trade.svg')} alt="" width="131" /></div>
                                        </div>
                                        <div className="card-footer"><button className="button btn btn-primary" disabled>Comming Soon</button></div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                                    <div className="card align-items-center">
                                        <div className="card-header">
                                            <h4 className="card-title">Authorize PancakeSwap</h4>
                                        </div>
                                        <div className="card-body your-position2">
                                            <div className="row"><img src={require('../../images/pancakeswap.png')} alt="" width="131" /></div>
                                        </div>
    
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            props.getPswapAuthorized()
                                        }} className="card-footer">
                                            <button className="button btn btn-primary" type="submit" disabled>Authorize</button>
                                        </form>
    
                                    </div>
                                </div>
    
                            </div>
                            
                                
    
    
                            
    
    
                        </div>
                    </div>
              
              
            
            </>
        )
    }
}
function getUniqueListBy(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

export default Dashboard;










