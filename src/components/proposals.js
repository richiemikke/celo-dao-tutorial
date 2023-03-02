import React from "react";
import { Card, Badge, Col, Stack, Button, Row } from "react-bootstrap";

export const Proposals = (props) => {
  return (
    <Row xs={1} md={3} className="g-4">
      {props.proposals.map((proposal) => (
        <Col key={proposal.index}>
          <Card className="h-100">
            <Card.Header>
              <Stack direction="horizontal" gap={2}>
                <Badge bg="secondary" className="ms-auto">
                  {proposal.proposalId} ID
                </Badge>

                <Badge bg="secondary" className="ms-auto">
                  {proposal.yesVotes} yes Votes
                </Badge>

                <Badge bg="secondary" className="ms-auto">
                  {proposal.noVotes} no Votes
                </Badge>
              </Stack>
            </Card.Header>
            <Card.Body className="d-flex  flex-column text-center text-dark">
              <Card.Title>{proposal.description}</Card.Title>
              {props.walletAddress === proposal.proposer && (
                <Button
                  variant="primary mt-2"
                  onClick={() => props.executeProposal(proposal.proposalId)}
                >
                  Execute Proposal
                </Button>
              )}

              <form>
                <div class="form-r mt-2">
                  <button
                    type="button"
                    onClick={() => props.vote(proposal.proposalId, true)}
                    class="btn btn-dark mt-1"
                  >
                    Vote Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => props.vote(proposal.proposalId, false)}
                    class="btn btn-dark mt-1"
                  >
                    Vote No
                  </button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
