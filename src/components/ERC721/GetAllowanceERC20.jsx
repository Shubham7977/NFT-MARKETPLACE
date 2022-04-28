import React, { useState } from "react";
import Spinner from "../Spinner";

const GetAllowanceERC20 = ({ marketplace, showAlert }) => {
  const [spin, setSpin] = useState(false);
  const OnAllow = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("amount") <= 0) {
      showAlert("need amount more than 0", "warning");
    } else {
      setSpin(true);
      await marketplace
        .getApproveTokenfor(data.get("amount"))
        .then(() => {
          showAlert("token Allowed", "success");
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
        <div className="container text-center my-3" style={{ width: "40rem" }}>
          <form onSubmit={OnAllow}>
            <h3>Get Allowance For Contract</h3>
            <div className="my-3">
              <label className="form-label">
                <small>Enter Amount</small>
              </label>
              <input type="text" name="amount" className="form-control" />
            </div>
            <button className="btn btn-primary">Get Allowance</button>
            {spin && (
              <div className="mt-3">
                <Spinner />
              </div>
            )}
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default GetAllowanceERC20;
