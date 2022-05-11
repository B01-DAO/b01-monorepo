// SPDX-License-Identifier: GPL-3.0

/// @title Interface for Nouns Raffle

pragma solidity ^0.8.6;

interface INounsRaffle {
    function draw() external view returns (address);
}
