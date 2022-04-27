import React, { useState } from 'react'
import Spinner from '../Spinner';

const MarketApproveERC20 = ({showAlert,marketplace}) => {
  const [spin, setSpin] = useState(false);

    const onAllow = async(event) => {
      setSpin(true);
        event.preventDefault();
        const data = new FormData(event.target);
        if(data.get("amount") <= 0){
            showAlert("need required amount", "warning");
        }else{
            await marketplace.getApproveTokenfor(data.get("amount")).then(()=>{
                showAlert("approved successfully", "success");
                setSpin(false);
            }).catch((error)=>{
                showAlert(error, "danger");
                setSpin(false);
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
          <div className='mt-2'>
              {spin && <Spinner />}
            </div>
        </form>
      </div>
      <hr className="container text-center" style={{ width: "40rem" }} />
    </div>
    
    </>
  )
}

export default MarketApproveERC20;