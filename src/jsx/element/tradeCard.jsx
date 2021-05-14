import React from "react";

export default function TradeCard(props) {
    const account = props.user.account;
    if (account) {
        return (
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
        );
    } else {
        return null;
    }
}
