import React, { useState } from "react";
import Spinner from "../Spinner";

const EndAuction = ({ marketplace, showAlert }) => {
  const [spin, setSpin] = useState(false);
  const NFTContract = "0x1472Fb8B030647295a6f0a7259910596a00d20c0";

  const onEnd = async (event) => {
    setSpin(true);
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("Id").length <= 0) {
      showAlert("Enter Valid Id", "warning");
    } else {
      await marketplace
        .endAuction(NFTContract, data.get("Id"))
        .then(() => {
          showAlert("Auction ended", "success");
          setSpin(false);
        })
        .catch(() => {
          showAlert(
            "item is not exist in auction or auction is not ended yet",
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
          <form onSubmit={onEnd}>
            <h3>End Auction</h3>
            <div className="my-3">
              <label className="form-label">
                <small>Id</small>
              </label>
              <input type="text" name="Id" className="form-control" />
            </div>
            <button className="btn btn-primary">End Auction</button>
            <div className="mt-2">{spin && <Spinner />}</div>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default EndAuction;
