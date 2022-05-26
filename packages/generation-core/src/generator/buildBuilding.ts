import * as THREE from 'three';

import { buildablePosition } from './helpers/buildable';
import { buildingRandom, randomRange } from './helpers/math';
import { getRandomColorInTheme } from './helpers/colorHelper';
import { buildingStore } from './store/buildingStore';
import { buildingParameters, BuildingShapes } from './constants/buildingConstants';
import { SpecialShapeTypes } from './constants/constants';

let dWidth: number;
let dHeight: number;
let dDepth: number;
let pTripleSize: number;
let sameSizeVolumes: boolean;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let specialShapeType: SpecialShapeTypes = buildingStore.get.specialShape;
buildingStore.store.subscribe(({ defaultWidth }) => (dWidth = defaultWidth));
buildingStore.store.subscribe(({ defaultHeight }) => (dHeight = defaultHeight));
buildingStore.store.subscribe(({ defaultLength }) => (dDepth = defaultLength));
buildingStore.store.subscribe(({ tripleSizeProbability }) => (pTripleSize = tripleSizeProbability));
buildingStore.store.subscribe(({ allVolumesSameSize }) => (sameSizeVolumes = allVolumesSameSize));
buildingStore.store.subscribe(({ specialShape }) => (specialShapeType = specialShape));

function generateBuildingVolume(
    shape: BuildingShapes,
    width: number,
    height: number,
    depth: number,
) {
    switch (shape) {
        case BuildingShapes.cylinder:
            return new THREE.CylinderGeometry(
                width / buildingParameters.cylinderRatio,
                width / buildingParameters.cylinderRatio,
                height,
                36,
            );
        case BuildingShapes.dodecahedron:
            return new THREE.DodecahedronGeometry(width * 0.7);
        case BuildingShapes.capsule:
            return new THREE.CapsuleGeometry(width * 0.3, 0.1, 4, 8);
        default:
            return new THREE.BoxGeometry(width, height, depth);
    }
}

export function buildBuilding(onGround: boolean, group: THREE.Group, shape: BuildingShapes) {
    let width = dWidth;
    let height = dHeight + buildingRandom() * 0.01;
    let depth = dDepth;

    if (buildingRandom() < pTripleSize) {
        width *= 2;
        height *= 2;
        depth *= 2;
    } else if (!sameSizeVolumes) {
        width *= randomRange(buildingRandom(), 0.5, 1.5);
        height *= randomRange(buildingRandom(), 0.5, 1.5);
        depth *= randomRange(buildingRandom(), 0.5, 1.5);
    }

    const { x, y, z } = buildablePosition(width, height, depth);

    const buildingBox = generateBuildingVolume(shape, width, height, depth);

    const randomColor = getRandomColorInTheme();
    let newMaterial: THREE.Material = new THREE.MeshPhysicalMaterial({ color: randomColor });
    if (shape === BuildingShapes.capsule || shape === BuildingShapes.dodecahedron) {
        newMaterial = new THREE.MeshNormalMaterial();
    }

    const building = new THREE.Mesh(buildingBox, newMaterial);
    building.castShadow = true;
    building.receiveShadow = true;
    if (shape === BuildingShapes.capsule || shape === BuildingShapes.dodecahedron) {
        building.scale.set(1, height / width, 1);
    }

    group.add(building);

    return {
        width: width,
        height: height,
        depth,
        x,
        y,
        z,
        buildingBox,
        randomColor,
        newMaterial,
        building,
    };
}
