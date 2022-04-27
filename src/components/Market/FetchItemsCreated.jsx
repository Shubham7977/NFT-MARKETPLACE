import React, { useState } from "react";
import Spinner from "../Spinner";
import Itemcard from "./Itemcard";

const FetchItemsCreated = ({ marketplace }) => {
  const [response, setResponse] = useState(null);
  const [spin, setSpin] = useState(false);
  const Fetch = async (event) => {
    setSpin(true);
    event.preventDefault();
    await marketplace
      .fetchItemsCreated()
      .then((res) => {
        setResponse(res);
        setSpin(false);
        // console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <h3>fetch market items created by me</h3>
      <button className="btn btn-primary m-3" onClick={Fetch}>
        Fetch NFTS
      </button>
      {spin && <Spinner />}

      <div className="d-flex flex-column">
        {response &&
          response.map((element) => {
            // console.log(element);
            // console.log(parseInt(element.itemId));
            // console.log(element.nftContract)

            return (
              <Itemcard
                key={parseInt(element.itemId)}
                ItemId={parseInt(element.itemId)}
                url={element.nftContract}
                price={parseInt(element.price)}
                hBid={parseInt(element.highestBid)}
                AuctionAdded={!!element.bidAdded}
                MarketAdded={!!element.addedMarketplace}
              />
            );
          })}
      </div>
      <hr className="container text-center" style={{ width: "40rem" }} />
    </>
  );
};

export default FetchItemsCreated;
