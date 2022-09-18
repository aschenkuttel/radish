pragma solidity ^0.8.0;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";

contract Radish is Ownable, ReentrancyGuard {
    address token;
    uint public softCap;
    uint public hardCap;
    uint public startTime;
    uint public endTime;
    uint public minimumContribution;
    uint public maximumContribution;
    uint private presaleRate;
    uint private listingRate;
    uint private liquidityRate;
    uint public lockDuration;

    // growing period
    mapping(address => uint) private _water;
    uint public totalWater;
    bool public ripe; // launch succeeded
    bool public withered; // launch failed

    modifier onlyGardener() {
        require(_water[msg.sender] > 0);
        _;
    }

    // liquidity period
    mapping(address => uint) private _liquidity;

    // contract needs to be able to receive evmos
    receive() external payable {}

    constructor(
        address creator_,
        address token_,
        uint softCap_,
        uint hardCap_,
        uint startTime_,
        uint endTime_,
        uint minimumContribution_,
        uint maximumContribution_,
        uint presaleRate_,
        uint listingRate_,
        uint liquidityRate_,
        uint lockDuration_
    ) {
        // owner needs to be transferred since
        // garden deployed radish contract
        _transferOwnership(creator_);
        token = token_;
        softCap = softCap_;
        hardCap = hardCap_;
        startTime = startTime_;
        endTime = endTime_;
        minimumContribution = minimumContribution_;
        maximumContribution = maximumContribution_;
        presaleRate = presaleRate_;
        listingRate = listingRate_;
        liquidityRate = liquidityRate_;
        lockDuration = lockDuration_;
    }

    // funding the launching project
    function water() external payable {
        require(maximumContribution >= msg.value >= minimumContribution, "RADISH: value exceeds contribution range");
        require(endTime > block.timestamp > startTime, "RADISH: ");
        require(!ripe, "RADISH: radish is already ripe");

        _water[msg.sender] += msg.value;
        totalWater += msg.value;

        if (totalWater >= hardCap) {
            ripe = true;
        }
    }

    // launching the project if funded
    function harvest() external onlyOwner nonReentrant {
        require(!withered, "RADISH: radish already withered away");
        require(ripe || block.timestamp >= endTime, "RADISH: radish is not ripe and harvestingTime is not reached yet");


    }

    // user withdraw if project failed
    function revokeWater() external onlyGardener nonReentrant {
        if (block.timestamp >= endTime && softCap > totalWater) {
            withered = true;
        }

        require(withered, "RADISH: radish did not wither yet");
        payable(msg.sender).transfer(_funds[msg.sender]);
    }

}
