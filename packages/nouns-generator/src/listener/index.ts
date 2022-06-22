import { BigNumber } from 'ethers';
import { INounsSeeder } from '@nouns/contracts/dist/typechain-types/INounsToken';
import { generateSafe } from '../handlers';
import { nounsTokenContract } from './../clients';
import { NounSeed } from '@nouns/sdk';

const nounCreatedHandler = (nounId: BigNumber, seed: INounsSeeder.SeedStructOutput) => {
  // run generate
  console.log('Noun created', nounId, seed);
  console.log('Running generator');

  // convert to NounSeed
  const nounSeed: NounSeed = {
    volumeCount: seed.volumeCount,
    maxVolumeHeight: seed.maxVolumeHeight,
    waterFeatureCount: seed.waterFeatureCount,
    grassFeatureCount: seed.grassFeatureCount,
    treeCount: seed.treeCount,
    bushCount: seed.bushCount,
    peopleCount: seed.peopleCount,
    timeOfDay: seed.timeOfDay,
    season: seed.season,
    greenRooftopP: seed.greenRooftopP,
    siteEdgeOffset: seed.siteEdgeOffset,
    orientation: seed.orientation,
  };

  generateSafe(nounId.toNumber(), nounSeed);
};

export const startListener = () => {
  if (nounsTokenContract.listenerCount('NounCreated') === 0) {
    console.log('Starting event listener');
    nounsTokenContract.on('NounCreated', nounCreatedHandler);
  } else {
    console.log('Listener already started');
  }
};
export const stopListener = () => {
  console.log('Stopping event listener');
  nounsTokenContract.removeAllListeners('NounCreated');
};
