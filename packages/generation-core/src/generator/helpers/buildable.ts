import * as THREE from 'three';

import {
    baseBoundingBox,
    boundingBoxes,
    buildableBoundingBox,
    craftBoundingBoxes,
    landscapeBoundingBoxes,
} from '../base';
import { buildingRandom, customRandom, randomRange } from './math';
import { baseParameters } from '../constants/buildingConstants';
import { seedStore } from '../store/seedStore';
import { getSiteY } from './siteHelper';

let maxFloors = 5;
seedStore.store.subscribe(({ seed }) => (maxFloors = seed.maxVolumeHeight));

export function buildablePosition(
    width: number,
    height: number,
    depth: number,
    options: Partial<{ noOffset: boolean; fullHeight: boolean; onGround: boolean }> = {},
) {
    const baseWidth = baseParameters.baseWidth;
    let offset = 0.2;
    if (options.noOffset) {
        offset = 0;
    }
    // console.log("maxFloors", maxFloors);

    const diagonalLength = Math.sqrt(width ^ (2 + depth) ^ 2) / 2;
    const buildableLength = baseWidth - offset * 2 - diagonalLength;

    const x = randomRange(buildingRandom(), -buildableLength / 2, buildableLength / 2);
    const z = buildableLength / 2 - buildableLength * customRandom();
    let y = 0;
    if (options.fullHeight) {
        y = randomRange(customRandom(), 0, 1);
        return { x, y, z };
    }
    y = options.onGround
        ? height / 2
        : Math.max(
              Math.floor(customRandom() * maxFloors) * 0.1 - customRandom() * 0.01,
              height / 2,
          );

    if (options.onGround) {
        y += getSiteY(x, z);
    }
    return { x, y, z };
}

export function insideBuildable(mesh: THREE.Mesh) {
    return buildableBoundingBox.containsBox(new THREE.Box3().setFromObject(mesh));
}

export function collidesWithBuilding(box3: THREE.Box3) {
    return boundingBoxes.some(
        boundingBox => box3.intersectsBox(boundingBox) || box3.containsBox(boundingBox),
    );
}

export function insideBase(mesh: THREE.Mesh) {
    return baseBoundingBox.containsBox(new THREE.Box3().setFromObject(mesh));
}

export function collidesWithLandscape(mesh: THREE.Mesh | THREE.Group) {
    return collidesWithLandscapeBB(new THREE.Box3().setFromObject(mesh));
}

export function collidesWithLandscapeBB(box3: THREE.Box3) {
    return landscapeBoundingBoxes.some(
        boundingBox => box3.intersectsBox(boundingBox) || box3.containsBox(boundingBox),
    );
}

export function collidesWithCraft(box3: THREE.Box3) {
    return craftBoundingBoxes.some(bb => box3.intersectsBox(bb));
}
