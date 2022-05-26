import * as THREE from 'three';

import { baseScene, boundingBoxes } from './base';
import { buildingRandom, randomRange } from './helpers/math';
import { renderBoundingBox } from './helpers/renders';
import { buildWindows } from './windows';
import { buildGreenRoof } from './greenRoof';
import { buildColumns } from './columns';
import { buildBuilding } from './buildBuilding';
import { collidesWithLandscape, insideBuildable } from './helpers/buildable';
import { buildingStore } from './store/buildingStore';
import { addBridgeIfNeeded } from './bridge';
import { BuildingShapes } from './constants/buildingConstants';
import { SpecialShapeTypes } from './constants/constants';
import { buildWallFeature } from './featureWall';

function getShape() {
    const pCylinder = buildingStore.get.cylinderProbability();
    const useCylinders = buildingStore.get.hasCylinders();
    const useDodeca = buildingStore.get.hasDodecahedron();
    const pDodeca = buildingStore.get.dodecahedronProbability();
    const specialShapeType = buildingStore.get.specialShape();
    if (useCylinders && buildingRandom() < pCylinder) {
        return BuildingShapes.cylinder;
    } else if (useDodeca && buildingRandom() < pDodeca) {
        switch (specialShapeType) {
            case SpecialShapeTypes.capsule:
                return BuildingShapes.capsule;
            default:
                return BuildingShapes.dodecahedron;
        }
    }
    return BuildingShapes.box;
}

export function createBuildingVolume(onGround = false) {
    const defaultY = buildingStore.get.globalDefaultY();
    const yRotationProbability = buildingStore.get.rotateYProbability();

    const group = new THREE.Group();
    const shape = getShape();

    const { width, height, depth, x, y, z, buildingBox, randomColor, newMaterial, building } =
        buildBuilding(onGround, group, shape);

    const boundBoxMesh = new THREE.Mesh(buildingBox, newMaterial);
    const rotateXZ = buildingRandom() < 0.2;
    const rotateRange = 0.1 / (height + z) / 2;

    if (shape !== BuildingShapes.dodecahedron && shape !== BuildingShapes.capsule) {
        buildWindows(width, height, depth, group, shape);
        if ((rotateRange < 0.1 && rotateRange > -0.1) || !rotateXZ) {
            buildGreenRoof(width, depth, height, group, newMaterial, shape);
            buildColumns(y, height, randomColor, building, group, width, depth);
        }
    }

    if (shape === BuildingShapes.box) {
        buildWallFeature(width, height, depth, group);
    }

    let rotateY = 0;

    if (buildingRandom() < yRotationProbability) rotateY = buildingRandom() * 3;

    group.rotation.y = defaultY + rotateY;
    group.position.set(x, y, z);

    boundBoxMesh.position.set(x, y, z);
    boundBoxMesh.rotation.y = defaultY + rotateY;

    if (rotateXZ) {
        group.rotation.z = randomRange(buildingRandom(), -rotateRange, rotateRange);
        group.rotation.x = randomRange(buildingRandom(), -rotateRange, rotateRange);
    }

    if (!insideBuildable(boundBoxMesh)) return;
    if (collidesWithLandscape(boundBoxMesh)) return;

    const box = new THREE.Box3().setFromObject(boundBoxMesh);
    const bridge = addBridgeIfNeeded(box);

    if (bridge) baseScene.add(bridge); // temporary measure to avoid applying group matrix transforms

    renderBoundingBox(boundBoxMesh);

    boundingBoxes.push(box);

    return group;
}

export function addBuilding() {
    const building = createBuildingVolume();

    if (building) baseScene.add(building);
}
