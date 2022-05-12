// SPDX-License-Identifier: GPL-3.0

/// @title The Nouns Raffle contract

pragma solidity ^0.8.6;

import 'hardhat/console.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { INounsRaffle } from './interfaces/INounsRaffle.sol';
import { RandomUtils } from './library/RandomUtils.sol';

contract NounsRaffleV1 is INounsRaffle, Ownable {
    // The Oldies address
    address public oldiesDAO;

    // The Nounders address
    address public noundersDAO;

    // List of charity addresses
    address[] public charities;

    // Oldies probability
    uint8 public oldiesDAOP;

    // Nounders probability
    uint8 public noundersDAOP;

    // Charity probability
    uint8 public charityP;

    // Burn probaility
    uint8 public burnP;

    constructor(
        address _oldiesDAO,
        address _noundersDAO,
        address[] memory _charities,
        uint8 _burnP,
        uint8 _oldiesDAOP,
        uint8 _noundersDAOP,
        uint8 _charityP
    ) {
        oldiesDAO = _oldiesDAO;
        noundersDAO = _noundersDAO;
        charities = _charities;
        burnP = _burnP;
        oldiesDAOP = _oldiesDAOP;
        noundersDAOP = _noundersDAOP;
        charityP = _charityP;
    }

    /**
     * @notice Draw a winner from the raffle.
     */
    function draw() external view override returns (address winner) {
        uint256 pr = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1))));

        uint8 _percentage = RandomUtils.randomUint8InRange(pr, 1, 100);
        if (_percentage <= burnP) {
            winner = address(0);
        } else if (_percentage <= burnP + oldiesDAOP) {
            winner = oldiesDAO;
        } else if (_percentage <= burnP + oldiesDAOP + noundersDAOP) {
            winner = noundersDAO;
        } else {
            uint8 length = uint8(charities.length);
            if (length == 0) {
                winner = address(0);
            } else {
                uint8 _charityIndex = RandomUtils.randomUint8InRange(pr >> 16, 0, length - 1);
                winner = charities[_charityIndex];
            }
        }
    }
}
