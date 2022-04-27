import React, { useState } from "react";
import Spinner from "../Spinner";

const CheckHeighestBid = ({ marketplace, showAlert }) => {
  const [check, setCheck] = useState(false);
  const [bid, setBid] = useState(null);
  const [spin, setSpin] = useState(false);

  const onBidCheck = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("id").length < 0) {
      showAlert("Enter Valid id", "warning");
    } else {
      setSpin(true);
      let bids = await marketplace
        .checkHeighestBid(data.get("id"))
        .catch(() => {
          showAlert("item is not in the auction", "warning");
        });
      setBid(bids);
      setCheck(true);
      setSpin(false);
    }
  };

  return (
    <>
      <div>
        <div className="container text-center" style={{ width: "40rem" }}>
          <form onSubmit={onBidCheck}>
            <h3>Check Heighest Bid For Token</h3>
            <div className="my-3">
              <label className="form-label">
                <small>Add Id</small>
              </label>
              <input type="text" name="id" className="form-control" />
            </div>
            {check && <h2 className="my-3">bid : {bid}</h2>}
            <button className="btn btn-primary">Check heighest bid</button>
            <div className="mt-2">{spin && <Spinner />}</div>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default CheckHeighestBid;
