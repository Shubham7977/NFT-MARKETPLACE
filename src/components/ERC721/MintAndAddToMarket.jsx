import React, { useState } from "react";
import axios from "axios";
import Spinner from "../Spinner";

const MintAndAddToMarket = ({ showAlert, marketplace, ERC721Contract }) => {
  const [file, setFile] = useState();
  const [myipfsHash, setMyipfsHash] = useState("");
  const [nftHash, setNftHash] = useState("");
  const [first2, setFirst2] = useState(false);
  const [spin, setSpin] = useState(false);


  const API_KEY = "907ee42677bb32545ae0";
  const API_SECRET =
    "2d3615c69d4dadcc139980cc33034aaedacd11fc68fbeee45a386f363f59c642";
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const nftContract = "0x8C4999D14cF44703075A584fb020Bf460c0144d0";

  const handleFile = async (fileToHandle) => { ///file upload to pinata
    // console.log("starting");
    // initialize the form data
    let formData = new FormData();
    // append the file form data to
    formData.append("file", fileToHandle);
    // the endpoint needed to upload the file
    await axios
      .post(url, formData, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
          pinata_api_key: API_KEY,
          pinata_secret_api_key: API_SECRET,
        },
      })
      .then((response) => {
        setMyipfsHash(response.data.IpfsHash);
        // console.log(response);
        // console.log("ipfs hash of picture", response.data.IpfsHash);
        showAlert("file uploaded successfully", "success");
      });
  };

  const onValue = async (event) => {
    setSpin(true);
    // if (!first2) {
    //   showAlert("first upload an image", "warning");
    // }
    event.preventDefault();
    const data = new FormData(event.target);
    let metadata;

    if (data.get("name") === "") {
      alert("name can't be eampty string");
    } else if (data.get("discription") === "") {
      alert("discription can't be eampty string");
    } else if (data.get("type") === "") {
      alert("type can't be eampty string");
    } else if (data.get("value") === "") {
      alert("value can't be eampty string");
    } else {
      metadata = {
        pinataMetadata: {
          name: data.get("name"),
        },

        pinataContent: {
          name: data.get("name"),
          description: data.get("discription"),
          image: `https://ipfs.io/ipfs/${myipfsHash}`,
          attributes: [
            {
              trait_type: data.get("type"),
              value: data.get("value"),
            },
          ],
        },
      };
    }
    // console.log(JSON.stringify(metadata));

    const pinJSONToIPFS = (pinataApiKey, pinataSecretApiKey, JSONBody) => {
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      return axios
        .post(url, JSONBody, {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        })
        .then(async function (response) {
          handleFile(file);
          // console.log("uploaded json", response.data.IpfsHash);
          setNftHash(response.data.IpfsHash);
          showAlert("data uploaded successfully", "success");
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    pinJSONToIPFS(API_KEY, API_SECRET, metadata).then(()=>{
      setSpin(false);
      setFirst2(true);
    });
  };

  const onMint = async (event) => {
    if (!first2) {
      showAlert("first upload an metadata", "warning");
    } else {
      setSpin(true);
      event.preventDefault();
      const data = new FormData(event.target);
      if (data.get("string") === "") {
        showAlert("empty string is not valid", "warning");
      } else {
        console.log(data.get("string"), `https://ipfs.io/ipfs/${nftHash}`);
        //   let response = await ERC721Contract.MintToken(
        //     data.get("string"),
        //     `https://ipfs.io/ipfs/${nftHash}`
        //   );
        //   await response.wait();
        //   console.log(await response);
        //   console.log(response.hash);
        //   console.log(response.from);
        await ERC721Contract.MintToken(
          data.get("string"),
          `https://ipfs.io/ipfs/${nftHash}`
        ).then(async (response) => {
          // console the response
          // console.log(response);
          //wait for the log(response)
          let eventResult = response.wait();
          // console.log("response", await eventResult);
          // setObj1(await eventResult);
          // console.log(await obj1);
          let responseData = await eventResult;
          // console.log(responseData);
          //  console.log(responseData?.logs);
          // console.log("event", responseData?.logs[2]);
          // console.log("event data", parseInt(responseData?.logs[2].data));

          //add to marketplace
          await marketplace
            .sell(
              nftContract,
              parseInt(responseData?.logs[2].data),
              data.get("price")
            )
            .then(() => {
              console.log("placed to marketplace");
              showAlert("Added to the marketplace", "success");
            })
            .catch(() => {
              showAlert("increase Allowance", "warning");
            });
            setSpin(false);
        });


      }
    }
  };
  return (
    <>
      {/* upload nft picture */}
      <h3>Mint NFT And Add To Market</h3>
      <div className=" container my-3" style={{ width: "40rem" }}>
        <label className="form-label">
          <small>Attach File Here*</small>
        </label>
        <br></br>
        <input
          className="btn btn-primary mx-3"
          type="file"
          onChange={(event) => setFile(event.target.files[0])}
        />
        {/* <button className="btn btn-primary" onClick={() => handleFile(file)}>
            Upload File
          </button> */}
      </div>

      {/* get metadata from user */}
      <div className="container" style={{ width: "40rem" }}>
        <div className="container ">
          <form onSubmit={onValue} id="myForm">
            <h3>Add your Unique Art Work</h3>

            <div className="my-3">
              <label className="form-label">
                <small>Add Name*</small>
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                id="colName"
              />
            </div>
            <div className="my-3">
              <label className="form-label">
                <small>Add Discriptions*</small>
              </label>
              <input
                type="text"
                name="discription"
                className="form-control"
                id="disc"
              />
            </div>
            <div className="my-3">
              <h3>Add properties</h3>
              <label className="form-label" htmlFor="traittype">
                <small>Type</small>
              </label>
              <input
                type="text"
                name="type"
                className="form-control"
                id="traittype"
              />
              <label className="form-label" htmlFor="value">
                <small>Value</small>
              </label>
              <input
                type="text"
                name="value"
                className="form-control"
                id="value"
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Upload Data
            </button>
            {/* <div>
              {spin && <Spinner />}
            </div> */}
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>

      <div>
        <div className="container text-center my-3" style={{ width: "40rem" }}>
          <form onSubmit={onMint}>
            <h3>Mint NFT</h3>
            <div className="my-3">
              <label className="form-label">
                <small>pelindrome string</small>
              </label>
              <input type="text" name="string" className="form-control" />
            </div>
            <div className="my-3">
              <label className="form-label">
                <small>Price</small>
              </label>
              <input type="text" name="price" className="form-control" />
            </div>
            <button className="btn btn-primary">Mint NFT</button>
            <div className="mt-3">
              {spin && <Spinner />}
            </div>
          </form>
        </div>
        <hr className="container text-center" style={{ width: "40rem" }} />
      </div>
    </>
  );
};

export default MintAndAddToMarket;
