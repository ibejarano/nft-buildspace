import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect, useState } from "react";

import MintNFTButton from "./components/MintNFTButton";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Render Methods

  const [account, setAccount] = useState("");

  const checkAccounts = async () => {
    const accountFounded = await window.ethereum.request({
      method: "eth_accounts",
    });
    setAccount(accountFounded[0]);
  };

  const checkIfWalletIsConnected = () => {

    const { ethereum } = window;

    if (ethereum) {
      console.log("Metamask is ready to go!");
      checkAccounts();
    } else {
      console.log("Metamask is not installed");
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("GET Metamask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
    setAccount(accounts[0]);
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderMintNft = () => (
    <>
      <p className="sub-text">Wallet connected: {account}</p>
      <MintNFTButton />
    </>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {account == "" ? renderNotConnectedContainer() : renderMintNft()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
