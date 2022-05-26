import * as THREE from 'three';

import { ConvexGeometry } from '../vendor/ConvexGeometry';
import { customRandom, randomRange } from './helpers/math';
import { buildablePosition } from './helpers/buildable';
import { baseScene } from './base';

const material = new THREE.MeshPhysicalMaterial({ color: 0xcccccc });
export function buildAsteroid() {
    const numPoints = Math.floor(randomRange(customRandom(), 10, 40));
    const points = [];
    const scale = customRandom() * 0.5;
    for (let i = 0; i < numPoints; i++) {
        points.push(
            new THREE.Vector3(customRandom() - 0.5, customRandom() - 0.5, customRandom() - 0.5),
        );
    }
    const asteroidGeo = new ConvexGeometry(points);
    const mesh = new THREE.Mesh(asteroidGeo, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.scale.set(scale, scale, scale);
    const { x, y, z } = buildablePosition(scale, scale, scale, {
        noOffset: true,
        fullHeight: true,
    });
    mesh.position.set(x, y - 1, z);
    baseScene.add(mesh);
}
