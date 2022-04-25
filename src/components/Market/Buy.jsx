import React from 'react'

const Buy = (marketplace,showAlert) => {

    const NFTAddress = "0xA3ca73190bab280dd4Dd69a703E0979fe75e9d59";
    

    const onBuy = async(event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        if(data.get("id").length <= 0){
            showAlert("Enter Valid Id", "warning");
        }
        else{
            await marketplace.buy(NFTAddress,data.get("id"))
            .then(()=>{
                showAlert("Now item is yours", "success");
            })
            .catch(()=>{
                showAlert("item is not in marketplace or Allowance is low", "warning");
            })

    }
}
  return (
    <>
    <div>
        <div className="container text-center my-2" style={{ width: "40rem" }}>
          <form onSubmit={onBuy}>
            <h3>Buy NFT</h3>
            <div className="my-3">
              <label className="form-label"><small> Add Id</small></label>
              <input type="text" name="id" className="form-control" />
            </div>
            <button className="btn btn-primary">Buy</button>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  )
}

export default Buy