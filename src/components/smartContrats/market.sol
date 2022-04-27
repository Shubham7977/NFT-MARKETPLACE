//SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//working on
interface ERC20 {
    function transfer(address _to, uint256 _value) external returns (bool);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool);

    function GiveAllowance(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address owner;
    uint256 listingPrice = 1000;
    ERC20 E;
    mapping(uint256 => bool) private appliedForSale;
    mapping(address => mapping(uint256 => uint256)) public balanceOfBiddder; //balance of bidder in contract

    mapping(uint256 => uint256) public countForAuction; //check wheather bid is forst time or not
    uint256 auctionDuration = 3 minutes;

    constructor(address ofERC20) {
        E = ERC20(ofERC20);
        owner = msg.sender;
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool sold;
        bool addedMarketplace;
        bool bidAdded;
        uint256 highestBid;
        uint256 auctionStartTime;
        address highestBidder;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        bool addedMarketplace,
        bool bidAdded,
        uint256 highestBid,
        uint256 auctionStartTime,
        address highestBidder
    );

    function CheckSale(uint256 tokenId) public view returns (bool) {
        return appliedForSale[tokenId];
    }

    function getApproveTokenfor(uint256 amount) public returns (bool) {
        require(
            E.GiveAllowance(msg.sender, address(this), amount),
            "ERC20 transaction failed"
        );
        return true;
    }

    function sell(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public nonReentrant {
        require(
            price > listingPrice,
            "Price must be greater than listing price"
        );
        // require(E.transferFrom(msg.sender,address(this),listingPrice),"error in transfer");
        E.transferFrom(msg.sender, address(this), listingPrice);

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        appliedForSale[tokenId] = true;

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false,
            true,
            false,
            price,
            0,
            address(0)
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false,
            true,
            false,
            price,
            0,
            address(0)
        );
    }

    function bid(uint256 _itemId, uint256 _bidAmount) public {
        if (countForAuction[_itemId] != 0) {
            require(
                block.timestamp <
                    idToMarketItem[_itemId].auctionStartTime + auctionDuration,
                "auction is ended"
            );
            require(
                idToMarketItem[_itemId].addedMarketplace == true,
                "item is not added to marketplace"
            );
        }
        require(
            idToMarketItem[_itemId].highestBid < _bidAmount,
            "value < heighest"
        );
        E.transferFrom(msg.sender, address(this), _bidAmount);
        idToMarketItem[_itemId].highestBid = _bidAmount;
        idToMarketItem[_itemId].highestBidder = msg.sender;
        balanceOfBiddder[msg.sender][_itemId] += _bidAmount;
        if (countForAuction[_itemId] == 0) {
            idToMarketItem[_itemId].auctionStartTime = block.timestamp;
            idToMarketItem[_itemId].bidAdded = true;
            idToMarketItem[_itemId].addedMarketplace = false;
            countForAuction[_itemId] += 1;
        }
    }

    function endAuction(address nftContract, uint256 _itemId) external {
        require(msg.sender == owner, "you are not the owner");
        require(
            block.timestamp >
                idToMarketItem[_itemId].auctionStartTime + auctionDuration,
            "auction is not ended yet"
        );
        address seller = idToMarketItem[_itemId].seller;
        require(
            E.transfer(seller, idToMarketItem[_itemId].highestBid),
            "ERC20 transfer failed"
        );
        require(
            E.transfer(owner, listingPrice),
            "Transaction ERC20 owner Failed"
        ); //owner
        IERC721(nftContract).transferFrom(
            address(this),
            idToMarketItem[_itemId].highestBidder,
            _itemId
        );
        balanceOfBiddder[msg.sender][_itemId] -= idToMarketItem[_itemId]
            .highestBid;
        idToMarketItem[_itemId].bidAdded = false;
        idToMarketItem[_itemId].addedMarketplace = false;
    }

    function checkEndTimeForAuction(uint256 _itemId)
        external
        view
        returns (uint256)
    {
        require(
            idToMarketItem[_itemId].bidAdded,
            "item is not added for auction"
        );
        uint256 startTime = idToMarketItem[_itemId].auctionStartTime;
        uint256 endTime = auctionDuration + startTime;
        return endTime;
    }

    function withdrawTokenFromContract(uint256 _itemId) external {
        require(
            balanceOfBiddder[msg.sender][_itemId] > 0,
            "insufficient balance"
        );
        require(
            idToMarketItem[_itemId].bidAdded == false,
            "auction is not ended for tokenId"
        ); ////set execution  only if auction is ended
        require(
            E.transfer(msg.sender, balanceOfBiddder[msg.sender][_itemId]),
            "ERC20 transfer failed"
        );
    }

    function checkHeighestBid(uint256 _itemId) external view returns (uint256) {
        // require(countForAuction[_itemId] == 1,"item is not in auction");
        return idToMarketItem[_itemId].highestBid;
    }

    function buy(address nftContract, uint256 itemId) public nonReentrant {
        require(
            idToMarketItem[itemId].bidAdded == false,
            "item is in auction now"
        );
        uint256 price = idToMarketItem[itemId].price;
        address seller = idToMarketItem[itemId].seller;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        E.transferFrom(msg.sender, seller, price); //tranfer selling price to the owner of the nft
        require(
            E.transfer(owner, listingPrice),
            "Transaction ERC20 owner Failed"
        ); //owner
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = msg.sender;
        idToMarketItem[itemId].sold = true;
        idToMarketItem[itemId].addedMarketplace = false;
        _itemsSold.increment();
        appliedForSale[tokenId] = false;

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            address(0),
            msg.sender,
            price,
            true,
            false,
            false,
            0,
            0,
            address(0)
        );
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyNFts() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
