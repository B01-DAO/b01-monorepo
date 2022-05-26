import * as THREE from 'three';

import { ConvexGeometry } from '../vendor/ConvexGeometry';
import { baseParameters } from './constants/buildingConstants';
import { customRandom, randomRange } from './helpers/math';
import { offsetVectors } from './helpers/volume_from_lines';
import { Group, Vector3 } from 'three';
import { baseScene, camera, landscapeBoundingBoxes, rainbow } from './base';
import { environmentStore } from './store/environmentStore';
import { EnvironmentTypes } from './constants/environmentConstants';

let environment = environmentStore.get.currentEnvironment();
environmentStore.store.subscribe(({ currentEnvironment }) => (environment = currentEnvironment));

const baseWidth = baseParameters.baseWidth;
const baseDepth = baseParameters.baseDepth;
const baseColor = baseParameters.baseColor;

const rainbowColors = [
    0xff0000, 0xff9d00, 0xfff700, 0xfff700, 0x00ffc8, 0x0051ff, 0x8000ff, 0xd400ff,
];
export const rainbowMaterials = rainbowColors.map(color => {
    return new THREE.MeshBasicMaterial({ color: color, opacity: 1, transparent: true });
});

let siteMaterial: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000000 });

function buildSlope(
    xLeft: number,
    xRight: number,
    group: Group,
    leftStartPt: Vector3,
    rightStartPt: Vector3,
) {
    const slopeLeft = randomRange(customRandom(), -0.5, xLeft);
    const slopeRight = randomRange(customRandom(), -0.5, xRight);

    const slope = [
        leftStartPt,
        rightStartPt,
        new THREE.Vector3(-0.5, 0, 0.5),
        new THREE.Vector3(-0.5, 0, -0.5),
        new THREE.Vector3(-0.5, customRandom() * 0.25, 0.5),
        new THREE.Vector3(-0.5, customRandom() * 0.25, -0.5),
        new THREE.Vector3(slopeLeft, customRandom() * 0.25, 0.5),
        new THREE.Vector3(slopeRight, customRandom() * 0.25, -0.5),
    ];

    const slopeGeometry = new ConvexGeometry(slope);
    const slopeMesh = new THREE.Mesh(slopeGeometry, siteMaterial);
    slopeMesh.receiveShadow = true;
    slopeMesh.rotateY(-3.14 / 2);
    group.add(slopeMesh);
}

function buildWaterCube() {
    const color = 0x00629e; // white
    const near = 0.1;
    const far = 2.5;
    baseScene.fog = new THREE.Fog(color, near, far);
}

export function buildSite() {
    if (environment === EnvironmentTypes.clouds || environment === EnvironmentTypes.space) {
        return;
    }
    const group = new THREE.Group();
    siteMaterial ||= new THREE.MeshPhysicalMaterial({ color: baseColor });

    const geometry = new THREE.BoxGeometry(baseWidth, baseDepth, baseWidth + 0.1);
    const positionY = (-1 * baseDepth) / 2;

    const xLeft = randomRange(customRandom(), -0.2, 0.3);
    const xRight = randomRange(customRandom(), -0.2, 0.3);
    const leftStartPt = new THREE.Vector3(xLeft, 0, 0.5);
    const rightStartPt = new THREE.Vector3(xRight, 0, -0.5);
    if (environment !== EnvironmentTypes.onWater) {
        buildSlope(xLeft, xRight, group, leftStartPt, rightStartPt);
    }
    if (environment === EnvironmentTypes.land) {
        buildRiver(group, leftStartPt, rightStartPt);
    }
    if (environment === EnvironmentTypes.underWater) {
        buildWaterCube();
    }
    if (environmentStore.get.currentEnvironment() === EnvironmentTypes.onWater) {
        siteMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x3262a8,
            opacity: 0.9,
            transparent: true,
        });
    }

    const mesh = new THREE.Mesh(geometry, siteMaterial);
    mesh.receiveShadow = true;
    mesh.position.y = positionY;
    mesh.position.z += 0.05;

    group.add(mesh);

    return group;
}

function buildRiver(group: Group, start: Vector3, end: Vector3) {
    const planeVectors: THREE.Vector3[] = offsetVectors(
        [start, end],
        new THREE.Vector3(customRandom() * 0.1 + 0.1, 0, 0),
        false,
    );
    const volumeVectors: THREE.Vector3[] = offsetVectors(
        planeVectors,
        new THREE.Vector3(0, 0.03, 0),
        true,
    );
    const riverGeometry = new ConvexGeometry(volumeVectors);
    const mesh = new THREE.Mesh(riverGeometry, new THREE.MeshNormalMaterial());
    const bboxMesh = new THREE.Mesh(riverGeometry, new THREE.MeshNormalMaterial());
    bboxMesh.scale.setY(10);
    bboxMesh.rotateY(-3.14 / 2);
    mesh.rotateY(-3.14 / 2);
    landscapeBoundingBoxes.push(new THREE.Box3().setFromObject(bboxMesh));
    group.add(mesh);
}

export function buildRainbow() {
    let outerRadius = 0.5;
    const tubeRadius = 0.01;
    rainbowMaterials.forEach(rainbowMaterial => {
        const geometry = new THREE.TorusGeometry(outerRadius, 0.01, 16, 100);
        const torus = new THREE.Mesh(geometry, rainbowMaterial);
        torus.position.setZ(-0.8);
        torus.position.setY(0.25);
        rainbow.add(torus);
        outerRadius -= tubeRadius * 2;
    });

    rainbow.rotateX(3.14);
    rainbow.rotateY(-3.14 / 4);

    rainbow.lookAt(camera.position);
    baseScene.add(rainbow);
}

export function buildStars() {
    const starGroup = new THREE.Group();
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 4000; i++) {
        const randomDirection = new THREE.Vector3(
            customRandom() - 0.5,
            customRandom() - 0.5,
            customRandom() - 0.5,
        ).normalize();
        let radius = 0.003;
        const randPosition = randomDirection.multiplyScalar(3);
        if (customRandom() < 0.2) {
            radius *= 2;
        }
        const geometry = new THREE.SphereGeometry(radius);
        const mesh = new THREE.Mesh(geometry, starMaterial);
        mesh.position.set(randPosition.x, randPosition.y, randPosition.z);
        starGroup.add(mesh);
    }

    starGroup.rotateX(3.14);
    starGroup.rotateY(-3.14 / 4);

    starGroup.lookAt(camera.position);
    baseScene.add(starGroup);
}

environmentStore.store.subscribe(() => {
    let siteColor = environmentStore.get.currentSeasonParams().treeColor;
    if (environmentStore.get.currentEnvironment() === EnvironmentTypes.onWater) {
        siteColor = 0x3262a8;
    }
    siteMaterial.color.set(siteColor);
});
