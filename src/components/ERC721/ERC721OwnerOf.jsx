import React, { useState } from "react";
import Spinner from "../Spinner";

const ERC721OwnerOf = ({ ERC721Contract, showAlert }) => {
  const [address, setAddress] = useState(null);
  const [spin, setSpin] = useState(false);

  const onOwnerCheck = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("id") === 0) {
      showAlert("Enter Valid TokenId", "warning");
    } else {
      setSpin(true);
      let id = data.get("id").toString();
      let addr = await ERC721Contract.ownerOf(id).catch(() => {
        showAlert("TokenID is not Minted yet", "danger");
      });
      setSpin(false);
      setAddress(addr.toString());
    }
  };
  return (
    <>
      <div>
        <div className="container text-center" style={{ width: "40rem" }}>
          <form onSubmit={onOwnerCheck}>
            <h3>Check Owner</h3>
            <div className="my-3">
              <label className="form-label">
                <small>Add TokenId</small>
              </label>
              <input type="number" name="id" className="form-control" />
            </div>
            <h3 className="my-3">Owner : {address}</h3>
            <button className="btn btn-primary">Check Owner</button>
            {spin && (
              <div className="mt-3">
                <Spinner />
              </div>
            )}
          </form>
          <div className="text-center"></div>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default ERC721OwnerOf;
