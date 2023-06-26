// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EthReState is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("EthReState", "ERS") {}

    function mint(string memory tokenURI) public returns (uint256) {
        uint256 tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        _tokenIds.increment();
        return tokenId;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}