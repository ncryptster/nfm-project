import React from "react";

export default function AuthorizeCard(props) {
  
  const loader = <div><span className="spinner-border spinner-border-sm"></span><span> waiting...</span></div>
  const user = props.user.account
  const authorized = props.user.isAuthorized.authorized
  const isMarketAuthorized = props.user.isMarketAuthorized.authorized
  let marketButtonText = "Authorize", pancakeButtonText= "Authorize", headerTitle = "Authorize Your Account", pancakeAuthPic = "empty-checkbox", marketAuthPic = 'empty-checkbox', pancakeCTA = 'Authorize use of liquidity',marketCTA = 'Authorize use of NFMT', pancakeStatus = "Required", marketStatus = 'Required', pancakeButton = async () => { marketButtonText = loader; await props.user.methods.getPswapAuthorized(); marketButtonText='Authorize'}, marketButton = async () => { marketButtonText = loader; await props.user.methods.getMarketAuthorized(); marketButtonText='Authorize'}, pancakeButtonClasses = "btn blink_me btn-warning", marketButtonClasses = "btn blink_me btn-warning"
  if (authorized) {pancakeStatus = 'Authorized'; pancakeAuthPic = 'checked-checkbox'; pancakeCTA = <><p>Balance: </p><span style={{color: 'lawngreen' , fontSize: "2em"}}>{props.user.cakeLpBalance}</span></>; pancakeButtonClasses = 'btn btn-success'; pancakeButton = () => {window.open('https://exchange.pancakeswap.finance/#/add/BNB/0x46c3d9853eF62a68bDecCc110C37c6b207ab733d', '_blank', 'noopener,noreferrer')}; pancakeButtonText="Add More"}
  if (isMarketAuthorized) {marketStatus = 'Authorized'; marketAuthPic = 'checked-checkbox'; marketCTA = <><p>Balance: </p><span style={{color: 'lawngreen', fontSize: "2em"}}>{props.user.nfmtBalance}</span></>; marketButtonClasses = 'btn btn-success'; marketButton = () => {window.open('https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x46c3d9853eF62a68bDecCc110C37c6b207ab733d', '_blank', 'noopener,noreferrer')}; marketButtonText="Add More"}
  if (authorized && isMarketAuthorized) {headerTitle = 'Account Authorized'}
  if (user) {
    return (
      <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6" style={{display: "flex" }}>
        <div className="card" style={{width: '100%'}}>
          <div
            className="card-header"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div>
              <h4 className="card-title">{headerTitle}</h4>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', justifyContent: 'space-around'}}>
            <div style={{ display: "flex", flexDirection: "column", width: '100%', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}><img src={require(`../../images/pancakeswap.png`)} width="35" alt="" style={{alignSelf: 'center'}} /></div>
            <div><h5>{pancakeStatus}</h5></div>
            <div style={{ display: 'flex',  width: '100%', justifyContent: 'center'}}>
                  <div style={{display: 'flex'}}>Cake-LP: <img src={require(`../../images/${pancakeAuthPic}.svg`)} width="25" alt="" style={{marginLeft: '.5em'}}/></div>
                </div>
              
              <div><p style={{fontSize: '12px', lineHeight: '15px', textAlign: 'center', margin: '.5em'}}>{pancakeCTA}</p></div>
              <div className={pancakeButtonClasses} style={{alignSelf: 'center'}} onClick={pancakeButton}>  
            {pancakeButtonText}
           </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column",  width: '100%', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}><img src={require(`../../images/market.svg`)} width="35" alt="" style={{alignSelf: 'center'}} /></div>
              <div><h5>{marketStatus}</h5></div>
                <div style={{ display: 'flex',  width: '100%', justifyContent: 'center'}}>
                  <div style={{display: 'flex'}}>NFMT: <img src={require(`../../images/${marketAuthPic}.svg`)} width="25" alt="" style={{marginLeft: '.5em'}}/></div>
                </div>
              
              <div><p style={{fontSize: '12px', lineHeight: '15px', textAlign: 'center', margin: '.5em'}}>{marketCTA}</p></div>
              <div className={marketButtonClasses} style={{alignSelf: 'center'}} onClick={marketButton}>
            {marketButtonText}
           </div>
            </div>
          </div>
          
      </div>
        </div>
       
    );
  } else {
    return null;
  }
}
