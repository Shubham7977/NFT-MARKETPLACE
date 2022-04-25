import React, { useState } from "react";

const CheckBalanceERC20 = ({ERC20Contract, showAlert}) => {

    const [balance, setBalance] = useState(null);
    const [bal, setBal] = useState(false);

    const onBalanceCheck = async(event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        if(data.get("to").length !== 42){
            showAlert("Enter Valid Address", "warning");
        }else{
            // console.log("ho");
            let addr = data.get("to");
            let bal = await ERC20Contract.balanceOf(addr);
            setBal(true);
            setBalance(bal.toString());
        }
    }

  return (
    <>
    
      <div>
        <div className="container text-center" style={{ width: "40rem" }}>
          <form onSubmit={onBalanceCheck}>
            <h3>Check Balance</h3>
            <div className="my-3">
              <label className="form-label">
                <small>Add Address</small>
              </label>
              <input type="text" name="to" className="form-control" id="" />
            </div>
            {bal && <h2 className="my-3">Balance : {balance}</h2>}
            <button className="btn btn-primary">Check Balance</button>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default CheckBalanceERC20;
