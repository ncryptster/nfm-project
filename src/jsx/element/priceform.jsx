import React, { useState }from 'react'
import {Card, Form, Button} from 'react-bootstrap'

export default function PriceForm(props) {
	const [price, setPrice] = useState(1);
	return (
	<Card className="text-center">
	<Card.Body>
		<Form
			onSubmit={ async (event) => {
				event.preventDefault()
				props.handleClose();
				await props.user.methods.listAMeme(props.tokenId, price)
				await props.user.methods.connectWeb3()
			}}
		>
			<Form.Row>
				<Form.Control
					name="price"
					type="number"
					min="1"
					placeholder="Price in NFMT"
					onChange={(event) => setPrice(event.target.value)}
				></Form.Control>
			</Form.Row>
			<Form.Row
				style={{
					display: "flex",
					justifyContent: "center",
					marginTop: "10px",
				}}
			>
				<Button type="submit">Sell Card</Button>
			</Form.Row>
		</Form>
	</Card.Body>
</Card>
)
}
