import React from "react";

const Itemcard = ({ ItemId, hBid, AuctionAdded, MarketAdded, url, price }) => {
  // console.log(props);
  // console.log(props.ItemId);
  // console.log("hi")
  return (
    <>
      {/* <h1>hi</h1> */}
      <div className="card m-2" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title font-weight-bold text-secondary">{`#${ItemId}`}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Minddeft Tokens</h6>
          <a
            href={`https://ropsten.etherscan.io/address/${url}`}
            className="card-link"
            target="_blank"
          >
            <button className="btn btn-primary">Check on Etherscan</button>
          </a>
          {MarketAdded && (
            <div>
              <p className="card-text text-secondary mt-2">
                open for marketplace
              </p>
              <p>you can bid these id</p>
              <p className="card-text text-secondary mt-2">Price : {price}</p>
            </div>
          )}
          {AuctionAdded && (
            <div>
              <p className="card-text text-secondary">open for Auction</p>
              <p className="card-text text-secondary">HeighestBid:{hBid}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Itemcard;
