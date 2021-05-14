import React from "react";
import { Modal, Button } from "react-bootstrap"

export default function TheModal(props) {
  return (
    <div>
      <Modal
        show={props.show}
				centered
				dialogClassName="modal-dark"
        size="xl"
      >
        <Modal.Header style={{ display: "flex", justifyContent: "center" }}>
          <Modal.Title >{props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {props.body}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => props.onClick()}
          >
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
    </div>
  );
}
