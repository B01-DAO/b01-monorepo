import * as THREE from 'three';

import { getRandomColorInTheme } from './helpers/colorHelper';
import { customRandom } from './helpers/math';
import { buildablePosition } from './helpers/buildable';
import { landscapeBoundingBoxes } from './base';

export function buildSubmarine() {
    const subGroup = new THREE.Group();
    const subMaterial = new THREE.MeshPhysicalMaterial({ color: getRandomColorInTheme() });
    const subMarineGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const subMesh = new THREE.Mesh(subMarineGeo, subMaterial);
    subMesh.scale.set(0.3, 0.07, 0.07);
    subGroup.add(subMesh);

    const subProps = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 32, 1);
    const subPropMesh = new THREE.Mesh(subProps, subMaterial);
    subPropMesh.rotateZ(3.14 / 2);
    subPropMesh.position.set(0.15, 0, 0);

    const subTop = new THREE.CylinderGeometry(0.03, 0.04, 0.05, 32, 1);
    const subTopMesh = new THREE.Mesh(subTop, subMaterial);
    subTopMesh.scale.set(1.5, 1, 0.7);
    subTopMesh.position.set(0, 0.03, 0);
    subGroup.add(subTopMesh);

    function buildWindow(x, y, z) {
        const subWindow = new THREE.SphereGeometry(0.01, 32, 32);
        const subWindowMesh = new THREE.Mesh(subWindow, new THREE.MeshNormalMaterial());
        subWindowMesh.position.set(x, y, z);
        subGroup.add(subWindowMesh);
    }

    buildWindow(-0.03, 0, 0.03);
    buildWindow(-0.03, 0, -0.03);
    buildWindow(0, 0, 0.03);
    buildWindow(0, 0, -0.03);
    buildWindow(0.03, 0, 0.03);
    buildWindow(0.03, 0, -0.03);

    subGroup.add(subPropMesh);
    const { x, y, z } = buildablePosition(0.1, 0.1, 0.1);
    subGroup.position.set(x, y, z);
    subGroup.rotateY(customRandom() * 10);

    const subBB = new THREE.Box3().setFromObject(subGroup);
    landscapeBoundingBoxes.push(subBB);
    return subGroup;
}
