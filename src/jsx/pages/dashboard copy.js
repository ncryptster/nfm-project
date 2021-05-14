import React from "react";
import Header2 from "../layout/header2";
import Sidebar from "../layout/sidebar";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

function Dashboard(props) {
  const account = props.account;
  let myCards;
  myCards = getUniqueListBy(props.userCards, "cardNumber");
  myCards.sort(function (a, b) {
    return a.cardNumber - b.cardNumber;
  });
  // rearange cards to put anything with a New tag to the front of the array
  for (let i = 0; i < myCards.length; i++) {
    const element = myCards[i];

    const cardBadges = element.badges;
    if (element.badges.length > 0) {
      // eslint-disable-next-line
      const hasNewBadge = cardBadges.some((item) => {
        return item.badge == "New";
      });
      if (hasNewBadge) {
        const indexOfNew = myCards.indexOf(element);
        myCards.unshift(myCards.splice(indexOfNew, 1)[0]);
      }
    }
  }
  //has duplicates
  for (let i = 0; i < myCards.length; i++) {
    const numberOfCopies = props.userCards.filter((item) => {
      // eslint-disable-next-line
      return item.cardNumber == myCards[i].cardNumber;
    });
    myCards[i].copiesOwned = numberOfCopies.length;
  }

  for (let i = 0; i < myCards.length; i++) {
    const element = myCards[i];
    if (element.copiesOwned > 1) {
      const cardBadges = myCards[i].badges;
      // eslint-disable-next-line
      if (cardBadges.length == 0) {
        myCards[i].badges.push({
          badge: "Duplicates",
          quantity: element.copiesOwned - 1,
          color: "danger",
        });
      }
      // eslint-disable-next-line
      const hasDupesBadge = cardBadges.some((item) => {
        return item.badge == "Duplicates";
      });
      if (hasDupesBadge) {
        // eslint-disable-next-line
        const dupesBadge = cardBadges.find((item) => {
          return item.badge == "Duplicates";
        });
        const dupesBadgeIndex = cardBadges
          .map(function (e) {
            return e.badge;
          })
          .indexOf("Duplicates");
        const numberOfDupes = dupesBadge.quantity;
        if (numberOfDupes < element.copiesOwned) {
          myCards[i].badges[dupesBadgeIndex].quantity = element.copiesOwned - 1;
        }
      } else if (!hasDupesBadge) {
        myCards[i].badges.push({
          badge: "Duplicates",
          quantity: element.copiesOwned - 1,
          color: "danger",
        });
      }
    }
  }
  const duplicates = myCards
    .filter((item) => {
      return item.copiesOwned > 1;
    })
    .reduce((copies, item) => {
      return item.copiesOwned + copies - 1;
    }, 0);

  //If Account is loaded and isAuthorized but is awaiting card Data
  // eslint-disable-next-line
  if (
    account &&
    props.isPswapAuthorized &&
    props.userCards.length == 0 &&
    props.userDataLoaded == false
  ) {
    return (
      <>
        <Header2
          {...props}
          account={props.account}
          allLoaded={props.allLoaded}
          allDataLoaded={props.allDataLoaded}
        />
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
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Total Cards:
                        <span className="strong">{props.userCards.length}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Collected:
                        <span className="strong"> {myCards.length}/60</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Unique:{" "}
                          <img
                            src={require("../../images/unique.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        {/* <span className="strong"> {unique}</span> */}
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Duplicate:{" "}
                          <img
                            src={require("../../images/duplicate.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        <span className="strong">{duplicates}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Originals:
                          <img
                            src={require("../../images/original.svg")}
                            alt=""
                            width="25"
                          />
                        </span>
                        <span className="strong">0</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          For Sale:{" "}
                          <img
                            src={require("../../images/forsale.svg")}
                            alt=""
                            width="20"
                          />
                        </span>

                        <span className="strong">0</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Authorize Account</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/pancakeswap.png")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getPswapAuthorized();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Authorize
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 1 Card</h4>
                  </div>
                  <div className="card-body your-position2">
                    <img
                      src={require("../../images/card.png")}
                      alt=""
                      width="97"
                    />
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getRandomCard();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 10 Card Bundle</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/cards.png")}
                        alt=""
                        width="90"
                      />
                    </div>
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getRandomCardPack();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
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
                    <button className="button btn btn-primary">
                      Marketplace
                    </button>
                  </Link>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Trade Cards</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/trade.svg")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="button btn btn-primary" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
    // eslint-disable-next-line
  } else if (
    account &&
    props.isPswapAuthorized &&
    props.userCards.length != 0 &&
    props.userDataLoaded == false
  ) {
    return (
      <>
        <Header2
          {...props}
          account={props.account}
          allLoaded={props.allLoaded}
          allDataLoaded={props.allDataLoaded}
        />
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
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Total Cards:
                        <span className="strong">{props.userCards.length}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Collected:
                        <span className="strong"> {myCards.length}/60</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Unique:{" "}
                          <img
                            src={require("../../images/unique.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        {/* <span className="strong"> {unique}</span> */}
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Duplicate:{" "}
                          <img
                            src={require("../../images/duplicate.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        <span className="strong">{duplicates}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Originals:
                          <img
                            src={require("../../images/original.svg")}
                            alt=""
                            width="25"
                          />
                        </span>
                        <span className="strong">0</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          For Sale:{" "}
                          <img
                            src={require("../../images/forsale.svg")}
                            alt=""
                            width="20"
                          />
                        </span>

                        <span className="strong">0</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Fund Liquidity</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/pancakeswap.png")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      window.open(
                        "https://exchange.pancakeswap.finance/#/add/BNB/0x46c3d9853eF62a68bDecCc110C37c6b207ab733d",
                        "_blank"
                      );
                    }}
                    className="card-footer"
                  >
                    <button className="button btn btn-success" type="submit">
                      Add Liquidity
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 1 Card</h4>
                  </div>
                  <div className="card-body your-position2">
                    <img
                      src={require("../../images/card.png")}
                      alt=""
                      width="97"
                    />
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getRandomCard();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 10 Card Bundle</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/cards.png")}
                        alt=""
                        width="90"
                      />
                    </div>
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getRandomCardPack();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
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
                    <button className="button btn btn-primary">
                      Marketplace
                    </button>
                  </Link>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Trade Cards</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/trade.svg")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="button btn btn-primary" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-xxl-12 ">
                <div
                  className="card align-items-center border border-primary"
                  width=""
                >
                  <div className="card-body your-position2 ">
                    <div
                      className="btn btn-warning align-self-center"
                      style={{ width: "200px" }}
                    >
                      <span
                        className="spinner-grow spinner-grow-sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: "5px" }}
                      ></span>
                      Collection: {props.userLoader}
                    </div>
                    <div className="row"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {myCards.map((card, key) => (
                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6" key={key}>
                  <div className="card align-items-center">
                    <div className="card-header">
                      <div className="row">
                        <div className="col">#{card.cardNumber}</div>
                        {card.badges.map((i, key) => (
                          <div className="col" key={key}>
                            <span
                              className={`badge badge-pill badge-${i.color}`}
                              style={{ paddingLeft: "-2px" }}
                            >
                              {i.badge}
                              <span
                                className="badge badge-pill badge-dark"
                                style={{ marginLeft: "2px" }}
                              >
                                {i.quantity}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card-body your-position2">
                      <div className="row">
                        <img
                          src={require("../../images/cards/" + card.fileName)}
                          alt=""
                          width="200"
                        />
                      </div>
                    </div>
                    <div className="card-footer" id="saleTrade">
                      <button className="button btn btn-primary" disabled>
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } else if (
    account &&
    props.isPswapAuthorized &&
    props.userCards.length != 0 &&
    props.userDataLoaded == true
  ) {
    return (
      <>
        <Header2
          {...props}
          account={props.account}
          allDataLoaded={props.allDataLoaded}
        />
        <Sidebar />
        <Modal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          size={props.modalBody.size}
          show={props.showApproveModal}
          dialogClassName="modal-dark"
          onHide={props.closeApproveModal}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "blue", fontWeight: "500" }}>
              Approve this card for sale
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
            {props.modalBody.render}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={props.closeApproveModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          size={props.modalBody.size}
          show={props.showPriceModal}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-dark"
        >
          <Modal.Header>
            <h5 style={{ color: "blue", fontWeight: "500" }}>
              How much will you sell it for?
            </h5>
            </Modal.Header>
            <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
            {props.modalBody.render}
          </Modal.Body>
        </Modal>
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
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Total Cards:
                        <span className="strong">{props.userCards.length}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Collected:
                        <span className="strong"> {myCards.length}/60</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Unique:{" "}
                          <img
                            src={require("../../images/unique.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        {/* <span className="strong"> {unique}</span> */}
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Duplicate:{" "}
                          <img
                            src={require("../../images/duplicate.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        <span className="strong">{duplicates}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Originals:
                          <img
                            src={require("../../images/original.svg")}
                            alt=""
                            width="25"
                          />
                        </span>
                        <span className="strong">0</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          For Sale:{" "}
                          <img
                            src={require("../../images/forsale.svg")}
                            alt=""
                            width="20"
                          />
                        </span>

                        <span className="strong">0</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Fund Liquidity</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/pancakeswap.png")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      window.open(
                        "https://exchange.pancakeswap.finance/#/add/BNB/0x46c3d9853eF62a68bDecCc110C37c6b207ab733d",
                        "_blank"
                      );
                    }}
                    className="card-footer"
                  >
                    <button className="button btn btn-success" type="submit">
                      Add Liquidity
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 1 Card</h4>
                  </div>
                  <div className="card-body your-position2">
                    <img
                      src={require("../../images/card.png")}
                      alt=""
                      width="97"
                    />
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getRandomCard();
                    }}
                    className="card-footer"
                  >
                    <button className="button btn btn-primary" type="submit">
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 10 Card Bundle</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/cards.png")}
                        alt=""
                        width="90"
                      />
                    </div>
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getRandomCardPack();
                    }}
                    className="card-footer"
                  >
                    <button className="button btn btn-primary" type="submit">
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
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
                    <button className="button btn btn-primary">
                      Marketplace
                    </button>
                  </Link>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Trade Cards</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/trade.svg")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="button btn btn-primary" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-xxl-12 ">
                <div
                  className="card align-items-center border border-primary"
                  width=""
                >
                  <div className="card-body your-position2 ">
                    <div
                      className="btn btn-success align-self-center"
                      style={{ width: "200px" }}
                    >
                      <span
                        className=""
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: "5px" }}
                      ></span>
                      Collection
                    </div>
                    <div className="row"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {myCards.map((card, key) => (
                <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6" key={key}>
                  <div className="card align-items-center">
                    <div className="card-header">
                      <div className="row">
                        <div className="col">#{card.cardNumber}</div>
                        {card.badges.map((i, key) => (
                          <div className="col" key={key}>
                            <span className={`badge badge-pill badge-${i.color}`} style={{ paddingLeft: "-2px" }} >
                              {i.badge}
                              <span
                                className="badge badge-pill badge-dark"
                                style={{ marginLeft: "2px" }}
                              >
                                {i.quantity}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card-body your-position2">
                      <div className="row">
                        <img
                          src={require("../../images/cards/" + card.fileName)}
                          alt=""
                          width="200"
                        />
                      </div>
                    </div>
                    <div className="card-footer" id="saleTrade">
                      <button
                        className="button btn btn-primary"
                        onClick={async () => {
                          if (await props.tokenIsApproved(card.cardId)) {
                            props.priceCardBody(
                                card.cardId
                            )
                            props.openPriceModal()
                          } else {
                            props.approveCardBody(
                                props.userCards,
                                card,
                                "sell"
                              )
                              props.openApproveModal()  
                          }
                        }
                        
                    }
                      >
                        Sell Card
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
  // Account is loaded but customer is not authorized yet
  else if (account && !props.isPswapAuthorized) {
    return (
      <>
        <Header2
          {...props}
          account={props.account}
          allDataLoaded={props.allDataLoaded}
        />
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
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Total Cards:
                        <span className="strong">{props.userCards.length}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Collected:
                        <span className="strong"> {myCards.length}/60</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Unique:{" "}
                          <img
                            src={require("../../images/unique.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        {/* <span className="strong"> {unique}</span> */}
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Duplicate:{" "}
                          <img
                            src={require("../../images/duplicate.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        <span className="strong">{duplicates}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Originals:
                          <img
                            src={require("../../images/original.svg")}
                            alt=""
                            width="25"
                          />
                        </span>
                        <span className="strong">0</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          For Sale:{" "}
                          <img
                            src={require("../../images/forsale.svg")}
                            alt=""
                            width="20"
                          />
                        </span>

                        <span className="strong">0</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Authorize Account</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/pancakeswap.png")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getPswapAuthorized();
                    }}
                    className="card-footer"
                  >
                    <button className="button btn btn-primary" type="submit">
                      Authorize
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 1 Card</h4>
                  </div>
                  <div className="card-body your-position2">
                    <img
                      src={require("../../images/card.png")}
                      alt=""
                      width="97"
                    />
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getRandomCard();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 10 Card Bundle</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/cards.png")}
                        alt=""
                        width="90"
                      />
                    </div>
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.roll10();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
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
                    <button className="button btn btn-primary">
                      Marketplace
                    </button>
                  </Link>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Trade Cards</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/trade.svg")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="button btn btn-primary" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Header2
          {...props}
          account={props.account}
          allDataLoaded={props.allDataLoaded}
        />
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
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Total Cards:
                        <span className="strong">{props.userCards.length}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        Collected:
                        <span className="strong"> {myCards.length}/60</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Unique:{" "}
                          <img
                            src={require("../../images/unique.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        {/* <span className="strong"> {unique}</span> */}
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Duplicate:{" "}
                          <img
                            src={require("../../images/duplicate.svg")}
                            alt=""
                            width="20"
                          />
                        </span>
                        <span className="strong">{duplicates}</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          Originals:
                          <img
                            src={require("../../images/original.svg")}
                            alt=""
                            width="25"
                          />
                        </span>
                        <span className="strong">0</span>
                      </li>
                      <li className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                        <span>
                          For Sale:{" "}
                          <img
                            src={require("../../images/forsale.svg")}
                            alt=""
                            width="20"
                          />
                        </span>

                        <span className="strong">0</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Authorize Account</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/pancakeswap.png")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getPswapAuthorized();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Authorize
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 1 Card</h4>
                  </div>
                  <div className="card-body your-position2">
                    <img
                      src={require("../../images/card.png")}
                      alt=""
                      width="97"
                    />
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.getRandomCard();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Buy 10 Card Bundle</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/cards.png")}
                        alt=""
                        width="90"
                      />
                    </div>
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      props.roll10();
                    }}
                    className="card-footer"
                  >
                    <button
                      className="button btn btn-primary"
                      type="submit"
                      disabled
                    >
                      Buy Now
                    </button>
                  </form>
                </div>
              </div>
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
                    <button className="button btn btn-primary">
                      Marketplace
                    </button>
                  </Link>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                <div className="card align-items-center">
                  <div className="card-header">
                    <h4 className="card-title">Trade Cards</h4>
                  </div>
                  <div className="card-body your-position2">
                    <div className="row">
                      <img
                        src={require("../../images/trade.svg")}
                        alt=""
                        width="131"
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="button btn btn-primary" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export default Dashboard;
