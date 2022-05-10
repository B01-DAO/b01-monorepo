import { INounsSeeder } from '@nouns/contracts/typechain-types/INounsToken';
import { NounSeed } from './types';

export const convertContractSeedToSeed = (cSeed: INounsSeeder.SeedStruct): NounSeed => ({
  volumeCount: Number(cSeed.volumeCount),
  maxVolumeHeight: Number(cSeed.maxVolumeHeight),
  waterFeatureCount: Number(cSeed.waterFeatureCount),
  grassFeatureCount: Number(cSeed.grassFeatureCount),
  treeCount: Number(cSeed.treeCount),
  bushCount: Number(cSeed.bushCount),
  peopleCount: Number(cSeed.peopleCount),
  lighting: Number(cSeed.lighting),
  season: Number(cSeed.season),
  environment: Number(cSeed.environment),
  greenRooftopP: Number(cSeed.greenRooftopP),
  siteEdgeOffset: cSeed.siteEdgeOffset,
  orientation: cSeed.orientation,
});
