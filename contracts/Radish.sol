pragma solidity ^0.8.0;

import "./Ownable.sol";

contract Radish is Ownable {
    mapping(address => uint) private _funds;
    bool public ripe; // launch succeeded

    constructor(
        address creator,
        address token,
        uint softCap,
        uint hardCap,
        uint startTime,
        uint endTime,
        uint minimumContribution,
        uint maximumContribution,
        uint presaleRate,
        uint listingRate,
        uint liquidityRate,
        uint lockDuration
    ) {
        _transferOwnership(creator);
    }

    // funding the launching project
    function water() external onlyOwner {

    }

    // launching the project if funded
    function harvest() external onlyOwner {
        require(ripe, "RADISH: radish is not ripe yet");
    }

}
