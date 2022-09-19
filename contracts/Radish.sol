// SPDX-License-Identifier: UNLICENSED
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
    uint public lockedTill;

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
    IUniswapV2Pair public uniswapV2Pair;
    // own LP counter since people can still
    // add liquidity from exchanges
    uint public totalLiquidityToken;
    // denominator is 1000 (0.66)
    uint public majorityPercentage = 660;

    mapping(uint => mapping(address => bool)) redistributed;
    uint private redistributionDuration = 7 days;
    uint private redistributionDate;
    uint private redistributionAmount;

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
        uint maximumContribution_
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
    }

    function _getProportionalAmount(address account, uint total) private view returns(uint) {
        return _water[account] * 1000 / totalWater * total / 1000;
    }

    function getOwnedLiquidity(address account) public view returns (uint) {
        return _getProportionalAmount(account, totalLiquidityToken);
    }

    // funding the launching project
    function water() external payable {
        require(maximumContribution <= msg.value && msg.value >= minimumContribution, "RADISH: value exceeds contribution range");
        require(endTime < block.timestamp && block.timestamp >= startTime, "RADISH: value outside of funding period");
        require(!ripe, "RADISH: radish is already ripe");
        require(withered == false, "RADISH: radish is withered");

        _water[msg.sender] += msg.value;
        totalWater += msg.value;

        if (totalWater >= hardCap) {
            ripe = true;
        }
    }

    function pluckRadish() external onlyOwner {
        withered == true;
    }

    // launching the project if funded
    function harvest(
        uint presaleRate_, // the amount of tokens a user receives for 1 evmos in presale
        uint listingRate_, // the amount of tokens a user receives for 1 evmos in exchange
        uint liquidityRate_, // the amount of evmos we use for liquidity
        uint lockedTill_
    ) external onlyOwner nonReentrant {
        require(!withered, "RADISH: radish already withered away");
        require(ripe || block.timestamp >= endTime, "RADISH: radish is not ripe and harvestingTime is not reached yet");

        if (totalWater < softCap) {
            withered = true;
            return;
        }

        // thanks solidity :)
        presaleRate = presaleRate_;
        listingRate = listingRate_;
        liquidityRate = liquidityRate_;
        lockedTill = lockedTill_;

        uint expectedETH = totalWater * liquidityRate / 100;
        // only supports tokens with 18 decimals
        uint expectedTOKEN = expectedETH * listingRate;
        uint tokenBalance = ERC20(token).balanceOf(address(this));
        require(expectedTOKEN >= tokenBalance, "RADISH: not enough token deposited");

        uniswapV2Pair = IUniswapV2Pair(uniswapV2Factory.createPair(token, uniswapV2Router.WETH()));

        (uint256 token0Reserve, uint256 token1Reserve,) = uniswapV2Pair.getReserves();
        if (token0Reserve != 0 || token1Reserve != 0) {
            withered = true;
            return;
        }

        uniswapV2Router.addLiquidityETH{value : totalWater}(
            token,
            expectedTOKEN,
            expectedTOKEN,
            totalWater,
            address(this),
            block.timestamp
        );

        redistributionDate = block.timestamp;
        totalLiquidityToken = uniswapV2Pair.totalSupply();
        emit Harvested(totalWater, block.timestamp);
    }

    // user withdraw if project failed
    function revokeWater() external onlyGardeners nonReentrant {
        require(block.timestamp > endTime, "RADISH: project is still in funding period");

        if (!withered) {
            if (softCap > totalWater || ((block.timestamp - endTime) > 7 days && totalLiquidityToken == 0)) {
                withered = true;
            }
        }

        require(withered, "RADISH: radish did not wither yet");
        payable(msg.sender).transfer(_water[msg.sender]);
    }

    // weekly manual redistribution for liquidity holders
    function withdrawRedistribution() external onlyGardeners {
        if (block.timestamp > (redistributionDate + redistributionDuration)) {
            redistributionDate = block.timestamp;
            redistributionAmount = ERC20(token).balanceOf(address(this));
        }

        require(redistributionAmount > 0, "RADISH: the redistribution period does not have any token");
        require(!redistributed[redistributionDate][msg.sender], "RADISH: already received redistribution");
        uint partialRedistribution = _getProportionalAmount(msg.sender, redistributionAmount);
        ERC20(token).transfer(msg.sender, partialRedistribution);
    }

    // dao methods for gardeners(funders)
    function initiateWithdrawVote() external onlyGardeners {
        require(totalLiquidityToken != 0, "RADISH: project did not launch yet");
        require(block.timestamp > lockedTill, "RADISH: liquidity is still locked");
        require(_currentVote.timestamp == 0, "RADISH: project has already an ongoing voting");

        _currentVote = Voting(
            block.timestamp,
            0, // positive
            0, // negative
            0, // stateNumber for other votes
            VotingType.WITHDRAW
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
            VotingType.EXTEND
        );
    }

    function voteWithdrawLiquidity(bool voteState) external onlyGardeners {
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

    function voteExtendLockingPeriod(bool voteState) external onlyGardeners {
        require(_currentVote.timestamp != 0, "RADISH: no ongoing voting");
        require(_currentVote.votingType == VotingType.EXTEND, "RADISH: wrong voting");
        appendVote(msg.sender, voteState);

        if (_isPositiveOutcome()) {
            lockedTill = _currentVote.stateNumber;
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

    function _isPositiveOutcome() internal view returns (bool) {
        uint positiveWeight = _currentVote.positiveVotes * 1000 / totalLiquidityToken;
        return positiveWeight >= majorityPercentage;
    }

    function _isNegativeOutcome() internal view returns (bool) {
        uint negativeWeight = _currentVote.negativeVotes * 1000 / totalLiquidityToken;
        return negativeWeight >= majorityPercentage;
    }
}
