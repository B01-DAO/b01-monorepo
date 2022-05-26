import * as THREE from 'three';

import { ConvexGeometry } from '../vendor/ConvexGeometry';
import { getRandomColorInTheme } from './helpers/colorHelper';
import { baseScene, craftBoundingBoxes, landscapeBoundingBoxes } from './base';
import { buildablePosition } from './helpers/buildable';
import { customRandom } from './helpers/math';
import { buildPerson } from './person';

function buildHull(boatMaterial: THREE.MeshPhysicalMaterial, group: THREE.Group) {
    const hullPoints = [
        // spline
        new THREE.Vector3(-0.5, 0.1, 0),
        new THREE.Vector3(-0.4, -0.1, 0),
        new THREE.Vector3(-0.1, -0.1, 0),
        new THREE.Vector3(0.5, 0, 0),

        // hull left
        new THREE.Vector3(-0.2, 0.08, 0.1),
        new THREE.Vector3(0.5, 0.08, 0.1),

        // hull right
        new THREE.Vector3(-0.2, 0.08, -0.1),
        new THREE.Vector3(0.5, 0.08, -0.1),
    ];

    const hullGeo = new ConvexGeometry(hullPoints);
    const hullMesh = new THREE.Mesh(hullGeo, boatMaterial);
    hullMesh.castShadow = true;
    hullMesh.receiveShadow = true;
    group.add(hullMesh);
}

function buildSails(group: THREE.Group) {
    const sailGroup = new THREE.Group();
    const sailHeight = 1.5;
    const mastMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
    const sailMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        opacity: 0.95,
        transparent: true,
    });
    const mainSailPoints = [
        new THREE.Vector3(-0.4, 0.13, 0),
        new THREE.Vector3(-0.05, 0.13, 0),
        new THREE.Vector3(-0.05, sailHeight, 0),
        new THREE.Vector3(-0.3, 0.3, 0.01),
    ];
    const mainSailMesh = new THREE.Mesh(new ConvexGeometry(mainSailPoints), sailMaterial);
    mainSailMesh.castShadow = true;
    mainSailMesh.receiveShadow = true;
    sailGroup.add(mainSailMesh);
    const headSailPoints = [
        new THREE.Vector3(0.5, 0.13, 0),
        new THREE.Vector3(0.05, 0.13, 0),
        new THREE.Vector3(0.05, sailHeight, 0),
        new THREE.Vector3(0.1, 0.3, 0.01),
    ];
    const headSailMesh = new THREE.Mesh(new ConvexGeometry(headSailPoints), sailMaterial);
    headSailMesh.castShadow = true;
    headSailMesh.receiveShadow = true;
    headSailMesh.rotateY(customRandom() * 0.3);
    sailGroup.add(headSailMesh);
    const mastGeo = new THREE.CylinderGeometry(0.02, 0.02, sailHeight);
    const mastMesh = new THREE.Mesh(mastGeo, mastMaterial);
    mastMesh.castShadow = true;
    mastMesh.receiveShadow = true;
    mastMesh.position.setY(sailHeight / 2);
    sailGroup.add(mastMesh);
    sailGroup.position.setX(-0.1);
    group.add(sailGroup);
}

export function buildBoat() {
    const group = new THREE.Group();
    const boatMaterial = new THREE.MeshPhysicalMaterial({ color: getRandomColorInTheme() });
    buildSails(group);
    buildHull(boatMaterial, group);

    group.scale.set(0.3, 0.3, 0.3);

    const { x, z } = buildablePosition(0.2, 0.4, 0.2);
    const person = buildPerson(x, 0.02, z);
    baseScene.add(person);

    group.position.set(x, 0, z);
    group.rotateY(customRandom());
    landscapeBoundingBoxes.push(new THREE.Box3().setFromObject(group));
    craftBoundingBoxes.push(new THREE.Box3().setFromObject(group));
    baseScene.add(group);
}
