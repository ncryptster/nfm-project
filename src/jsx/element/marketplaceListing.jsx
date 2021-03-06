import React from 'react'

export default function MarketplaceListing(props, key) {
	let approved = props.user.isMarketAuthorized.authorized
	let buttonSettings = {disabled: true}
	if (approved) {buttonSettings = {disabled: false}}
	let status
	let imageSettings = { src: `https://avatars.dicebear.com/api/bottts/${props.obj.listing.seller.toLowerCase()}.svg` }
	if (props.user.dashboardCardData.dashboardCards.some((item) => {return item.card.cardNumber == props.obj.card.cardNumber})) {
		status = <div className='d-flex'>
			<span style={{color: 'silver',fontSize: "12px", lineHeight: "15px", paddingRight: '5px'}}><p>Status: </p></span><span style={{color: 'orange',fontSize: "12px", lineHeight: "15px",}}><p style={{float: 'right'}}>Owned</p></span>
		</div>
	} else {
		status = <div className='d-flex'>
			<span style={{color: 'silver',fontSize: "12px", lineHeight: "15px", paddingRight: '5px'}}><p>Status: </p></span><span style={{color: 'lightseagreen',fontSize: "12px", lineHeight: "15px",}}><p style={{float: 'right'}}>Need</p></span>
		</div>
	}
	return (
		<div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6" key={key}>
				<div className="card align-items-center">
						<div className="card-header">
								<h4 className="card-title">Listing of Token #: {props.obj.tokenId}</h4>
						</div>
						<div className="card-body your-position2">
								<div className="row" style={{display: 'flex', gap: '2em'}}>
									<div className="col" style={{display: 'flex', flex: "1 1 0"}}>
										<img
												src={require(`../../images/cards/${props.obj.card.fileName}`)}
												alt=""
												width="70"
										/></div>
									<div className="col" style={{flex: "2 1 0", display: 'flex', flexDirection: 'column', alignContent: 'space-between'}}>
										<div className="row">
										<span style={{color: 'silver',fontSize: "12px", lineHeight: "15px", paddingRight: '5px'}}><p>Card #: </p></span><span style={{color: 'orange',fontSize: "12px", lineHeight: "15px",}}><p style={{float: 'right'}}> {props.obj.card.cardNumber}</p></span>
										</div>
										<div className="row">
										<p style={{color: 'silver',fontSize: "12px", lineHeight: "15px",}} >Owner: <img {...imageSettings} alt="" width="25" style={{ marginRight: '10px' }} /></p>
										</div>
										<div className="row">
										<span style={{color: 'silver',fontSize: "12px", lineHeight: "15px", paddingRight: '5px'}}><p>Price: </p></span><span style={{color: 'orange',fontSize: "12px", lineHeight: "15px",}}><p> {props.obj.listing.price/ 1000000000000000000} NFT</p></span>
										</div>
										<div className="row">
										{status}
										</div>
									</div>
										
										
								</div>
						</div>
						<div className="card-footer">
						<button className="button btn btn-info" {...buttonSettings} onClick={ async (event) => {
									event.preventDefault();
									props.user.methods.buyAMeme(props.obj.tokenId)
									}}>
										Buy Token
								</button>
						</div>
				</div>
		</div>
)
}
