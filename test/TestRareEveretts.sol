pragma solidity >=0.4.22 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RareEveretts.sol";

contract TestRareEveretts {
    RareEveretts rareEvs = RareEveretts(DeployedAddressed.RareEveretts());

    function testMint() public {
        rareEvs.mint("test://token.uri");    
    }
}
