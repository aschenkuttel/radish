pragma solidity ^0.8.0;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Uniswap.sol";
import "./ERC20.sol";

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
    IUniswapV2Factory public immutable uniswapV2Factory;
    IUniswapV2Router02 public immutable uniswapV2Router;
    uint public totalLiquidity;

    event Harvested(uint totalWater, uint timestamp);

    // contract needs to be able to receive evmos
    receive() external payable {}

    constructor(
        address factoryAddress,
        address routerAddress,
        address creator_,
        address token_,
        uint softCap_,
        uint hardCap_,
        uint startTime_,
        uint endTime_,
        uint minimumContribution_,
        uint maximumContribution_,
        uint presaleRate_, // the amount of tokens a user receives for 1 evmos in presale
        uint listingRate_, // the amount of tokens a user receives for 1 evmos in exchange
        uint liquidityRate_, // the amount of evmos we use for liquidity
        uint lockDuration_
    ) {
        // owner needs to be transferred since
        // garden deployed radish contract
        _transferOwnership(creator_);
        uniswapV2Factory = IUniswapV2Factory(factoryAddress);
        uniswapV2Router = IUniswapV2Router02(routerAddress);

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

    function getOwnedLiquidity() external view returns(uint) {
        return water[msg.sender] * 1000 / totalWater * totalLiquidity / 1000;
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

        uint expectedETH = totalWater * liquidityRate / 100;
        uint expectedTOKEN = expectedETH * listingRate;
        uint tokenBalance = ERC20(token).balanceOf(address(this));
        require(expectedTOKEN >= tokenBalance, "RADISH: not enough token deposited");

        IUniswapV2Pair createdPair = uniswapV2Factory.getPair(token, uniswapV2Router.WETH());

        if (address(createdPair) != address(0)) {
            (uint256 token0Reserve, uint256 token1Reserve,) = liquidityPair.getReserves();
            if (token0Reserve == 0 && token1Reserve == 0) {
                withered = true;
            }
        }
 
        uniswapV2Router.addLiquidityETH{value:totalWater}(
            token,
            expectedTOKEN,
            expectedTOKEN,
            totalWater,
            address(this),
            block.timestamp
        );

        totalLiquidity = createdPair.totalSupply();
        emit Harvested(totalWater, block.timestamp);
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
