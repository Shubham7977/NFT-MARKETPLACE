import React, { useState } from "react";
import { ethers } from "ethers";
import Alert from "./Alert";
import Navbar from "./Navbar";
import ERC20 from "./contractABIs/MyToken.json";
import ERC721 from "./contractABIs/NFT.json";
import Market from "./contractABIs/NFTMarket.json";
import ERC20Transfer from "./ERC20/ERC20Transfer";

import ERC721OwnerOf from "./ERC721/ERC721OwnerOf";
import MintAndAddToMarket from "./ERC721/MintAndAddToMarket";
import MarketApproveERC20 from "./ERC721/MarketApproveERC20";
import ERC721Uri from "./ERC721/ERC721Uri";
// import GetAllowanceERC20 from "./ERC721/GetAllowanceERC20";
import Buy from "./Market/Buy";
import Bid from "./Market/Bid";
import EndAuction from "./Market/EndAuction";
import WithdrawAmount from "./Market/WithdrawAmount";
import FetchMarketItems from "./Market/FetchMarketItems";
import FetchMyNfts from "./Market/FetchMyNfts";
import FetchItemsCreated from "./Market/FetchItemsCreated";
import CheckBalanceERC20 from "./ERC20/CheckBalanceERC20";

const Main = () => {
  const [alert, setAlert] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [ERC20Contract, setERC20Contract] = useState(null);
  const [ERC721Contract, setERC721Contract] = useState(null);
  const [marketplace, setMarketplace] = useState(null);

  const ERC20ContractAddress = "0x579BA2531494Dbf862dd1d1E763e2BB231075a3f";
  const ERC721ContractAddress = "0xc5D8A479d50512BF5FFF86722995211f8e440118";
  const NFTMarketAddress = "0x04F6E55857ab6e3ad494e1Fe0D45Eea080b126E7";

  const showAlert = (message1, type) => {
    setAlert({
      msg: message1,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const updateEthers = () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum || "https://ropsten.infura.io/v3/4ec867dab82f4ddba7eb9397fe80154f");
    let signer = provider.getSigner();


    let tempContract = new ethers.Contract(
      ERC20ContractAddress,
      ERC20,
      signer
    );
    setERC20Contract(tempContract);

    let tempERC721 = new ethers.Contract(
      ERC721ContractAddress,
      ERC721,
      signer
    );
    setERC721Contract(tempERC721);

    let tempMarket = new ethers.Contract(NFTMarketAddress, Market, signer);

    setMarketplace(tempMarket);
  };

  const onConnection = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
        // console.log(`${process.env.REACT_APP_NFT_CONTRACT_ADDRESS}`);
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setDefaultAccount(result[0]);
          updateEthers();
          setIsConnected(true);
          showAlert("Account Connected", "success");
        })
        .catch((error) => {
          showAlert(error, "danger");
        });
    } else {
      showAlert("Need to install metamask", "warning");
    }
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  const accountChangedHandler = () => {
    window.location.reload();
    // onConnection();
  };

  window.ethereum.on("accountsChanged", () => accountChangedHandler());
  window.ethereum.on("chainChanged", () => chainChangedHandler);
  window.ethereum.on("disconnect", () => {
    setIsConnected(false);
    chainChangedHandler();
  });

  return (
    <>
      {isConnected && <Navbar />}
      <Alert alert={alert} />

      <div className="App-header my-2">
        {!isConnected && (
          <button className="btn btn-primary my-3" onClick={onConnection}>
            Connect Wallet
          </button>
        )}
        {isConnected && <p>Connected Address:</p>}
        {isConnected && <p>{defaultAccount}</p>}
        {isConnected && (
          <hr className="container text-center" style={{ width: "40rem" }} />
        )}

        {isConnected && (
          <ERC20Transfer ERC20Contract={ERC20Contract} showAlert={showAlert} />
        )}

        {isConnected && <CheckBalanceERC20 ERC20Contract={ERC20Contract} showAlert={showAlert} />}

        {isConnected && (
          <MarketApproveERC20 marketplace={marketplace} showAlert={showAlert} />
        )}

        {isConnected && (
          <MintAndAddToMarket
            ERC721Contract={ERC721Contract}
            marketplace={marketplace}
            showAlert={showAlert}
          />
        )}

        {isConnected && (
          <ERC721OwnerOf
            ERC721Contract={ERC721Contract}
            showAlert={showAlert}
          />
        )}

        {isConnected && (
          <ERC721Uri ERC721Contract={ERC721Contract} showAlert={showAlert} />
        )}


       {/* {isConnected && <GetAllowanceERC20 showAlert={showAlert} marketplace={marketplace} />} */}


       {isConnected && <Buy marketplace={marketplace} showAlert={showAlert}/>}


       {isConnected && <Bid marketplace={marketplace} showAlert={showAlert} />}

       {isConnected &&  <EndAuction marketplace={marketplace} showAlert={showAlert} />}

       {isConnected &&  <WithdrawAmount  marketplace={marketplace} showAlert={showAlert} />}

       {isConnected && <FetchMarketItems marketplace={marketplace} />}

       {isConnected && <FetchMyNfts marketplace={marketplace} />}

       {isConnected &&  <FetchItemsCreated  marketplace={marketplace} />}
      </div>
    </>
  );
};

export default Main;
