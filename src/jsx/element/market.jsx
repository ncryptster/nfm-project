import React, { useState , useEffect } from 'react'
import MarketplaceListing from "../element/marketplaceListing"
import UserListing from "../element/userListing"
import TheModal from "../element/theModal"
export default function Market(props) {
  const account = props.user.account
  const approved = (props.user.isAuthorized.authorized && props.user.isMarketAuthorized.authorized)
	const [display, setDisplay] = useState(props.user.marketplaceCardData.cardsForSale);
	useEffect(() => { setDisplay(props.user.marketplaceCardData.cardsForSale); }, [props.user.marketplaceCardData.cardsForSale]);
	if (display == props.user.marketplaceCardData.cardsForSale) {
    	if (account) {
				return (
          <>
          <div className="col-12 d-flex justify-content-center">
          <div className="row d-flex justify-content-between">
            
            <div className="col">
              <div
                className="btn btn-secondary align-self-center border-primary"
                style={{ width: "200px" }}
                onClick={() => {
                  setDisplay(props.user.marketplaceCardData.userCardsForSale);
                }}
              >
                My Listings
              </div>
            </div>
            <div className="col">
              <button
                className="btn btn-primary align-self-center border-secondary"
                style={{ width: "200px" }}
                disabled
              >
                Marketplace
              </button>
            </div>
            <div className="col">
              <div
                className="btn btn-secondary align-self-center border-primary"
                style={{ width: "200px" }}
                onClick={() => {
                  setDisplay(props.user.marketplaceCardData.cardsForSale);
                }}
              >
                Buy Cards
              </div>
            </div>
            
          </div>
        </div>
				<div className="col-12">
						<div
              className="row d-flex"
              style={{
                marginTop: "20px",
              }}
            >
              {display.map((obj, key) => (
                <MarketplaceListing
                  {...props}
                  user={props.user}
                  obj={obj}
                  key={key}
                />
              ))}

						</div>
				</div>
					
          </>
        );
			} else {
				return null
			}
	} else {
		if (account) {
		return (
			<>
				<div className="col-12 d-flex justify-content-center">
          <div className="row d-flex justify-content-between">
            
            <div className="col">
              <div
                className="btn btn-secondary align-self-center border-primary"
                style={{ width: "200px" }}
                onClick={() => {
                  setDisplay(props.user.marketplaceCardData.userCardsForSale);
                }}
              >
                My Listings
              </div>
            </div>
            <div className="col">
              <button
                className="btn btn-primary align-self-center border-secondary "
                style={{ width: "200px" }}
								disabled
              >
                Marketplace
              </button>
            </div>
            <div className="col">
              <div
                className="btn btn-secondary align-self-center border-primary"
                style={{ width: "200px" }}
                onClick={() => {
                  setDisplay(props.user.marketplaceCardData.cardsForSale);
                }}
              >
                Buy Cards
              </div>
            </div>
            
          </div>
        </div>
				<div className="col-12">
					<div className="row d-flex" style={{marginTop: "20px"}}>
						{display.map((obj, key) => (
							<UserListing {...props} user={props.user} obj={obj} key={key}/>
						))}
					</div>
				</div>
							
					
			</>
		)
	} else {
		return null
	}
	}
		
	
}
