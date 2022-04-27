import React, { useState } from "react";
import Spinner from "../Spinner";

const WithdrawAmount = ({ marketplace, showAlert }) => {
  const [spin, setSpin] = useState(false);

  const onWithdraw = async (event) => {
    setSpin(true);
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("id").length <= 0) {
      showAlert("Enter Valid Id", "warning");
    } else {
      await marketplace
        .withdrawTokenFromContract(data.get("id"))
        .then(() => {
          showAlert(
            "balance transfered to your account successfully",
            "warning"
          );
          setSpin(false);
        })
        .catch(() => {
          showAlert(
            "auction is not ended or the you don't have balance in contract",
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
          <form onSubmit={onWithdraw}>
            <h3>withdrar ERC20 Token from Marketplace</h3>
            <div className="my-3">
              <label className="form-label">
                <small>Id</small>
              </label>
              <input type="text" name="id" className="form-control" />
            </div>
            <button className="btn btn-primary">Withdraw Token</button>
            <div className="mt-2">{spin && <Spinner />}</div>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default WithdrawAmount;
