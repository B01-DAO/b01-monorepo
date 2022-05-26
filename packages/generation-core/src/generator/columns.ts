import * as THREE from 'three';

import { customRandom } from './helpers/math';
import { buildingParameters } from './constants/buildingConstants';

const columnProbability = buildingParameters.columnProbability;

export function buildColumns(
    y: number,
    height: number,
    randomColor: number,
    building: THREE.Mesh,
    group: THREE.Group,
    width: number,
    depth: number,
) {
    // don't add columns if building is on ground.
    if (y - height / 2 <= 0.01) {
        return;
    }
    const offset = 0.03;
    const columnHeight = y - height / 2;
    const geometry = new THREE.CylinderGeometry(
        columnHeight * 0.01 + 0.005,
        columnHeight * 0.01 + 0.005,
        columnHeight,
        6,
    );
    const material = new THREE.MeshToonMaterial({ color: randomColor });

    function addColumn(x: number, z: number) {
        if (customRandom() < columnProbability) {
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.set(x, -columnHeight / 2 - height / 2, z);
            cylinder.parent = building;
            cylinder.castShadow = true;
            cylinder.receiveShadow = true;
            group.add(cylinder);
        }
    }

    addColumn(offset - width / 2, offset - depth / 2);
    addColumn(width / 2 - offset, offset - depth / 2);
    addColumn(offset - width / 2, depth / 2 - offset);
    addColumn(width / 2 - offset, depth / 2 - offset);
    addColumn(0, 0);
}
