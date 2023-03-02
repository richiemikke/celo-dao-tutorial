// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CELODAO {

    address owner;

    struct MemberInfo {
        address memberAddress;
        uint256 votingPower;
    }

    mapping (address => MemberInfo) public members;
    uint256 public memberCount;
    

    event NewMember(address indexed _address, uint256 _votingPower);
    event MemberRemoved(address indexed _address);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event ProposalVoted(uint256 indexed proposalId, address indexed voter, bool vote);

    struct Proposal {
        uint256 proposalId;
        address proposer;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        mapping (address => bool) votes;
        bool executed;
    }

    mapping (uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    constructor()  {
        owner = msg.sender;
    }

    function addMember(address _address, uint256 _votingPower) public {
        require(msg.sender == owner, "Only contract owner can add a new member.");
        require(members[_address].memberAddress == address(0), "The address is already a member.");
        require(_votingPower > 0, "The voting power must be positive.");
        memberCount ++;
        members[_address] = MemberInfo(_address, _votingPower);
        emit NewMember(_address, _votingPower);
    }

    function removeMember(address _address) public {
        require(msg.sender == owner, "Only contract owner can remove a member.");
        require(members[_address].memberAddress != address(0), "The address is not a member.");
        require(proposals[proposalCount].proposer != _address, "Member cannot be removed while they have an active proposal.");
        members[_address].memberAddress = address(0);
        memberCount --;
        emit MemberRemoved(_address);
    }

    function createProposal(string memory _description) public {
        Proposal storage proposal = proposals[proposalCount];
        proposal.proposalId = proposalCount;
        proposal.proposer = msg.sender;
        proposal.description = _description;
        proposal.yesVotes = 0;
        proposal.noVotes = 0;
        proposal.executed = false;
        proposalCount ++;
        emit ProposalCreated(proposalCount, msg.sender, _description);
    }

     function getProposal(uint _index) public view returns(
        uint,
        address,
        string memory,
        uint,
        uint,
        bool
    ){
         Proposal storage proposal = proposals[_index];
         return(
             proposal.proposalId,
             proposal.proposer,
             proposal.description,
             proposal.yesVotes,
             proposal.noVotes,
             proposal.executed
         );
    }

    function vote(uint256 _proposalId, bool _vote) public {
        require(proposals[_proposalId].votes[msg.sender] == false, "The member has already voted on this proposal.");
        require(proposals[_proposalId].executed == false, "The proposal has already been executed.");
        proposals[_proposalId].votes[msg.sender] = _vote;
        if (_vote) {
            proposals[_proposalId].yesVotes += members[msg.sender].votingPower;
        } else {
            proposals[_proposalId].noVotes += members[msg.sender].votingPower;
        }
        proposals[_proposalId].votes[msg.sender] == true;
        emit ProposalVoted(_proposalId, msg.sender, _vote);
    }

    function executeProposal(uint256 _proposalId) public {
        require(proposals[_proposalId].proposer == msg.sender, "Only the proposer can execute the proposal.");
        require(proposals[_proposalId].executed == false, "The proposal has already been executed.");
        require(proposals[_proposalId].yesVotes > proposals[_proposalId].noVotes, "The proposal must have more yes votes than no votes.");

        proposals[_proposalId].executed = true;
        // Perform the actions described in the proposal here
        // ...
    }

     function getProposalsLength() public view returns(uint){
        return(proposalCount);
    }  
}
