import { INounsSeeder } from '@nouns/contracts/dist/typechain-types/INounsToken';
import { NounSeed } from './types';

export const convertContractSeedToSeed = (cSeed: INounsSeeder.SeedStruct): NounSeed => ({
    volumeCount: Number(cSeed.volumeCount),
    maxVolumeHeight: Number(cSeed.maxVolumeHeight),
    waterFeatureCount: Number(cSeed.waterFeatureCount),
    grassFeatureCount: Number(cSeed.grassFeatureCount),
    treeCount: Number(cSeed.treeCount),
    bushCount: Number(cSeed.bushCount),
    peopleCount: Number(cSeed.peopleCount),
    timeOfDay: Number(cSeed.timeOfDay),
    season: Number(cSeed.season),
    greenRooftopP: Number(cSeed.greenRooftopP),
    siteEdgeOffset: cSeed.siteEdgeOffset,
    orientation: cSeed.orientation,
});
