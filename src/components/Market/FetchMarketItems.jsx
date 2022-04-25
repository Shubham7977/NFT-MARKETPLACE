import React, { useState } from 'react';
import Itemcard from './Itemcard';

const FetchMarketItems = ({marketplace}) => {
    const [response, setResponse] = useState(null)
    const Fetch = async(event) => {
        event.preventDefault();
        await marketplace.fetchMarketItems()
        .then((res)=>{
            setResponse(res)
            console.log(res);
            // response.map(func);
            response.map((element)=>{
                return <div className='col-md-3' key={element.url}>
                    <Itemcard title={response.ItemId} />
                </div>
            })
        }).catch((error)=>{
            console.log(error); 
        })
    }
    // const func = () =>{
        
    // }
  return (
    <>
    <h3>fetch market items</h3>
    <button className="btn btn-primary m-3" onClick={Fetch}>
        Fetch NFTS
    </button>
    <hr className="container text-center" style={{ width: "40rem" }} />
    </>
  )
}

export default FetchMarketItems;