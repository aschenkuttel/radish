pragma solidity ^0.8.0;

import "./Radish.sol";
import "./Ownable.sol";
import "./ERC20.sol";

contract Garden is Ownable {
    mapping(address => address) private _growingRadishes;

    address factoryAddress;
    address routerAddress;

    uint private constant evmosDecimals = 18;
    uint public launchFee = 50 * (10 ** evmosDecimals);
    uint public tokenFee = 20 * (10 ** evmosDecimals);

    event RadishPlanted(address owner, uint timestamp);

    constructor(address factoryAddress_, address routerAddress_) {
        factoryAddress = factoryAddress_;
        routerAddress = routerAddress_;
    }

    function createRadish(
        address token,
        uint softCap,
        uint hardCap,
        uint startTime,
        uint endTime,
        uint minimumContribution,
        uint maximumContribution,
        uint presaleRate, // token per evmos
        uint listingRate, // token per evmos
        uint liquidityRate, //
        uint lockDuration
    ) external payable {
        require(msg.value >= launchFee, "RADISH: missing launch fee");
        require(_growingRadishes[msg.sender] == address(0), "RADISH: caller has active launch");

        _createRadish(
            msg.sender,
            token,
            softCap,
            hardCap,
            startTime,
            endTime,
            minimumContribution,
            maximumContribution,
            presaleRate,
            listingRate,
            liquidityRate,
            lockDuration
        );
    }

    function createTokenAndRadish(
        string memory name,
        string memory symbol,
        uint totalSupply,
        uint softCap,
        uint hardCap,
        uint startTime,
        uint endTime,
        uint minimumContribution,
        uint maximumContribution,
        uint presaleRate, // token per evmos
        uint listingRate, // token per evmos
        uint liquidityRate,
        uint lockDuration
    ) external payable {
        require(msg.value >= (launchFee + tokenFee), "RADISH: missing launch+token fee");
        require(_growingRadishes[msg.sender] == address(0), "RADISH: caller has active launch");

        ERC20 createdToken = new ERC20(msg.sender, name, symbol, totalSupply);
        _createRadish(
            msg.sender,
            address(createdToken),
            softCap,
            hardCap,
            startTime,
            endTime,
            minimumContribution,
            maximumContribution,
            presaleRate,
            listingRate,
            liquidityRate,
            lockDuration
        );

    }

    function _createRadish(
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
    ) internal {
        require((startTime - block.timestamp) > 7 days, "RADISH: startTime can't be more than 7 days from now");
        require(7 days > (endTime - startTime), "RADISH: duration can't exceed 7 days");

        Radish plantedRadish = new Radish(
            creator,
            token,
            softCap,
            hardCap,
            startTime,
            endTime,
            minimumContribution,
            maximumContribution,
            presaleRate,
            listingRate,
            liquidityRate,
            lockDuration
        );

        _growingRadishes[msg.sender] = address(plantedRadish);
        emit RadishPlanted(msg.sender, block.timestamp);
    }

    function getRadish(address owner) external view returns(address) {
        return _growingRadishes[msg.sender];
    }

    function setRadishPrice(uint newPrice) onlyOwner {
        launchPrice = newPrice;
    }

    function setTokenPrice(uint newPrice) onlyOwner {
        tokenPrice = newPrice;
    }

}
