import React, {  } from 'react';
import { Link } from 'react-router-dom';


// states of the header







function Header2(props) {
    const account = props.account
    // eslint-disable-next-line
    if (account && props.isPswapAuthorized && props.loaded == false) {
    
        return (
            <>
                <div className="header dashboard">
                
                    <div className="container-fluid h-100">
                        <div className="row">
                            <div className="col-xl-12">
                                <nav className="navbar navbar-expand-lg navbar-light px-0 justify-content-between h-100">
                                    <Link className="navbar-brand" to={"./"}><img src={require('./../../images/logo.png')} alt="" width="50"/></Link>
    
                                    <div className="header-right d-flex my-2" >
                                        <span className="align-self-center" style={{marginRight: '10px'}}>Connection Status:</span>
                                        <div className="btn btn-primary align-self-center" style={{marginRight: '10px', width: '150px'}}><span className="spinner-border spinner-border-sm align-self-center" role="status" aria-hidden="true" style={{marginRight: '5px'}}></span>Synchronizing</div>
                                        <span className="align-self-center" style={{marginRight: '10px'}} >Welcome User:</span>
                                        <img src={`https://avatars.dicebear.com/api/bottts/${account}.svg`} alt="" width="50" style={{marginRight: '10px'}}/>
                                        <span className="align-self-center" style={{marginRight: '10px'}}>Authorized Status:</span>
                                        <div className="btn btn-success align-self-center" style={{marginRight: '10px', width: '150px'}}>Authorized</div> 
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } 
    // eslint-disable-next-line
    else if (account && props.isPswapAuthorized && props.loaded == true ) 
    
    {
    
        return (
            <>
                <div className="header dashboard">
                
                    <div className="container-fluid h-100">
                        <div className="row">
                            <div className="col-xl-12">
                                <nav className="navbar navbar-expand-lg navbar-light px-0 justify-content-between h-100">
                                    <Link className="navbar-brand" to={"./"}><img src={require('./../../images/logo.png')} alt="" width="50"/></Link>
    
                                    <div className="header-right d-flex my-2" >
                                        <span className="align-self-center" style={{marginRight: '10px'}}>Connection Status:</span>
                                        <div className="btn btn-success align-self-center" style={{marginRight: '10px', width: '150px'}}>Connected</div>
                                        <span className="align-self-center" style={{marginRight: '10px'}} >Welcome User:</span>
                                        <img src={`https://avatars.dicebear.com/api/bottts/${account}.svg`} alt="" width="50" style={{marginRight: '10px'}}/>
                                        <span className="align-self-center" style={{marginRight: '10px'}}>Authorized Status:</span>
                                        <div className="btn btn-success align-self-center" style={{marginRight: '10px', width: '150px'}}>Authorized</div> 
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } 
    
    else if (account && !props.isPswapAuthorized) 
    
    {
    
        return (
            <>
                <div className="header dashboard">
                
                    <div className="container-fluid h-100">
                        <div className="row">
                            <div className="col-xl-12">
                                <nav className="navbar navbar-expand-lg navbar-light px-0 justify-content-between h-100">
                                    <Link className="navbar-brand" to={"./"}><img src={require('./../../images/logo.png')} alt="" width="50"/></Link>
    
                                    <div className="header-right d-flex my-2" >
                                        <span className="align-self-center" style={{marginRight: '10px'}}>Connection Status:</span>
                                        <div className="btn btn-warning align-self-center" style={{marginRight: '10px', width: '150px'}}>Not Connected</div>
                                        <span className="align-self-center" style={{marginRight: '10px'}} >Welcome User:</span>
                                        <img src={`https://avatars.dicebear.com/api/bottts/${account}.svg`} alt="" width="50" style={{marginRight: '10px'}}/>
                                        <span className="align-self-center" style={{marginRight: '10px'}}>Authorized Status:</span>
                                        <div className="btn btn-warning align-self-center" style={{marginRight: '10px', width: '150px'}}>Not Authorized</div> 
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } 
    
    else
    
    {
     return (
        <>
            <div className="header dashboard">
                
                <div className="container-fluid h-100">
                    <div className="row">
                        <div className="col-xl-12">
                            <nav className="navbar navbar-expand-lg navbar-light px-0 justify-content-between h-100">
                                <Link className="navbar-brand" to={"./"}><img src={require('./../../images/logo.png')} alt="" width="50"/></Link>

                                <div className="header-right d-flex my-2" >
                                        <span className="align-self-center" style={{marginRight: '10px'}}>Connection Status:</span>
                                        <div className="btn btn-danger align-self-center" style={{marginRight: '10px', width: '150px'}}>Not Connected</div>
                                        <span className="align-self-center" style={{marginRight: '10px'}} >Welcome User:</span>
                                        <img src={require('./../../images/blank-profile.png')} alt="" width="35" style={{marginRight: '10px'}}/>
                                        <span className="align-self-center" style={{marginRight: '10px'}}>Authorized Status:</span>
                                        <div className="btn btn-danger align-self-center" style={{marginRight: '10px', width: '150px'}}>Not Connected</div> 
                                    </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )   
    }
    
}

export default Header2;