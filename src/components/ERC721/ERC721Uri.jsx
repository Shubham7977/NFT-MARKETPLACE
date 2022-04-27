import React, { useState } from "react";
import Spinner from "../Spinner";

const ERC721Uri = ({ ERC721Contract, showAlert }) => {
  const [getUri, setGetUri] = useState(null);
  const [spin, setSpin] = useState(false);
  const onUri = async (event) => {
    setSpin(true);
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("id") <= 0) {
      showAlert("0 tokenId  is not valid", "warning");
    } else {
      let uri = await ERC721Contract.tokenURI(data.get("id")).catch(() => {
        showAlert("tokenid doesn't exist", "danger");
      });
      setGetUri(uri.toString());
    }
    setSpin(false);
  };
  return (
    <>
      <div>
        <div className="container text-center my-3" style={{ width: "40rem" }}>
          <form onSubmit={onUri}>
            <h3>Get Uri</h3>
            <div className="my-3">
              <label className="form-label">
                <small>Enter TokenId</small>
              </label>
              <input type="text" name="id" className="form-control" />
            </div>
            <p className="my-2">Get Uri:</p>
            <p>{getUri}</p>
            <button className="btn btn-primary">Get URI</button>
            <div className="mt-2">{spin && <Spinner />}</div>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default ERC721Uri;
