import * as THREE from 'three';

import { waterFeatureParameters } from '../constants/constants';
import { buildablePosition, collidesWithCraft } from './buildable';
import { baseScene } from '../base';
import { buildingStore } from '../store/buildingStore';
import { customRandom } from './math';

let defaultY: number;

buildingStore.store.subscribe(({ globalDefaultY }) => (defaultY = globalDefaultY));

export function addLandscape(
    height: number,
    material: THREE.Material,
    decoration?: (group: THREE.Group, originBox: THREE.Box3) => void,
) {
    const group = new THREE.Group();

    const { x, y, z } = buildablePosition(
        waterFeatureParameters.boxWidth,
        waterFeatureParameters.height,
        waterFeatureParameters.boxLength,
        { onGround: true },
    );

    const fullHeight = 0.1;

    let geometry: THREE.BufferGeometry;
    if (customRandom() < 0.5) {
        geometry = new THREE.BoxGeometry(
            customRandom() * waterFeatureParameters.boxWidth + waterFeatureParameters.boxWidth,
            fullHeight,
            customRandom() * waterFeatureParameters.boxWidth * 2 +
                waterFeatureParameters.boxLength / 2,
        );
    } else {
        const radius =
            (customRandom() * waterFeatureParameters.boxWidth) / 2 +
            waterFeatureParameters.boxWidth / 2;
        geometry = new THREE.CylinderGeometry(radius, radius, fullHeight, 40);
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;

    const originBbox = new THREE.Box3().setFromObject(mesh);

    const offSetY = y - fullHeight / 2 + height;

    group.add(mesh);

    group.position.set(x, offSetY, z);
    group.rotation.y = defaultY;

    if (customRandom() < 0.2) {
        group.rotation.y = customRandom();
    }

    const box = new THREE.Box3().setFromObject(group);

    if (collidesWithCraft(box)) return;

    if (decoration) decoration(group, originBbox);

    baseScene.add(group);
}
