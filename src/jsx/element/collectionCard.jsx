import React from 'react'
import { Link } from 'react-router-dom'

export default function CollectionCard(props) {
    const account = props.user.account
    if (account) {
        return (
            <div className="col-xl-2 col-lg-6 col-md-6 col-xxl-6">
                  <div className="card align-items-center">
                    <div className="card-header">
                      <h4 className="card-title">Dashboard</h4>
                    </div>
                    <div className="card-body your-position2">
                      <div className="row">
                        <img
                          src={require("../../images/collection.svg")}
                          alt=""
                          width="131"
                        />
                      </div>
                    </div>
                    <Link className="card-footer" to={"./Dashboard"}>
                      <button className="button btn btn-primary">Dashboard</button>
                    </Link>
                  </div>
                </div>
        )
    } else {
        return null
    }
}
