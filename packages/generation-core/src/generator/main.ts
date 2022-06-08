import { NounSeed } from '@nouns/sdk';

import { mainStore, MainStore } from './store/mainStore';
import { buildDriveway } from './driveWay';
import { addTree } from './tree';
import { addBush } from './bush';
import { addBuilding } from './building';
import { baseScene, initScene } from './base';
import { addWaterFeature } from './waterfeature';
import { addGrassFeature } from './grassFeature';
import { addRandomPerson } from './person';
import { customRandom, randomizeSeed, deterministicRandom } from './helpers/math';
import { buildRainbow, buildStars } from './site';
import { landscapeStore } from './store/landscapeStore';
import { buildRocket } from './rocket';
import { addFish } from './fish';
import { environmentStore } from './store/environmentStore';
import { buildSubmarine } from './submarine';
import { buildBoat } from './sailboat';
import { addCloud } from './clouds';
import { EnvironmentTypes, envWithBase, envWithWater } from './constants/environmentConstants';
import { buildAsteroid } from './asteroids';
import { seedStore } from './store/seedStore';

export function startGenerating(
    store: MainStore,
    { seed = {} as Partial<NounSeed>, rawSeed = '' } = {},
) {
    mainStore.set.state(defaults => ({ ...defaults, ...store }));
    const newSeed: NounSeed = { ...seedStore.get.seed(), ...seed };

    if (rawSeed && rawSeed.length > 4) {
        seedStore.set.seedString(rawSeed);

        const originalSeed = seedStore.get.originalSeed();

        if (originalSeed > 5) {
            seedStore.set.seed({
                ...newSeed,
                greenRooftopP: deterministicRandom(originalSeed)() * 127.5,
            });
        }
    } else {
        seedStore.set.seed(newSeed);
        randomizeSeed();
    }
}

export function buildModel() {
    initScene();

    switch (environmentStore.get.currentEnvironment()) {
        case EnvironmentTypes.onWater:
            buildBoat();
            break;
        case EnvironmentTypes.underWater:
            baseScene.add(buildSubmarine());
            break;
        default:
            baseScene.add(buildRocket());
    }

    for (let i = 0; i < seedStore.get.seed().volumeCount; i++) addBuilding();

    buildDriveway();

    if (environmentStore.get.currentEnvironment() !== EnvironmentTypes.underWater) {
        if (customRandom() < 0.5) {
            buildRainbow();
        }
        if (customRandom() < 0.5) {
            buildStars();
        }
    }

    for (let i = 0; i < 10; i++) {
        addWaterFeature();
        addGrassFeature();
    }

    if (envWithBase.some(env => environmentStore.get.currentEnvironment() === env)) {
        for (let i = 0; i < landscapeStore.get.treeCount(); i++) addTree();
        const bushCount = customRandom() * 100;
        for (let i = 0; i < bushCount; i++) {
            addBush(true);
        }
    }

    for (let i = 0; i < 20; i++) {
        addRandomPerson();
    }

    if (envWithWater.some(env => env === environmentStore.get.currentEnvironment())) {
        for (let i = 0; i < 100; i++) {
            addFish();
        }
    }

    if (environmentStore.get.currentEnvironment() === EnvironmentTypes.clouds) {
        for (let i = 0; i < 40; i++) {
            addCloud();
        }
    }
    if (environmentStore.get.currentEnvironment() === EnvironmentTypes.space) {
        for (let i = 0; i < 40; i++) {
            buildAsteroid();
        }
    }
}
