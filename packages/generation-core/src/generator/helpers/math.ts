import * as THREE from 'three';

import getRandomValues from 'get-random-values';
import { seedSeparator, seedStore } from '../store/seedStore';
import { buildingStore } from '../store/buildingStore';
import { currentVersion } from '../constants/buildingConstants';
import { seasonList } from '../constants/seasons';
import { lightParameterList } from '../constants/lightConstants';
import { landscapeStore } from '../store/landscapeStore';
import { SpecialShapeTypes, TreeTypes } from '../constants/constants';
import { environmentStore } from '../store/environmentStore';
import { EnvironmentTypes } from '../constants/environmentConstants';
import { buildModel } from '../main';
import { initBaseScene } from '../base';

export let customRandom: () => number;
export let buildingRandom: () => number;

seedStore.store.subscribe(() => {
    const seed = seedStore.get.originalSeed();
    initBaseScene();
    window.history?.replaceState(null, window.location.href, '?seed=' + seedStore.get.seedString());

    if (seed > 5) {
        customRandom = deterministicRandom(seed);
        buildingRandom = deterministicRandom(seed);

        const defaultY = (0.5 - buildingRandom()) * 10;
        const color = randomColor(buildingRandom);
        const maxHeight = randomRange(buildingRandom(), 3, 8);
        let treeType = TreeTypes.Sphere;
        if (customRandom() < 0.5) {
            treeType = TreeTypes.Cone;
        }

        buildingStore.set.buildingColor(color);
        buildingStore.set.defaultWidth(randomRange(buildingRandom(), 0.1, 0.2));
        buildingStore.set.defaultHeight(
            Math.floor(randomRange(buildingRandom(), 1, maxHeight * 0.8)) * 0.1,
        );
        buildingStore.set.defaultLength(randomRange(buildingRandom(), 0.1, 0.2));
        buildingStore.set.rotateYProbability(buildingRandom() * 0.5);
        buildingStore.set.tripleSizeProbability(randomRange(buildingRandom(), 0, 0.3));
        buildingStore.set.allVolumesSameSize(buildingRandom() < 0.5);
        buildingStore.set.greenRoofProbability(buildingRandom() * 0.5);
        buildingStore.set.cylinderProbability(buildingRandom() * 0.5);
        buildingStore.set.hasCylinders(buildingRandom() < 0.5);
        buildingStore.set.dodecahedronProbability(buildingRandom() * 0.2);
        buildingStore.set.hasDodecahedron(buildingRandom() < 0.5);
        buildingStore.set.maxHeight(maxHeight);
        buildingStore.set.hasPitchedRoofs(buildingRandom() < 0.5);
        const specialShapeRandomValue = buildingRandom();
        if (specialShapeRandomValue < 0.5) {
            buildingStore.set.specialShape(SpecialShapeTypes.dodecahedron);
        } else {
            buildingStore.set.specialShape(SpecialShapeTypes.capsule);
        }

        landscapeStore.set.treeCount(randomRange(customRandom(), 0, 200));
        landscapeStore.set.treeType(Math.floor(randomRange(customRandom(), 0, 2)));
        landscapeStore.set.treeType(treeType);
        landscapeStore.set.treeScale(randomRange(customRandom(), 0.3, 1));
        const lightingName =
            lightParameterList[
                Math.floor(randomRange(customRandom(), 0, lightParameterList.length - 0.1))
            ].name;
        environmentStore.set.currentLightingName(lightingName);

        const envList = [
            EnvironmentTypes.underWater,
            EnvironmentTypes.onWater,
            EnvironmentTypes.land,
            EnvironmentTypes.clouds,
            EnvironmentTypes.space,
        ];
        const selectedEnv = envList[randomIndex(envList.length)];
        environmentStore.set.currentEnvironment(selectedEnv);
        const seasonName = seasonList[randomIndex(seasonList.length)].name;
        environmentStore.set.currentSeasonName(seasonName);

        buildingStore.set.globalDefaultY(defaultY);

        buildModel();
    }
});

export function randomRange(randomValue: number, min: number, max: number) {
    return randomValue * (max - min) + min;
}

export function randomIndex(maxValue: number) {
    return Math.floor(randomRange(customRandom(), 0, maxValue - 0.1));
}

export function getPointOfClosestBox(point: THREE.Vector3, boundingBoxes: THREE.Box3[]) {
    let closestBox: THREE.Box3;
    let closestDistance = 1000;

    boundingBoxes.forEach(box => {
        if (box.distanceToPoint(point) < closestDistance) {
            closestBox = box;
            closestDistance = box.distanceToPoint(point);
        }
    });

    const lineEnd = new THREE.Vector3();
    closestBox?.getCenter(lineEnd);

    return lineEnd;
}

export function deterministicRandom(originalSeed: number) {
    let seed = originalSeed; //0x2F6E2B1;
    return function () {
        // Robert Jenkins’ 32 bit integer hash function
        seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff;
        seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff;
        seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff;
        seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
        seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff;
        seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff;
        const randomValue = Math.round(((seed & 0xfffffff) / 0x10000000) * 100) / 100;

        return randomValue;
    };
}

export function randomizeSeed() {
    let seed = 0;
    while (seed === 0) {
        // sometimes a seed of 0 is generated, this loop prevents seed value of 0
        const randomSeed = new Uint8Array(3);
        getRandomValues(randomSeed);
        seed = randomSeed[0] * randomSeed[1] * randomSeed[2];
    }
    const seedStringValue = seed.toString(16);

    seedStore.set.seedString(seedStringValue + seedSeparator + currentVersion);
}

// export function randomValueFromList(randValue: number, enumClass) {
// 	const index = Math.floor(randomRange(randValue, 0, enumArray.length));
// 	return enumArray[index];
// }

export function randomColor(randomnessFunction: () => number) {
    let randomValue = 0;
    while (randomValue < 0.1 || randomValue > 0.9) {
        // eliminating all black and all white
        randomValue = randomnessFunction();
    }
    return Math.floor(randomValue * 16777215).toString(16);
}
