import React, { useState, useEffect } from "react";
import SellForm from "./sellForm";
import TheModal from "./theModal";
import PriceForm from "./priceform";

export default function Collection(props) {
  const [display, setDisplay] = useState(props.user.dashboardCardData.dashboardCards);
  const [modal, setModal] = useState({ show: false, title: "", body: "", footer: "", });
  const getAllVersions = (cardNumber) => { const duplicateCards = props.user.userTokens.filter((token) => { return token.card.cardNumber == cardNumber; }); return duplicateCards; };
  const openSellModal = (obj) => { const cards = getAllVersions(obj.card.cardNumber); setModal({ show: true, title: "Please Approve A Card For Sale", body: ( <SellForm {...props} cards={cards} user={props.user} handleClose={handleClose} openPricingModal={openPricingModal} /> ), }); };
  const openPricingModal = (tokenId) => { setModal({ show: true, title: "At what price (NFT) do you want to sell it for?", body: ( <PriceForm {...props} user={props.user} tokenId={tokenId} handleClose={handleClose} /> ), }); };
  const handleClose = () => { setModal({ show: false }); }; 
  const template = (decorator, number, key) => { return ( <div className="p-2" key={key}> <img src={require(`../../images/${decorator}.svg`)} alt="" width="15" /> <span className={"badge badge-pill"} style={{ color: "slateBlue" }}> {number} </span> </div> ); };
  const setDecorators = (obj) => { const result = []; if (obj.quantity > 1) { result.push(template("duplicate", obj.quantity - 1)); } if (obj.isUnique) { result.push(template("unique")); } if (obj.isOriginal) { result.push(template("original")); } if (obj.isNew) { result.push(template("new")); } return result.map((decorators, key) => { return <div key={key}>{decorators}</div>; }); };
  useEffect(() => { setDisplay(props.user.dashboardCardData.dashboardCards); }, [props.user.dashboardCardData.dashboardCards]);
  const account = props.user.account;
  const approved = (props.user.isAuthorized.authorized && props.user.isMarketAuthorized.authorized)
  if (account) {
    return (
      <>
        <TheModal
          show={modal.show}
          title={modal.title}
          body={modal.body}
          data={modal.data}
          onClick={handleClose}
          onHide={handleClose}
        />
        <div className="col-12 d-flex justify-content-center">
          <div className="row d-flex justify-content-between">
            <div className="col">
              <div
                className="btn btn-secondary align-self-center border-primary"
                style={{ width: "200px" }}
                onClick={() => {
                  setDisplay(props.user.dashboardCardData.dashboardNew);
                }}
              >
                New
              </div>
            </div>
            <div className="col">
              <div
                className="btn btn-secondary align-self-center border-primary"
                style={{ width: "200px" }}
                onClick={() => {
                  setDisplay(props.user.dashboardCardData.dashboardUnique);
                }}
              >
                Unique
              </div>
            </div>
            <div className="col">
              <div
                className="btn btn-primary align-self-center border-secondary"
                style={{ width: "200px" }}
                onClick={() => {
                  setDisplay(props.user.dashboardCardData.dashboardCards);
                }}
              >
                Collected
              </div>
            </div>
            <div className="col">
              <div
                className="btn btn-secondary align-self-center border-primary"
                style={{ width: "200px" }}
                onClick={() => {
                  setDisplay(props.user.dashboardCardData.dashboardOriginals);
                }}
              >
                Original
              </div>
            </div>
            <div className="col">
              <div
                className="btn btn-secondary align-self-center border-primary"
                style={{ width: "200px" }}
                onClick={() => {
                  setDisplay(props.user.dashboardCardData.dashboardDuplicates);
                }}
              >
                Duplicates
              </div>
            </div>
          </div>
        </div>

        <div
          className="row"
          style={{ marginTop: "20px", marginLeft: "2px", marginRight: "2px", width: '100%'}}
        >
          {display.map((obj, key) => (
            <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6" key={key}>
              <div className="card">
                <div
                  className="card-header"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div className="row" style={{ width: "100%" }}>
                    <div className="col">
                      <div className="row d-flex align-items-center">
                        <div className="p-2" style={{ fontSize: "1.50vh" }}>
                          Card: {obj.card.cardNumber}/60
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="row d-flex flex-row-reverse align-items-center">
                        {setDecorators(obj)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body your-position2">
                  <div
                    className="row"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <img
                      src={require("../../images/cards/" + obj.card.fileName)}
                      alt=""
                      width="150"
                      style={{
                        borderRadius: "5%",
                        boxShadow:
                          "0 6px 16px 0 rgba(0, 0, 0, 0.4), 0 12px 40px 0 rgba(0, 0, 0, 0.30)",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="card-footer"
                  id="saleTrade"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <button
                    className="button btn btn-primary"
                    onClick={() => {
                      openSellModal(obj);
                    }}
                  >
                    Sell Card
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    return null;
  }
}
