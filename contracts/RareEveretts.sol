// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RareEveretts is ERC721 {
    uint256 public tokenCounter;

    struct Auth {
        bool canMint;
        bool isAdmin;
    }

    mapping(address => Auth) private userAuth;
    string private baseURI;

    constructor() ERC721("RareEveretts", "REVS") {
        tokenCounter = 0;
        userAuth[msg.sender] = Auth(true, true);
        baseURI = "http://samramirez.io/RareEveretts/";
    }

    function getTokenCounter() public view virtual returns (uint256) {
        return tokenCounter;
    }

    function _baseURI() override internal view virtual returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory newURI) public returns (string memory) {
        require(_isAdmin());
        baseURI = newURI;
        return baseURI;
    }

    function mint(/*string memory tokenURI*/) public returns (uint256) {
        require(canMint());
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        // _setTokenURI(newTokenId, tokenURI);
        tokenCounter = tokenCounter + 1;
        return newTokenId;
    }

    function canMint() public view returns (bool) {
        return userAuth[msg.sender].canMint;
    }

    function _isAdmin() internal view returns (bool) {
        return userAuth[msg.sender].isAdmin;
    }

    function setAdminAuth(address addr, bool isAdmin) public returns (bool) {
        require(_isAdmin());
        userAuth[addr].isAdmin = isAdmin;
        return userAuth[addr].isAdmin;
    }

    function setMintAuth(address addr, bool _canMint) public returns (bool) {
        require(_isAdmin());
        userAuth[addr].canMint = _canMint;
        return userAuth[addr].canMint;
    }
}
