import React from "react";
import "./css/install.css";

const Install = () => {
  return (
    <div className="App-header my-2">
      <div className="container text-center my-2">
        <h3 style={{ color: "white" }}>
          Follow The Link To Install MetaMask Wallet
        </h3>
        <a
          href="https://metamask.io/download.html"
          target={"_blank"}
          rel="noreferrer"
        >
          <button className="btn btn-primary my-1">Click here &rarr;</button>
        </a>
      </div>
    </div>
  );
};

export default Install;
