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

    modifier onlyGardeners() {
        require(_water[msg.sender] > 0);
        _;
    }

    // liquidity period
    IUniswapV2Factory public immutable uniswapV2Factory;
    IUniswapV2Router02 public immutable uniswapV2Router;
    IUniswapV2Pair public immutable uniswapV2Pair;
    // own LP counter since people can still
    // add liquidity from exchanges
    uint public totalLiquidityToken;
    // denominator is 1000 (0.66)
    uint public majorityPercentage = 660;

    enum VotingType {WITHDRAW, EXTEND}

    struct Voting {
        uint timestamp;
        uint positiveVotes;
        uint negativeVotes;
        uint stateNumber;
        VotingType votingType;
    }

    Voting private _currentVote;

    event Harvested(uint totalWater, uint timestamp);

    modifier onlyCurrentGardeners() {
        require(uniswapV2Pair.balanceOf(msg.sender) > 0, "");
        _;
    }

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
        uniswapV2Pair = uniswapV2Factory.createPair(token, uniswapV2Router.WETH());

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

    function getOwnedLiquidity(address account) external view returns (uint) {
        return water[account] * 1000 / totalWater * totalLiquidityToken / 1000;
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

        (uint256 token0Reserve, uint256 token1Reserve,) = uniswapV2Pair.getReserves();
        if (token0Reserve == 0 && token1Reserve == 0) {
            withered = true;
        }

        uniswapV2Router.addLiquidityETH{value : totalWater}(
            token,
            expectedTOKEN,
            expectedTOKEN,
            totalWater,
            address(this),
            block.timestamp
        );

        totalLiquidityToken = uniswapV2Pair.totalSupply();
        emit Harvested(totalWater, block.timestamp);
    }

    // user withdraw if project failed
    function revokeWater() external onlyGardeners nonReentrant {
        if (block.timestamp >= endTime && softCap > totalWater) {
            withered = true;
        }

        require(withered, "RADISH: radish did not wither yet");
        payable(msg.sender).transfer(_funds[msg.sender]);
    }

    // dao methods for gardeners(funders)
    function initiateWithdrawVote() external onlyGardeners {
        require(totalLiquidityToken != 0, "RADISH: project did not launch yet");
        require(_currentVote.timestamp == 0, "RADISH: project has already an ongoing voting");

        _currentVote = Voting(
            block.timestamp,
            0, // positive
            0, // negative
            0, // stateNumber for other votes
            votingType_
        );
    }

    function initiateExtendVote(uint extendablePeriod) external onlyGardeners {
        require(totalLiquidityToken != 0, "RADISH: project did not launch yet");
        require(_currentVote.timestamp == 0, "RADISH: project has already an ongoing voting");

        _currentVote = Voting(
            block.timestamp,
            0,
            0,
            extendablePeriod,
            votingType_
        );
    }

    function withdrawLiquidity(bool voteState) external onlyGardeners {
        require(_currentVote.timestamp != 0, "RADISH: no ongoing voting");
        require(_currentVote.votingType == VotingType.WITHDRAW, "RADISH: wrong voting");
        appendVote(msg.sender, voteState);

        if (_isPositiveOutcome()) {
            withered = true;
            delete _currentVote;
        } else if (_isNegativeOutcome()) {
            delete _currentVote;
        }

    }

    function extendLockingPeriod(bool voteState) external onlyGardeners {
        require(_currentVote.timestamp != 0, "RADISH: no ongoing voting");
        require(_currentVote.votingType == VotingType.EXTEND, "RADISH: wrong voting");
        appendVote(msg.sender, voteState);

        if (_isPositiveOutcome()) {
            lockDuration += _currentVote.stateNumber;
            delete _currentVote;
        } else if (_isNegativeOutcome()) {
            delete _currentVote;
        }
    }

    function appendVote(address account, bool voteState) internal {
        uint votingPower = getOwnedLiquidity(account);

        if (voteState) {
            _currentVote.positiveVotes += votingPower;
        } else {
            _currentVote.negativeVotes += votingPower;
        }
    }

    function _isPositiveOutcome() internal returns (bool) {
        uint positiveWeight = _currentVote.positiveVotes * 1000 / totalLiquidityToken;
        return positiveWeight >= majorityPercentage;
    }

    function _isNegativeOutcome() internal returns (bool) {
        uint negativeWeight = _currentVote.negativeVotes * 1000 / totalLiquidityToken;
        return negativeWeight >= majorityPercentage;
    }
}
