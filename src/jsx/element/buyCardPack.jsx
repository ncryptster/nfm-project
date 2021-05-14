import React from 'react'

export default function BuyCardPack(props) {
    const account = props.user.account
    const authorized = (props.user.isAuthorized.authorized)
    let buttonSettings = { disabled: true}

    if (authorized) {
      buttonSettings.disabled = false
    }
    if (account) {
        return (
            <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                    <div className="card align-items-center">
                      <div className="card-header">
                        <h4 className="card-title">Buy 10 Random Card Pack</h4>
                      </div>
                      <div className="card-body your-position2" style={{dislay: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                        <div className="row">
                          <img
                            src={require("../../images/mysterypack.svg")}
                            alt=""
                            width="108"
                          />
                        </div>
                      </div>
                      <div> Cost: <span style={{color: 'lightcyan'}}>4 LP</span></div>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          props.user.methods.getRandomCardPack();
                        }}
                        className="card-footer"
                      >
                        <button className="button btn btn-primary" type="submit" {...buttonSettings}>
                          Buy Now
                        </button>
                      </form>
                    </div>
                  </div>
        )
    } else {
        return null
    }
    
}
