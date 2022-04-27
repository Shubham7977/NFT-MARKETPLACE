//SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    event MintToken1(uint256 _tokenID1);

    constructor(address marketplaceAddress) ERC721("Minddeft Tokens", "MDT") {
        contractAddress = marketplaceAddress;
    }

    function reverse(string memory _str) internal pure returns (string memory) {
        bytes memory str = bytes(_str);
        string memory tmp = new string(str.length);
        bytes memory _reverse = bytes(tmp);

        for (uint256 i = 0; i < str.length; i++) {
            _reverse[str.length - i - 1] = str[i];
        }

        return string(_reverse);
    }

    function compare(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function Palindrome(string memory _str) public pure returns (bool) {
        string memory rev = reverse(_str);
        return compare(rev, _str);
    }

    function check11(uint256 token) internal view returns (bool) {
        return _exists(token);
    }

    function MintToken(string memory _palindrome, string memory tokenURI)
        public
    {
        require(
            Palindrome(_palindrome),
            "entered string is not palindrome string"
        );
        _tokenIds.increment();
        uint256 newItemID = _tokenIds.current();
        _mint(msg.sender, newItemID);
        _setTokenURI(newItemID, tokenURI);
        setApprovalForAll(contractAddress, true);
        // console.log(newItemID);
        emit MintToken1(newItemID);
    }
}
