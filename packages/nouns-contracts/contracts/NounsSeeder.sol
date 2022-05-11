// SPDX-License-Identifier: GPL-3.0

/// @title The NounsToken pseudo-random seed generator

pragma solidity ^0.8.6;

import 'hardhat/console.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { RandomUtils } from './library/RandomUtils.sol';

contract NounsSeeder is INounsSeeder {
    /**
     * @notice Generate a pseudo-random Nouns seed using the previous blockhash and nouns ID.
     */
    function generateSeed(uint256 nounId, INounsDescriptor descriptor) external view override returns (Seed memory) {
        uint256 pr = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), nounId)));

        INounsDescriptor.AttributeRanges memory ranges = descriptor.getAttributeRanges();
        INounsSeeder.Seed memory seed;

        seed.volumeCount = RandomUtils.randomUint8InRange(
            pr >> (16 * 0),
            ranges.volumeCountRange[0],
            ranges.volumeCountRange[1]
        );

        seed.maxVolumeHeight = RandomUtils.randomUint8InRange(
            pr >> (16 * 1),
            ranges.maxVolumeHeightRange[0],
            ranges.maxVolumeHeightRange[1]
        );

        seed.waterFeatureCount = RandomUtils.randomUint8InRange(
            pr >> (16 * 2),
            ranges.waterFeatureCountRange[0],
            ranges.waterFeatureCountRange[1]
        );

        seed.grassFeatureCount = RandomUtils.randomUint8InRange(
            pr >> (16 * 3),
            ranges.grassFeatureCountRange[0],
            ranges.grassFeatureCountRange[1]
        );

        seed.treeCount = RandomUtils.randomUint8InRange(
            pr >> (16 * 4),
            ranges.treeCountRange[0],
            ranges.treeCountRange[1]
        );

        seed.bushCount = RandomUtils.randomUint8InRange(
            pr >> (16 * 5),
            ranges.bushCountRange[0],
            ranges.bushCountRange[1]
        );

        seed.peopleCount = RandomUtils.randomUint8InRange(
            pr >> (16 * 6),
            ranges.peopleCountRange[0],
            ranges.peopleCountRange[1]
        );

        seed.lighting = RandomUtils.randomUint8InRange(
            pr >> (16 * 7),
            ranges.lightingRange[0],
            ranges.lightingRange[1]
        );

        seed.season = RandomUtils.randomUint8InRange(pr >> (16 * 8), ranges.seasonRange[0], ranges.seasonRange[1]);

        seed.environment = RandomUtils.randomUint8InRange(
            pr >> (16 * 9),
            ranges.environmentRange[0],
            ranges.environmentRange[1]
        );

        seed.greenRooftopP = RandomUtils.randomUint8InRange(
            pr >> (16 * 10),
            ranges.greenRooftopPRange[0],
            ranges.greenRooftopPRange[1]
        );

        seed.siteEdgeOffset = RandomUtils.randomUint256InRange(
            pr >> (16 * 11),
            ranges.siteEdgeOffsetRange[0],
            ranges.siteEdgeOffsetRange[1]
        );

        seed.orientation = RandomUtils.randomUint256InRange(
            pr >> (16 * 12),
            ranges.orientationRange[0],
            ranges.orientationRange[1]
        );

        return seed;
    }
}
