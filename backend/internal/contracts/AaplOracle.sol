// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {IOracle} from "src/interfaces/IOracle.sol";
import {AggregatorV3Interface} from "src/interfaces/AggregatorV3Interface.sol";

// This is am modified version of the AAPL price oracle, it is normalized to 36 decimal places for compactibility with our market
contract AaplUsdOracle is IOracle {
    AggregatorV3Interface public priceFeed;

    constructor(address _priceFeed) {
        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getPrice() public view returns (uint256) {
        (, int256 _price,,,) = priceFeed.latestRoundData();
        require(_price > 0, "Invalid price");
        return uint256(_price);
    }

    function decimals() external view returns (uint8) {
        return priceFeed.decimals();
    }

    function adjustedDecimals() external pure returns (uint8) {
        return 36;
    }

    function price() external view override returns (uint256) {
        uint256 origPrice = getPrice();
        uint256 adjustedPrice = origPrice * 10 ** 35;
        return adjustedPrice;
    }
}
