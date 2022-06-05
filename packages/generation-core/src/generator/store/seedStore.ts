import { createStore } from '@udecode/zustood';
import { NounSeed } from '@nouns/sdk';

export const defaultSeed: NounSeed = {
    volumeCount: 20,
    maxVolumeHeight: 6,
    waterFeatureCount: 7,
    grassFeatureCount: 7,
    treeCount: 11,
    bushCount: 50,
    peopleCount: 12,
    timeOfDay: 1,
    season: 1,
    greenRooftopP: 127,
    siteEdgeOffset: 0,
    orientation: 0,
};

export const seedSeparator = '_';

export const seedStore = createStore('seedStore')({
    seedString: '',
    seed: defaultSeed,
}).extendSelectors((_set, get) => ({
    originalSeed: () => parseInt(get.seedString().split(seedSeparator)[0], 16),
}));
