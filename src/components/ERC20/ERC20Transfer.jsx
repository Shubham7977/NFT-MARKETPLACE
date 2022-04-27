import React, { useState } from "react";
import Spinner from "../Spinner";

const ERC20Transfer = ({ ERC20Contract, showAlert }) => {
  const [spin, setSpin] = useState(false);

  const onTransferERC20 = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("to").length !== 42) {
      showAlert("Enter Valid Address", "warning");
    } else if (data.get("amount") <= 0) {
      showAlert("need amount more than 0", "warning");
    } else {
      await ERC20Contract.transfer(data.get("to"), data.get("amount"))
        .then((response) => {
          setSpin(true);
          console.log(response);
          showAlert("token transferred successfully", "success");
          setSpin(false);
        })
        .catch((error) => {
          showAlert(error, "danger");
        });
    }
  };
  return (
    <>
      <div>
        <div className="container text-center my-2" style={{ width: "40rem" }}>
          <form onSubmit={onTransferERC20}>
            <h3>Transfer ERC20 Token</h3>
            <div className="my-3">
              <label className="form-label">
                <small>To</small>
              </label>
              <input type="text" name="to" className="form-control" />
            </div>
            <div className="my-3">
              <label className="form-label">
                <small>Amount</small>
              </label>
              <input type="text" name="amount" className="form-control" />
            </div>
            <button className="btn btn-primary">Transfer Token</button>
            <div className="mt-2">{spin && <Spinner />}</div>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default ERC20Transfer;
