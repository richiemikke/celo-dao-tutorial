import "./App.css";
import Home from "./components/home";
import { Proposals } from "./components/proposals";
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import celodao from "./contracts/celo-dao.abi.json";

const ERC20_DECIMALS = 18;
const contractAddress = "0x69dfb020bA12Ce303118E3eF81f9b9E4eB08cE17";

function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [proposals, setProposals] = useState([]);

  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(celodao, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);

  const getProposals = useCallback(async () => {
    const proposalsLength = await contract.methods.getProposalsLength().call();
    const proposals = [];
    for (let index = 0; index < proposalsLength; index++) {
      let _proposals = new Promise(async (resolve, reject) => {
        let proposal = await contract.methods.getProposal(index).call();
        resolve({
          index: index,
          proposalId: proposal[0],
          proposer: proposal[1],
          description: proposal[2],
          yesVotes: proposal[3],
          noVotes: proposal[4],
          executed: proposal[6],
        });
      });
      proposals.push(_proposals);
    }

    const _proposals = await Promise.all(proposals);
    setProposals(_proposals);
  }, [contract]);

  const addProposal = async (_description) => {
    try {
      await contract.methods
        .createProposal(_description)
        .send({ from: address });
      getProposals();
    } catch (error) {
      alert(error);
    }
  };

  const addMember = async (_address, _votingPower) => {
    try {
      await contract.methods
        .addMember(_address, _votingPower)
        .send({ from: address });
      getProposals();
    } catch (error) {
      alert(error);
    }
  };

  const removeMember = async (_address) => {
    try {
      await contract.methods.removeMember(_address).send({ from: address });
      getProposals();
    } catch (error) {
      alert(error);
    }
  };

  const vote = async (_proposalId, _vote) => {
    try {
      await contract.methods.vote(_proposalId, _vote).send({ from: address });
      getProposals();
    } catch (error) {
      alert(error);
    }
  };

  const executeProposal = async (_proposalId) => {
    try {
      await contract.methods
        .executedProposal(_proposalId)
        .send({ from: address });
      getProposals();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getProposals();
    }
  }, [contract, getProposals]);

  return (
    <div className="App">
      <Home
        cUSDBalance={cUSDBalance}
        addMember={addMember}
        addProposal={addProposal}
        removeMember={removeMember}
      />
      <Proposals
        proposals={proposals}
        vote={vote}
        executeProposal={executeProposal}
        walletAddress={address}
      />
    </div>
  );
}

export default App;
