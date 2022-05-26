import * as THREE from 'three';

import { ConvexGeometry } from '../vendor/ConvexGeometry';
import { buildingRandom, customRandom, randomColor, randomRange } from './helpers/math';
import { environmentStore } from './store/environmentStore';
import { buildBushGeo } from './bush';
import { getRandomColorInTheme, stringToHex } from './helpers/colorHelper';

const greenWallThickness = 0.01;
const wallMaterial = new THREE.MeshPhysicalMaterial({
    color: environmentStore.get.currentSeasonParams().grassColor,
});

environmentStore.store.subscribe(() =>
    wallMaterial.color.set(environmentStore.get.currentSeasonParams().grassColor),
);

function buildGreenWall(width: number, height: number, depth: number, group: THREE.Group) {
    const wallGeo = new THREE.BoxGeometry(greenWallThickness, height, depth);

    const mesh = new THREE.Mesh(wallGeo, wallMaterial);
    const bushCount = height * depth * 300;
    for (let i = 0; i < bushCount; i++) {
        const xPosition = -width / 2 - greenWallThickness;
        const yPosition = randomRange(buildingRandom(), -height / 2, height / 2);
        const zPosition = randomRange(buildingRandom(), -depth / 2, depth / 2);
        group.add(
            buildBushGeo(
                0.01,
                randomRange(buildingRandom(), 0.5, 1),
                xPosition,
                yPosition,
                0,
                zPosition,
            ),
        );
    }
    mesh.position.setX(-width / 2 - greenWallThickness / 2);
    group.add(mesh);
}

function buildClimbingWall(width: number, height: number, depth: number, group: THREE.Group) {
    const points = [
        new THREE.Vector3(0, -height / 2, -depth / 2),
        new THREE.Vector3(0, height / 2, -depth / 2),
        new THREE.Vector3(0, height / 2, depth / 2),
        new THREE.Vector3(0, -height / 2, depth / 2),
        new THREE.Vector3(randomRange(buildingRandom(), 0.001, 0.02), -height / 2, -depth / 2),
        new THREE.Vector3(randomRange(buildingRandom(), 0.001, 0.02), -height / 2, depth / 2),
        new THREE.Vector3(randomRange(buildingRandom(), 0.001, 0.02), height / 2, -depth / 2),
        new THREE.Vector3(randomRange(buildingRandom(), 0.001, 0.02), height / 2, depth / 2),
    ];
    for (let i = 0; i < height * 10; i++) {
        points.push(
            new THREE.Vector3(
                randomRange(buildingRandom(), 0.01, 0.02),
                randomRange(buildingRandom(), -height / 3, height / 3),
                -depth / 2,
            ),
        );
    }
    const geo = new ConvexGeometry(points);
    const material = new THREE.MeshPhysicalMaterial({ color: getRandomColorInTheme() });
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.setX(width / 2);
    for (let i = 0; i < height * 50; i++) {
        const y = randomRange(customRandom(), -height / 2 + 0.01, height / 2 - 0.01);
        const z = randomRange(customRandom(), -depth / 2 + 0.01, depth / 2 - 0.01);
        const x = getPositionOnWall(y, z, mesh);
        const attachmentGeo = new THREE.DodecahedronGeometry(
            randomRange(customRandom(), 0.003, 0.01),
        );
        const attachmentMaterial = new THREE.MeshPhysicalMaterial({
            color: stringToHex(randomColor(customRandom)),
        });
        const attachmentMesh = new THREE.Mesh(attachmentGeo, attachmentMaterial);
        attachmentMesh.position.set(x + width / 2, y, z);
        group.add(attachmentMesh);
    }
    group.add(mesh);
}

function getPositionOnWall(y: number, z: number, wall: THREE.Mesh) {
    const raycaster = new THREE.Raycaster(
        new THREE.Vector3(100, y, z),
        new THREE.Vector3(-1, 0, 0),
        0,
        150,
    );
    const intersects = raycaster.intersectObject(wall, true);
    return intersects[0].point.x;
}

export function buildWallFeature(width: number, height: number, depth: number, group: THREE.Group) {
    if (buildingRandom() < 0.2) {
        buildGreenWall(width, height, depth, group);
    }
    if (buildingRandom() < 0.2) {
        buildClimbingWall(width, height, depth, group);
    }
}
