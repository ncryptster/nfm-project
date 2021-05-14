import React, { useState } from 'react';
import { Link } from 'react-router-dom';


// states of the header







function Header2(props) {
    const [interfaceStatus, setinterfaceStatus] = useState('Not Connected');
    const loader = <div><span className="spinner-border spinner-border-sm"></span><span> Connecting...</span></div>
    const account = props.user.account
    const authorized = (props.user.isAuthorized.authorized && props.user.isMarketAuthorized.authorized)
    let interfaceMessage,userMessage,imageSettings,authorizedMessage, authorizedStatus, authorizeButton
    let interfaceButtonClasses = []
    let authorizedButtonClasses = []
    if (account && authorized) {
        interfaceMessage= "Interface Status:"
        userMessage = "Welcome User:"
        imageSettings = { src: `https://avatars.dicebear.com/api/bottts/${account}.svg` }
        authorizedMessage = "Authorized Status:"
        authorizedStatus = "Authorized" 
        interfaceButtonClasses = ["btn btn-success align-self-center"]
        authorizedButtonClasses = ["btn btn-success align-self-center"]
        authorizeButton = <div className={authorizedButtonClasses.join(" ")} style={{marginRight: '10px', width: '150px'}}>{authorizedStatus}</div>
    } else if (account && !authorized) {
        interfaceMessage= "Interface Status"
        userMessage = "Welcome User:"
        imageSettings = { src: `https://avatars.dicebear.com/api/bottts/${account}.svg` }
        authorizedMessage = "Authorized Status"
        authorizedStatus = "Not Authorized" 
        interfaceButtonClasses = ["btn btn-danger align-self-center"]
        authorizedButtonClasses = ["btn btn-warning align-self-center"]
        authorizeButton = <div className={authorizedButtonClasses.join(" ")} style={{marginRight: '10px', width: '150px'}}>{authorizedStatus}</div>
    } else {
        interfaceMessage= "Interface Status"
        userMessage = "No User Found:"
        imageSettings = {src: require("./../../images/blank-profile.png")}
        authorizedMessage = "Authorized Status"
        authorizedStatus = "Connect"
        interfaceButtonClasses = ["btn btn-danger align-self-center"]
        authorizedButtonClasses = ["btn btn-info blink_me align-self-center"]
        authorizeButton = <div className={authorizedButtonClasses.join(" ")} onClick={async (event) => {event.preventDefault(); setinterfaceStatus(loader); await props.user.methods.connectWeb3(); setinterfaceStatus("Connected")} } style={{marginRight: '10px', width: '150px'}}>{authorizedStatus}</div>
        }
        
        return (
            <>
                <div className="header dashboard">

                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-12">
                                <nav className="navbar navbar-expand-lg navbar-light px-0 justify-content-between h-100">
                                    <Link className="navbar-brand" to={"./"}><img src={require('./../../images/logo.png')} alt="" width="75" /></Link>

                                    <div className="header-right d-flex my-2" >
                                        <span className="align-self-center" style={{ marginRight: '10px' }}>{interfaceMessage}</span>
                                        <div className={interfaceButtonClasses.join(" ")} style={{ marginRight: '10px', width: '150px' }}>{interfaceStatus}</div>
                                        <span className="align-self-center" style={{ marginRight: '10px' }} >{userMessage}</span>
                                        <img {...imageSettings} alt="" width="50" style={{ marginRight: '10px' }} />
                                        <span className="align-self-center" style={{ marginRight: '10px' }}>{authorizedMessage}</span>
                                        {authorizeButton}
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    
    
}

export default Header2;

