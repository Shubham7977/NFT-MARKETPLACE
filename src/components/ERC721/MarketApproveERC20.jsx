import React from 'react'

const MarketApproveERC20 = ({showAlert,marketplace}) => {

    const onAllow = async(event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        if(data.get("amount") <= 0){
            showAlert("need required amount", "warning");
        }else{
            await marketplace.getApproveTokenfor(data.get("amount")).then(()=>{
                showAlert("approved successfully", "success");
            }).catch((error)=>{
                showAlert(error, "danger");
            })
        }
    }
  return (
    <>
    <div>
      <div className="container text-center my-3" style={{ width: "40rem" }}>
        <form onSubmit={onAllow}>
          <h3>Allow contract to Spend To Marketplace</h3>
          <div className="my-3">
            <label className="form-label"><small>Amount</small></label>
            <input type="text" name="amount" className="form-control"  />
          </div>
          <button className="btn btn-primary">Allow</button>
        </form>
      </div>
      <hr className="container text-center" style={{ width: "40rem" }} />
    </div>
    
    </>
  )
}

export default MarketApproveERC20;