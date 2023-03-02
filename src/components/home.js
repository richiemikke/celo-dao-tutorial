import React, { useState } from "react";

import {
  Button,
  Modal,
  Form,
  FloatingLabel,
  Nav,
  Badge,
  Container,
  Navbar,
} from "react-bootstrap";

const Home = (props) => {
  const [description, setDescription] = useState("");

  const [newmemberAddress, setNewMemberAddress] = useState("");

  const [memberAddress, setMemberAddress] = useState("");

  const [votingpower, setVotingPower] = useState(0);

  const isFormFilled = () => description;
  const isNewMemberFormFilled = () => newmemberAddress;
  const isMemberFormFilled = () => memberAddress;

  // proposal modal functions
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // member modal functions
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);

  const handleNewMemberModalClose = () => setShowNewMemberModal(false);
  const handleNewMemberModalShow = () => setShowNewMemberModal(true);

  // remove member modal functions
  const [showMemberModal, setShowMemberModal] = useState(false);

  const handleMemberModalClose = () => setShowMemberModal(false);
  const handleMemberModalShow = () => setShowMemberModal(true);

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="#home">Celo Dao</Navbar.Brand>
          <Navbar.Toggle />
          <Nav className="me-auto">
            <Badge bg="secondary" className="ms-auto">
              Balance {props.cUSDBalance}cUSD
            </Badge>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Button onClick={handleShow} variant="dark">
              <h5> Create Proposal </h5>
            </Button>

            <Button onClick={handleNewMemberModalShow} variant="dark">
              <h5> Add New Member </h5>
            </Button>

            <Button onClick={handleMemberModalShow} variant="dark">
              <h5> Remove Member </h5>
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Proposal</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              props.addProposal(description);
              handleClose();
            }}
          >
            Add Proposal
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showNewMemberModal}
        onHide={handleNewMemberModalClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>New Memnber</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputAddress"
              label="MemberAddress"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setNewMemberAddress(e.target.value);
                }}
                placeholder="Address"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputVotingPower"
              label="Voting Power"
              className="mb-3"
            >
              <Form.Control
                type="number"
                onChange={(e) => {
                  setVotingPower(e.target.value);
                }}
                placeholder="Select Voting Power"
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleNewMemberModalClose}
          >
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isNewMemberFormFilled()}
            onClick={() => {
              props.addMember(newmemberAddress, votingpower);
              handleNewMemberModalClose();
            }}
          >
            Add New Member
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMemberModal} onHide={handleMemberModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Memnber</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputAddress"
              label="MemberAddress"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setMemberAddress(e.target.value);
                }}
                placeholder="Address"
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleMemberModalClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isMemberFormFilled()}
            onClick={() => {
              props.removeMember(memberAddress);
              handleMemberModalClose();
            }}
          >
            Remove Member
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
