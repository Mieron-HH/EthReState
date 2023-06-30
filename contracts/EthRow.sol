// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function ownerOf(uint256 _id) external returns (address);
    function transferFrom(address _from, address _to, uint256 _nftID) external;
}

contract EthRow {
    address public EthReStateAddress;
    
    mapping(uint256 => address payable) public seller;
    mapping(uint256 => address) public lender;
    mapping(uint256 => address) public inspector;
    mapping(uint256 => address) public buyer;

    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => bool) public listed;
    mapping(uint256 => bool) public inspected;
    mapping(uint256 => bool) public reserved;
    mapping(uint256 => bool) public lended;
    mapping(uint256 => mapping(address => bool)) public approved;
    mapping(uint256 => mapping(address => bool)) public finalized;

    constructor(address _EthReStateAddress) {
        EthReStateAddress = _EthReStateAddress;
    }

    modifier onlySeller(uint256 _nftID) {
        require(
            IERC721(EthReStateAddress).ownerOf(_nftID) == msg.sender,
            "Only the owner of the property can list it"
        );

        _;
    }

    modifier onlyInspector(uint256 _nftID) {
        require(msg.sender == inspector[_nftID], "Only the inspector can inspect");
        
        _;
    }

    function list(
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address _inspector
    ) public onlySeller(_nftID) {
        listed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        seller[_nftID] = payable(msg.sender);
        inspector[_nftID] = _inspector;

        IERC721(EthReStateAddress).transferFrom(msg.sender, address(this), _nftID);
    }

    function inspect(uint256 _nftID, bool _inspected) public onlyInspector(_nftID) {
        inspected[_nftID] = _inspected;
    }

    function reserve(uint256 _nftID, address _lender) public payable {
        require(msg.sender != seller[_nftID], "Seller cannot buy their property");
        require(escrowAmount[_nftID] >= msg.value, "Earnest amount is insufficient");

        (bool success, ) = payable(address(this)).call{value: msg.value}("");
        require(success, "Deposit was unsuccessful. Try again.");
        buyer[_nftID] = msg.sender;
        lender[_nftID] = _lender;
        reserved[_nftID] = true;
    }

    function approve(uint256 _nftID) public payable {
        require(
            msg.sender == seller[_nftID] ||
            msg.sender == lender[_nftID] ||
            msg.sender == buyer[_nftID],
            "Only seller, buyer, or lender can approve sale of this property"
        );
        
        if (msg.sender == lender[_nftID]) {
            require(msg.value >= (purchasePrice[_nftID] - escrowAmount[_nftID]), "Insufficient lending amount");
            (bool success, ) = payable(address(this)).call{value: msg.value}("");
            require(success, "Lending was not processed. Try again");
            lended[_nftID] = true;
        }

        approved[_nftID][msg.sender] = true;
    }

    function finalize(uint256 _nftID) public {
        require(inspected[_nftID], "Property hasn't passed inspection");
        require(approved[_nftID][seller[_nftID]], "Seller hasn't approved yet");
        require(approved[_nftID][buyer[_nftID]], "Buyer hasn't approved yet");
        require(approved[_nftID][lender[_nftID]], "Lender hasn't approved yet");
        require(lended[_nftID], "Lender hasn't lended yet");
        require(address(this).balance >= purchasePrice[_nftID], "Purchase price hasn't been met");

        (bool success, ) = payable(seller[_nftID]).call{value: purchasePrice[_nftID]}("");
        require(success, "Transfer of property price was not processed. Try again");

        IERC721(EthReStateAddress).transferFrom(address(this), buyer[_nftID], _nftID);
        listed[_nftID] = false;
    }

    function cancel(uint256 _nftID) public {
        require(msg.sender == seller[_nftID] || msg.sender == buyer[_nftID], "Only buyer or seller can cancel the deal");
        require(listed[_nftID], "Property is not listed");
        require(finalized[_nftID][seller[_nftID]], "Property is already sold");

        payable(buyer[_nftID]).transfer(escrowAmount[_nftID]);
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}