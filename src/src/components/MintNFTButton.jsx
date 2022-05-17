import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import myEpicNFT from "../contracts/MyEpicNFT.json";

export default function MintNFTButton() {
  const CONTRACT_ADDRESS_RINKEBY = "0x6DD97242Be2c31019095De64b1Cfc3b012a5EE09";

  const [connectedContract, setConnectedContract] = useState();
  const [currentNFT, setCurrentNFT] = useState();
  const [maxNFT, setMaxNFT] = useState();
  const [minting, setMinting] = useState(false);

  const mintNft = async () => {
    try {
      let txn;
      txn = await connectedContract.makeAndEpicNFT();
      setMinting(true);
      await txn.wait();

      console.log(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${txn.hash}`
      );

      txn = await connectedContract.getTotalNFTMintedSoFar();
      setCurrentNFT(txn[0].toNumber());
    } catch (error) {
      console.log(error);
    }
    setMinting(false);
  };

  useEffect(() => {
    async function getContract() {
      try {
        const { ethereum } = window;

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS_RINKEBY,
          myEpicNFT.abi,
          signer
        );

        let chainId = await ethereum.request({ method: "eth_chainId" });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId) {
          alert("You are not connected to the Rinkeby Test Network!");
        }

        const nftMintedData = await contract.getTotalNFTMintedSoFar();
        setMaxNFT(nftMintedData[1].toNumber());
        setCurrentNFT(nftMintedData[0].toNumber());

        contract.on("newEpicNftMinted", (sender, tokenId) => {
          console.log("from", sender, tokenId.toNumber());
          alert(
            `this is your NFT address https://testnets.opensea.io/assets/${CONTRACT_ADDRESS_RINKEBY}/${tokenId.toNumber()}`
          );
        });

        setConnectedContract(contract);
      } catch (error) {
        console.log(error);
      }
    }

    getContract();
  }, []);

  return (
    <>
      <button
        onClick={mintNft}
        className={`cta-button ${minting ? "minting" : "mint-button"}`}
      >
        {minting ? "Minting..." : "Mint NFT"}
      </button>
      <a
        href="https://testnets.opensea.io/collection/squarenft-llcflg1hyq"
        target="_blank"
        className="cta-button opensea-button"
      >
        View your collection
      </a>
      {maxNFT && (
        <p className="sub-text">
          {currentNFT} of {maxNFT} Minted so far!
        </p>
      )}
    </>
  );
}
