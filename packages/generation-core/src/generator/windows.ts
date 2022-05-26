import * as THREE from 'three';

import { buildingRandom, customRandom } from './helpers/math';
import { environmentStore } from './store/environmentStore';
import { buildingParameters, BuildingShapes } from './constants/buildingConstants';

const windows: THREE.Mesh[] = [];

let material: THREE.MeshBasicMaterial;

environmentStore.store.subscribe(() => {
    material?.color.set(environmentStore.get.currentLightingParams().windowColor);
});

export function buildWindows(
    width: number,
    height: number,
    depth: number,
    group: THREE.Group,
    shape: BuildingShapes,
) {
    const currentLightParameters = environmentStore.get.currentLightingParams();
    material ||= new THREE.MeshBasicMaterial({
        color: currentLightParameters.windowColor,
        transparent: true,
        opacity: 0.8,
    });

    let baseWindowWidth = 0.05;
    const windowGap = 0.02;

    let windowCircular = false;
    if (buildingRandom() < 0.2) {
        windowCircular = true;
        baseWindowWidth *= 2;
    }

    if (shape === BuildingShapes.cylinder) {
        depth = (width * 2) / buildingParameters.cylinderRatio;
        width = (((width * 2) / buildingParameters.cylinderRatio) * 3.14) / 2;
    }
    const windowCount = Math.floor((width - windowGap * 2) / baseWindowWidth);
    const windowWidth = (width - windowGap * (windowCount + 1)) / windowCount;

    let darkBox: THREE.BufferGeometry = new THREE.BoxGeometry(
        windowWidth,
        height - windowGap * 2,
        depth + 0.001,
    );
    if (windowCircular) {
        darkBox = new THREE.CylinderGeometry(windowWidth / 4, windowWidth / 4, depth + 0.001, 36);
        darkBox.rotateX(3.14 / 2);
    }

    for (let i = 0; i < windowCount; i++) {
        if (customRandom() < 0.7) {
            const darkMesh = new THREE.Mesh(darkBox, material);
            if (shape === BuildingShapes.box) {
                darkMesh.position.x =
                    width / 2 - windowWidth / 2 - windowGap - (windowWidth + windowGap) * i; //TODO: - windowWidth/2;
            }
            if (shape === BuildingShapes.cylinder) {
                darkMesh.rotateY((i * 3.14) / windowCount);
            }

            group.add(darkMesh);
            windows.push(darkMesh);
        }
    }
}
