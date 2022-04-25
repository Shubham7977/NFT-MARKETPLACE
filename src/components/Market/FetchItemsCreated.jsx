import React from 'react'

const FetchItemsCreated = ({marketplace}) => {
    const Fetch = async(event) => {
        event.preventDefault();
        await marketplace.fetchItemsCreated()
        .then((response)=>{
            console.log(response)
        }).catch((error)=>{
            console.log(error); 
        })
    }
  return (
    <>
    <h3>fetch market items created by me</h3>
    <button className="btn btn-primary m-3" onClick={Fetch}>
        Fetch NFTS
    </button>
    <hr className="container text-center" style={{ width: "40rem" }} />
    </>
  )
}

export default FetchItemsCreated