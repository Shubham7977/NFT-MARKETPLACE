import React, { useState } from "react";
import Spinner from "../Spinner";

const Bid = ({ marketplace, showAlert }) => {
  const [spin, setSpin] = useState(false);

  const onBid = async (event) => {
    setSpin(true);
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("id") <= 0) {
      showAlert("Enter valid id", "warning");
    } else if (data.get("bid") <= 0) {
      showAlert("need amount more than 0", "warning");
    } else {
      await marketplace
        .bid(data.get("id"), data.get("bid"))
        .then(() => {
          showAlert("bid is added to contract", "success");
          setSpin(false);
        })
        .catch((error) => {
          showAlert("check Allowance or itemid Doesn't exixst", "warning");
          setSpin(false);
        });
    }
  };

  return (
    <>
      <div>
        <div className="container text-center my-2" style={{ width: "40rem" }}>
          <form onSubmit={onBid}>
            <h3>Bid for NFT</h3>
            <div className="my-3">
              <label className="form-label">
                <small> Add Id</small>
              </label>
              <input type="text" name="id" className="form-control" />
            </div>
            <div className="my-3">
              <label className="form-label">
                <small> Add Bid</small>
              </label>
              <input type="text" name="bid" className="form-control" />
            </div>
            <button className="btn btn-primary">Bid</button>
            <div className="mt-2">{spin && <Spinner />}</div>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default Bid;
