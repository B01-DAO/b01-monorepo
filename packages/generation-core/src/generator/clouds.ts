import * as THREE from 'three';

import {buildablePosition} from "./helpers/buildable";
import {customRandom} from "./helpers/math";
import {baseScene} from "./base";

const cloudMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.9})

export function addCloud() {
    const cloud = new THREE.SphereGeometry(1, 32);
    const cloudRadius = customRandom() * 0.2 + 0.1;
    const width = cloudRadius;
    const height = cloudRadius;
    const length = cloudRadius;
    const mesh = new THREE.Mesh(cloud, cloudMaterial);
    mesh.scale.set(width, height, length);
    const {x, y, z} = buildablePosition(width, height, length, {fullHeight: true, noOffset: true});
    const offsetY = y - 1;
    mesh.position.set(x, offsetY, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    baseScene.add(mesh);
}
