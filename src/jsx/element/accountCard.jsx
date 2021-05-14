import React from 'react'

export default function AccountCard(props) {
    const user = props.user.account
    if (user) {return (
        <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Your Account</h4>
                </div>
                <div className="card-body your-position">

                    <ul className="list-group">
                        <li
                            className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                            Total Cards:
                                                <span className="strong">{props.user.userTokens.length}</span>
                        </li>
                        <li
                            className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                            Collected:
                                                <span className="strong"> {props.user.dashboardCardData.dashboardCards.length}/60</span>
                        </li>
                        <li
                            className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                            <span>Unique: <img src={require('../../images/unique.svg')} alt="" width="20" /></span>
                            <span className="strong"> {props.user.dashboardCardData.dashboardUnique.length}</span>
                        </li>
                        <li
                            className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                            <span>Duplicate: <img src={require('../../images/duplicate.svg')} alt="" width="20" /></span>
                            <span className="strong">{(props.user.dashboardCardData.dashboardDuplicates.reduce(( totalOwned, index)=>{return index.quantity + totalOwned},0) - props.user.dashboardCardData.dashboardDuplicates.length)}</span>
                        </li>
                        <li
                            className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                            <span>Originals:<img src={require('../../images/original.svg')} alt="" width="25" /></span>
                            <span className="strong">{props.user.dashboardCardData.dashboardOriginals.length}</span>
                        </li>
                        <li
                            className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                            <span>For Sale: <img src={require('../../images/forsale.svg')} alt="" width="20" /></span>

                            <span className="strong">{props.user.marketplaceCardData.userCardsForSale.length}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )} else {
        return null
    }
    
}
