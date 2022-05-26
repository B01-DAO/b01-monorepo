import { createStore } from '@udecode/zustood';

export const seedSeparator = '_';

export const seedStore = createStore('seedStore')({ seedString: '' }).extendSelectors(
	(_set, get, _api) => ({
		originalSeed: () => parseInt(get.seedString().split(seedSeparator)[0], 16)
	})
);