import * as THREE from 'three';

import { personParameters } from './constants/constants';
import { baseScene } from './base';
import { buildablePosition, collidesWithLandscape } from './helpers/buildable';
import { customRandom } from './helpers/math';
import { streetLightParameters } from './constants/lightConstants';

export function buildPerson(x = 0, y = 0, z = 0, rotateY = 0) {
    const topColor = parseInt(Math.floor(customRandom() * 16777215).toString(16), 16);
    const bottomColor = parseInt(Math.floor(customRandom() * 16777215).toString(16), 16);

    const group = new THREE.Group();

    const height =
        customRandom() * (personParameters.heightMax - personParameters.heightMin) +
        personParameters.heightMin;
    const headMesh = buildHead(height);

    group.add(headMesh);

    const armsGroup = buildArms(height, topColor);

    group.add(buildTorso(height, topColor));
    group.add(armsGroup);

    const legs = buildLegs(height, bottomColor);

    group.add(legs[0]);
    group.add(legs[1]);

    group.rotation.y = rotateY;
    group.position.set(x, y, z);

    return group;
}

function buildHead(height: number) {
    const group = new THREE.Group();

    const radius = (height * personParameters.headRatio) / 2;

    const geometry = new THREE.SphereGeometry(radius, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xf7e5bc });
    const head = new THREE.Mesh(geometry, material);
    const light = new THREE.PointLight(
        streetLightParameters.color,
        streetLightParameters.intensity / 5,
        streetLightParameters.distance,
        streetLightParameters.decay,
    );

    head.castShadow = true;
    head.receiveShadow = true;

    group.add(light);
    group.add(head);

    group.position.y = height - radius;

    return group;
}

function buildTorso(height: number, topColor: number) {
    const torso = buildCylinders(
        height * personParameters.torsoRatio * 0.8,
        (height * personParameters.torsoRadiusRatio) / 2,
        topColor,
    );
    torso.position.y = height * 0.6;
    torso.scale.x = 0.6;
    torso.castShadow = true;
    torso.receiveShadow = true;

    return torso;
}

function buildArms(height: number, topColor: number) {
    const armHeight = height * personParameters.armRatio;
    const armLeft = buildCylinders(armHeight, height * personParameters.armRadiusRatio, topColor);
    const armRight = buildCylinders(armHeight, height * personParameters.armRadiusRatio, topColor);
    const headHeight = height * personParameters.headRatio;

    const armsGroup = new THREE.Group();
    const armLeftGroup = new THREE.Group();
    const armRightGroup = new THREE.Group();
    armLeft.position.z = -height * 0.12;
    armRight.position.z = height * 0.12;
    armLeft.position.y = armHeight / 2;
    armRight.position.y = armHeight / 2;
    armLeft.rotateX(3.14);
    armRight.rotateX(3.14);
    armLeftGroup.add(armLeft);
    armRightGroup.add(armRight);
    const rotateAmount = customRandom() * 0.4;
    armLeftGroup.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), 3.14 + rotateAmount);
    armRightGroup.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), 3.14 - rotateAmount);
    armsGroup.add(armLeftGroup);
    armsGroup.add(armRightGroup);
    // armsGroup.rotateOnWorldAxis(new THREE.Vector3(0,0,1), 3.14);
    armsGroup.position.y = height - headHeight - 0.002; // - (armHeight / 2) * 1.2 + armHeight;
    // armsGroup.position.z =
    //
    //
    // armRight.position.y = height - headHeight - (armHeight / 2) * 1.2;
    //
    // armRight.position.z = height * 0.12;

    return armsGroup;
}

function buildLegs(height: number, bottomColor: number) {
    const legLeft = buildCylinders(
        height * personParameters.legRatio,
        height * personParameters.legRadiusRatio,
        bottomColor,
    );
    const legRight = buildCylinders(
        height * personParameters.legRatio,
        height * personParameters.legRadiusRatio,
        bottomColor,
    );
    legLeft.position.y = height * 0.2;
    legRight.position.y = height * 0.2;
    legLeft.position.z = -height * 0.02;
    legRight.position.z = height * 0.02;

    return [legLeft, legRight] as const;
}

function buildCylinders(height: number, radius: number, color: number) {
    const geometry = new THREE.CylinderGeometry(radius, radius * 0.8, height);
    const material = new THREE.MeshToonMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return new THREE.Mesh(geometry, material);
}

export function addRandomPerson() {
    const position = buildablePosition(0.03, 0, 0.03, { onGround: true });
    const person = buildPerson(position.x, position.y, position.z, customRandom() * 10);
    if (collidesWithLandscape(person)) return;
    baseScene.add(person);
}
