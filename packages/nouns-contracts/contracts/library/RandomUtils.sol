// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

library RandomUtils {
    function randomUint8InRange(
        uint256 randomValue,
        uint8 min,
        uint8 max
    ) internal pure returns (uint8 value) {
        return uint8(randomUint256InRange(randomValue, min, max));
    }

    function randomUint256InRange(
        uint256 randomValue,
        uint256 min,
        uint256 max
    ) internal pure returns (uint256 value) {
        return (randomValue % (max - min + 1)) + min;
    }
}
