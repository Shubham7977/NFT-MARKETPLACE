import React from 'react'

const Itemcard = ({title,description,url,price}) => {
  return (
    <>
     <div className="my-3">
        <div className="card">
          <img src={url} className="card-img-top" alt="..." />
          <div className="card-body">
                <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <h3 className="card-title">{price}</h3>
          </div>
        </div>
      </div>
    </>
  )
}

export default Itemcard