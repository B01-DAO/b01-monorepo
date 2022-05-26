import * as THREE from 'three';

import { ConvexGeometry } from '../vendor/ConvexGeometry';
import { baseScene, boundingBoxes } from './base';
import { getPointOfClosestBox } from './helpers/math';
import { environmentStore } from './store/environmentStore';
import { EnvironmentTypes } from './constants/environmentConstants';
import { buildVolumePtsFromLine } from './helpers/volume_from_lines';
import { buildPerson } from './person';
import { getRandomColorInTheme } from './helpers/colorHelper';

export function addBridgeIfNeeded(box: THREE.Box3) {
    if (boundingBoxes.length === 0 || box.min.y <= 0.05) return;

    const newBoxDiagonal = new THREE.Vector3().subVectors(box.max, box.min).length();

    for (const boundingBox of boundingBoxes) {
        if (!box.intersectsBox(boundingBox)) continue;

        const existingBox = boundingBox;
        const existingBoxDiagonal = new THREE.Vector3()
            .subVectors(existingBox.max, existingBox.min)
            .length();
        const intersectBox = box.intersect(existingBox);

        const boxDiagonal = new THREE.Vector3()
            .subVectors(intersectBox.max, intersectBox.min)
            .length();

        if (boxDiagonal / newBoxDiagonal > 0.3 || boxDiagonal / existingBoxDiagonal > 0.3) return;
    }

    const newBoxCenter = new THREE.Vector3();

    box.getCenter(newBoxCenter);

    const endPoint = getPointOfClosestBox(newBoxCenter, boundingBoxes);

    const connectorWidth = 0.03; // Math.random()*.1 + 0.10
    let connectorHeight = 0.01; // Math.random()*.1 + 0.1)
    if (environmentStore.get.currentEnvironment() === EnvironmentTypes.underWater) {
        connectorHeight = 0.04;
    }

    const bridgeGeometry = new ConvexGeometry(
        buildVolumePtsFromLine(newBoxCenter, endPoint, connectorWidth, connectorHeight),
    );

    const vectorToBridgePt = new THREE.Vector3()
        .subVectors(endPoint, newBoxCenter)
        .multiplyScalar(0.5);
    const pointAlongBridge = newBoxCenter.add(vectorToBridgePt);
    const person = buildPerson(pointAlongBridge.x, pointAlongBridge.y + 0.01, pointAlongBridge.z);
    baseScene.add(person);

    let newMaterial = new THREE.MeshPhysicalMaterial({ color: getRandomColorInTheme() });
    if (environmentStore.get.currentEnvironment() === EnvironmentTypes.underWater) {
        newMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
        });
    }
    const surface = new THREE.Mesh(bridgeGeometry, newMaterial);
    surface.position.setY(connectorHeight / 2);

    surface.castShadow = true;
    surface.receiveShadow = true;

    return surface;
}
