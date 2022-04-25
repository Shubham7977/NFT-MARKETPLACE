import React from 'react'

const EndAuction = ({marketplace,showAlert}) => {

    const NFTContract = "0xA3ca73190bab280dd4Dd69a703E0979fe75e9d59";

    const onEnd = async(event) =>{
        event.preventDefault();
        const data = new FormData(event.target);
        if(data.get("Id").length <= 0){
            showAlert("Enter Valid Id", "warning");
        }
        else{
            await marketplace.endAuction(NFTContract,data.get("Id"))
            .then(()=>{
                showAlert("Auction ended", "success");
            })
            .catch(()=>{
                showAlert("item is not exist in auction or auction is not ended yet", "warning");

            })
        }

    }
    

  return (
    <>
    <div>
        <div className="container text-center my-2" style={{ width: "40rem" }}>
          <form onSubmit={onEnd}>
            <h3>End Auction</h3>
            <div className="my-3">
              <label className="form-label"><small>Id</small></label>
              <input type="text" name="Id" className="form-control" />
            </div>
            <button className="btn btn-primary">End Auction</button>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  )
}

export default EndAuction