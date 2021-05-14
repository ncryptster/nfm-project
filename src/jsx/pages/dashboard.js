import React from "react";
import Header2 from "../layout/header2";
import Sidebar from "../layout/sidebar";
import AccountCard from "../element/accountCard";
import AuthorizeCard from "../element/authorizeCard";
import BuyCard from "../element/buyCard";
import BuyCardPack from "../element/buyCardPack";
import TradeCard from "../element/tradeCard";
import MarketplaceCard from "../element/marketplaceCard";
import Collection from "../element/collection";

function Dashboard(props) {
  
  return (
    <>
      <div>    
      <Header2 {...props} user={props.user} />
      <Sidebar />
      <div className="content-body " id="dashboard">
        <div className="container-fluid ">
          <div className="row" style={{ marginTop: "50px" }}>
            <AccountCard {...props} user={props.user} />
            <AuthorizeCard {...props} user={props.user} />
            <BuyCard {...props} user={props.user} />
            <BuyCardPack {...props} user={props.user} />
            <MarketplaceCard {...props} user={props.user} />
            <TradeCard {...props} user={props.user} />
          </div>
          <div className="row">
            <Collection {...props} user={props.user} />
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Dashboard;