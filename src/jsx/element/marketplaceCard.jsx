import React from "react";
import { Link } from "react-router-dom"


export default function MarketplaceCard(props) {
  const account = props.user.account;
  const authorized = (props.user.isAuthorized.authorized && props.user.isMarketAuthorized.authorized)
    
  if (account) {
    return (
      <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
        <div className="card align-items-center">
          <div className="card-header">
            <h4 className="card-title">Marketplace</h4>
          </div>
          <div className="card-body your-position2">
            <div className="row">
              <img
                src={require("../../images/market.svg")}
                alt=""
                width="131"
              />
            </div>
          </div>
          <Link className="card-footer" to={"./Marketplace"}>
            <button className="button btn btn-primary">Marketplace</button>
          </Link>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
