import React from 'react'
import { Form, Button, Col, Card } from 'react-bootstrap'

export default function SellForm(props) {
	return (
    <Form>
      <Form.Row>
        {props.cards.map((token, key) => (
          <Col key={key} style={{ display: "flex", justifyContent: "center" }}>
            <Card
              className="text-center"
              style={{ width: "15rem", borderRadius: "5%" }}
            >
              
              <Card.Body>
                <div className="row">
                  <div className="col">
                    <div className="row d-flex align-items-center">
										<p className="p-2">Token Id: {token.tokenId}</p>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row d-flex flex-row-reverse align-items-center">
                     
                    </div>
                  </div>
                </div>
                <img
                  src={require(`../../images/cards/${token.card.fileName}`)}
                  alt=""
                  width="175"
                  style={{
                    borderRadius: "5%",
                    boxShadow:
                      "0 6px 16px 0 rgba(0, 0, 0, 0.4), 0 12px 40px 0 rgba(0, 0, 0, 0.30)",
                  }}
                />
              </Card.Body>

              <Card.Footer className="text-muted">
                <Button
                  variant="secondary"
                  onClick={ async (e) => {
										e.preventDefault()
										
										if (await props.user.methods.tokenIsApproved(token.tokenId)) {props.handleClose(); props.openPricingModal(token.tokenId);} else {props.handleClose(); await props.user.methods.approveNFMForMarketplace(token.tokenId); props.openPricingModal(token.tokenId, props.user);}
                    
                  }}
                >
                  Approve
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Form.Row>
    </Form>
  );
}
