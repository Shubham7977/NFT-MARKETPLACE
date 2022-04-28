import React, { useState } from "react";
import Spinner from "../Spinner";

const Buy = ({ marketplace, showAlert }) => {
  const [spin, setSpin] = useState(false);
  const NFTAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;

  const onBuy = async (event) => {
    setSpin(true);
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("id").length <= 0) {
      showAlert("Enter Valid Id", "warning");
    } else {
      await marketplace
        .buy(NFTAddress, data.get("id"))
        .then(() => {
          showAlert("Now item is yours", "success");
          setSpin(false);
        })
        .catch(() => {
          showAlert(
            "item is not in marketplace or Allowance is low",
            "warning"
          );
          setSpin(false);
        });
    }
  };
  return (
    <>
      <div>
        <div className="container text-center my-2" style={{ width: "40rem" }}>
          <form onSubmit={onBuy}>
            <h3>Buy NFT</h3>
            <div className="my-3">
              <label className="form-label">
                <small> Add Id</small>
              </label>
              <input type="number" name="id" className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary">
              Buy
            </button>
            <div className="mt-2">{spin && <Spinner />}</div>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default Buy;
