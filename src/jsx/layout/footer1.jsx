import React, { } from 'react';
import { Link } from 'react-router-dom';



function Footer1() {
    return (
        <>
            <div className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="copyright">
                                <p>© Copyright 2021 <Link to={'#'}>NonFungibleMeme</Link> All Rights Reserved</p>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="footer-social">
                                <ul>
                                    <li><a href={'https://t.me/joinchat/GbsJTTX4O4YxZDlh'}><i className="fa fa-telegram"></i></a></li>
                                    <li><a href={'https://twitter.com/NFMplatform'}><i className="fa fa-twitter"></i></a></li>
                                    <li><a href={'https://www.reddit.com/r/NonFungibleMemes/new/'}><i className="fa fa-reddit"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer1;