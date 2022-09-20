// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Radish.sol";

/*
DISCLAIMER: WE CURRENTLY ONLY SUPPORT 18 DECIMAL
            AND NON SELF REDUCING ASSETS
*/

contract Garden is Ownable {
    mapping(address => address) private _growingRadishes;

    address factoryAddress;
    address routerAddress;

    uint private constant evmosDecimals = 18;
    uint public launchFee = 0 * (10 ** evmosDecimals);
    uint public tokenFee = 0 * (10 ** evmosDecimals);

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
        uint maximumContribution
    ) external payable {
        require(msg.value >= launchFee, "RADISH: missing launch fee");
        require(_growingRadishes[msg.sender] == address(0), "RADISH: caller has active launch");
        require(ERC20(token).decimals() == evmosDecimals, "RADISH: token needs 18 decimals");

        _createRadish(
            msg.sender,
            token,
            softCap,
            hardCap,
            startTime,
            endTime,
            minimumContribution,
            maximumContribution
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
        uint maximumContribution
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
            maximumContribution
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
        uint maximumContribution
    ) internal {
        require(startTime > block.timestamp, "RADISH: startTime needs to be in future");
        require((startTime - block.timestamp) < 7 days, "RADISH: startTime has to be in 7 days");
        require((endTime - startTime) < 7 days, "RADISH: duration can't exceed 7 days");

        Radish plantedRadish = new Radish(
            factoryAddress,
            routerAddress,
            creator,
            token,
            softCap,
            hardCap,
            startTime,
            endTime,
            minimumContribution,
            maximumContribution
        );

        _growingRadishes[msg.sender] = address(plantedRadish);
        emit RadishPlanted(msg.sender, block.timestamp);
    }

    function getRadish(address owner) external view returns(address) {
        return _growingRadishes[owner];
    }

    function setRadishPrice(uint newFee) external onlyOwner {
        launchFee = newFee;
    }

    function setTokenPrice(uint newFee) external onlyOwner {
        tokenFee = newFee;
    }
}
