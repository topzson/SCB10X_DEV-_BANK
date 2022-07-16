import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import DaiAbi from "../data/DAIToken.json";
import Home from './Home.js'
import Deposit from './Deposit.js'
import Withdraw from './Withdraw.js'
import Transfer from './Transfer.js'
import Create from './Create.js'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import logo from './logo.svg'

import './App.css';

function App() {
  const [page, setPage] = useState("account");
  const [connectWallet, setConnectWallet] = useState(false);
  const [connectBalance, setConnectBalance] = useState(false);
  const [contractListened, setContractListened] = useState();
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-"
  })
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-"
  });
  const [BankbalanceInfo, setBankBalanceInfo] = useState({
    address: "-",
    balance: "-"
  });

  const [txs, setTxs] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountBalance, setAccountBalance] = useState([]);
  const [currAccount, setCurrAccount] = useState("");
  const [loading, setLoading] = useState(true)
  let eth

  if (typeof window !== 'undefined') {
    eth = window.ethereum
  }
  useEffect(() => {
    if (contractInfo.address !== "-") {
      getMyBalance();
      getAccounts();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        DaiAbi,
        provider
      );
      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount)
          }
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  const getTokenInfo = async () => {
    setConnectWallet(true);
    console.log("Get Token Info");
    const contractAddress = "0xa50AF16e156e2AEd217a71a123972FfE1b4c8df8";
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const erc20 = new ethers.Contract(contractAddress, DaiAbi, provider);

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();

    setContractInfo({
      address: contractAddress,
      tokenName,
      tokenSymbol,
      totalSupply
    });
    setLoading(false)
    setConnectWallet(false);
  };

  const getAccounts = async () => {
    console.log("Get Accounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(balanceInfo.address, DaiAbi, provider);
    const allAccounts = await erc20.getOwnAccount();
    setAccounts(allAccounts);

    setAccountBalance([]);
    for (let i = 0; i < allAccounts.length; i++) {
      const temp = await erc20.accounts(allAccounts[i]);
      setAccountBalance(accountBalance => [...accountBalance, parseInt(temp._hex, 16)]);
    }
  }
  const refreshBalance = async () => {
    getAccounts();
  }

  const getMyBalance = async () => {
    setConnectBalance(() => { return true; });
    console.log("Get My Balance");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, DaiAbi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);

    setBalanceInfo({

      address: signerAddress,
      balance: String(balance)
    });

    setConnectBalance(() => {
      return false;
    }, 6000);
  };
  const getBankBalance = async () => {
    setConnectBalance(() => { return true; });
    console.log("Get My Balance");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, DaiAbi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const bankname = await erc20.getOwnAccount(signerAddress);
    const bankbalance = await erc20.accounts.balance();

    setBankBalanceInfo({
      name: bankname,
      address: signerAddress,
      balance: bankbalance,
    });

    setConnectBalance(() => {
      return false;
    }, 6000);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar expand="lg" bg="light" variant="secondary">
          <Container>
            <Navbar.Brand href="http://localhost:3000/">
              <img src={logo} className="mx-auto" alt="" />

            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto ">


              </Nav>
              <Nav>
                {balanceInfo.address ? (
                  <Nav.Link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button nav-button btn-sm mx-4">
                    <Button onClick={() => getTokenInfo()} loading={connectWallet} connectBalance={connectBalance} refreshBalance={refreshBalance}>
                      {balanceInfo.address === "-" ? "Connect Wallet" : balanceInfo.address.slice(0, 5) + '...' + balanceInfo.address.slice(38, 42)}
                    </Button>

                  </Nav.Link>
                ) : (
                  <Button onClick={connectWallet} variant="outline-primary">Connect Wallet</Button>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home WalletAddress={balanceInfo.address} balance={balanceInfo.balance} DaiAbi={DaiAbi} accountss={accounts} />
              } />
              <Route path="/create" element={
                <Create addresscon={contractInfo.address} DaiAbi={DaiAbi} />
              } />
              <Route path="/deposit" element={
                <Deposit addresscon={contractInfo.address} DaiAbi={DaiAbi}/>
              } />
              <Route path="/withdraw" element={
                <Withdraw addresscon={contractInfo.address} DaiAbi={DaiAbi}/>
              } />
              <Route path="/transfer" element={
                <Transfer addresscon={contractInfo.address} DaiAbi={DaiAbi}/>
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;