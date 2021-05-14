import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CardExplorer(props) {
    const currentlyDiscovered = props.user.fullSet  
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }
    return (
        <>
        <Slider {...settings} >
        
            {currentlyDiscovered.map((i, key) => ( 
                
                    <div key={key}>
                    <div className="row align-items-center" >
                        <div className="col-xl-6 col-lg-6">
                            <div className="customer-img">
                                {/* This will be the card picture side */}
                                <img className="img-fluid" src={require('../../images/cards/'+ i.card.fileName)} alt="" width="400" />
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6">
                            <div className="card-info">
                                <h4>Card Name: {i.card.cardName}</h4>
                                <hr />
                                <h4>Card Set Number: {i.card.cardNumber} / 60</h4>
                                <hr />
                                <h4>Card Rarity: {i.card.cardRarity}</h4>
                                <hr />
                                <h4>Card Text: "{i.card.cardText}"</h4>
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>
    
                 ))}
            
        
        </Slider>
        </>
    )
}



export default CardExplorer
