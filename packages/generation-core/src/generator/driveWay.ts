import * as THREE from 'three';

import { ConvexGeometry } from '../vendor/ConvexGeometry';

import { boundingBoxes, baseScene, driveBoundingBoxes } from './base';
import { drivewayParameters } from './constants/constants';
import { customRandom, getPointOfClosestBox } from './helpers/math';
import { buildVolumePtsFromLine } from './helpers/volume_from_lines';
import { renderBoundingBox } from './helpers/renders';
import { addStreetLight } from './lights';
import { getRandomColorInTheme } from './helpers/colorHelper';
import { baseParameters } from './constants/buildingConstants';
import { getSiteY } from './helpers/siteHelper';
import { buildPerson } from './person';
import { buildingStore } from './store/buildingStore';
import { environmentStore } from './store/environmentStore';
import { EnvironmentTypes, envWithBase } from './constants/environmentConstants';
import { addBridgeIfNeeded } from './bridge';

const width = drivewayParameters.width;
const height = drivewayParameters.height;
const walkwayWidth = width / 2;

let usePitchedRoofs = false;
buildingStore.store.subscribe(({ hasPitchedRoofs }) => (usePitchedRoofs = hasPitchedRoofs));

function buildPersonOnDriveway(bridgeEnd: THREE.Vector3, driveStart: THREE.Vector3) {
    const vectorToBridgePt = new THREE.Vector3()
        .subVectors(bridgeEnd, driveStart)
        .multiplyScalar(0.5);
    const pointAlongBridge = driveStart.add(vectorToBridgePt);
    const person = buildPerson(
        pointAlongBridge.x,
        pointAlongBridge.y + drivewayParameters.height / 2,
        pointAlongBridge.z,
    );
    baseScene.add(person);
}

export function buildDriveway() {
    const geometry = new THREE.BoxGeometry(1, height, width);
    const material = new THREE.MeshPhysicalMaterial({ color: drivewayParameters.color });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(0, height / 2, baseParameters.baseWidth / 2 + width / 2);
    cube.castShadow = true;
    cube.receiveShadow = true;

    if (environmentStore.get.currentEnvironment() === EnvironmentTypes.underWater) {
        const geometry = new THREE.BoxGeometry(1, 0.1, width);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
        });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.set(0, 0.05, baseParameters.baseWidth / 2 + width / 2);
        baseScene.add(cube);
    }

    const driveStart = new THREE.Vector3(...drivewayParameters.driveStart);
    const driveEnd = getPointOfClosestBox(driveStart, boundingBoxes);
    driveEnd.setY(0);
    const driveLength = driveStart.distanceTo(driveEnd) - drivewayParameters.entryLength;
    const driveEndY = getSiteY(driveEnd.x, driveEnd.z) + 0.01; // make sure it's above landscape
    const bridgeEnd = new THREE.Vector3()
        .addVectors(
            driveStart,
            new THREE.Vector3()
                .subVectors(driveEnd, driveStart)
                .normalize()
                .multiplyScalar(driveLength),
        )
        .add(new THREE.Vector3(0, driveEndY, 0));

    driveEnd.add(new THREE.Vector3(0, driveEndY, 0));

    const driveGeometry = new ConvexGeometry(
        buildVolumePtsFromLine(driveStart, bridgeEnd, walkwayWidth, drivewayParameters.height / 2),
    );

    if (envWithBase.some(env => env === environmentStore.get.currentEnvironment())) {
        baseScene.add(cube);
        addStreetLights();
        baseScene.add(buildPerson(0.0, 0.01, 0.51));
    }

    buildPersonOnDriveway(bridgeEnd, driveStart);

    const surface = new THREE.Mesh(driveGeometry, material);
    surface.position.y = drivewayParameters.height / 2;
    surface.castShadow = true;
    surface.receiveShadow = true;

    baseScene.add(surface);

    const cubeBox = new THREE.Box3().setFromObject(cube);
    const driveBox = new THREE.Box3().setFromObject(surface);

    buildEntry(driveStart, driveEnd);

    driveBoundingBoxes.push(cubeBox);
    driveBoundingBoxes.push(driveBox);

    boundingBoxes.push(cubeBox);
    boundingBoxes.push(driveBox);

    renderBoundingBox(surface);
}

function buildEntry(driveStart: THREE.Vector3, driveEnd: THREE.Vector3) {
    const entryHeight = Math.floor(customRandom() * 2) * 0.1 + 0.1;
    const entryWidth = customRandom() / 5 + 0.1;

    const dirVector = new THREE.Vector3().subVectors(driveStart, driveEnd).normalize().setY(0);
    dirVector.multiplyScalar(drivewayParameters.entryLength);

    const newPt = new THREE.Vector3().addVectors(dirVector, driveEnd);
    const offsetEntryStart = new THREE.Vector3().add(driveEnd);
    const offsetEntryEnd = new THREE.Vector3().add(newPt);

    const entryGeometry = new ConvexGeometry(
        buildVolumePtsFromLine(
            offsetEntryStart,
            offsetEntryEnd,
            entryWidth,
            entryHeight,
            usePitchedRoofs,
        ),
    );

    const newMaterial = new THREE.MeshPhysicalMaterial({ color: getRandomColorInTheme() });

    const entrySurface = new THREE.Mesh(entryGeometry, newMaterial);
    entrySurface.castShadow = true;
    entrySurface.receiveShadow = true;

    addBridgeIfNeeded(new THREE.Box3().setFromObject(entrySurface));

    renderBoundingBox(entrySurface);

    baseScene.add(entrySurface);

    const bbox = new THREE.Box3().setFromObject(entrySurface);

    driveBoundingBoxes.push(bbox);
    boundingBoxes.push(bbox);

    dirVector.normalize().multiplyScalar(0.001);

    const doorHeight = 0.08;
    const doorCenter = new THREE.Vector3().addVectors(
        newPt,
        new THREE.Vector3(0, doorHeight / 2, 0),
    );
    const doorPt = new THREE.Vector3().addVectors(doorCenter, dirVector);

    const doorGeometry = new ConvexGeometry(
        buildVolumePtsFromLine(doorPt, doorCenter, walkwayWidth, doorHeight),
    );

    const doorMaterial = new THREE.MeshBasicMaterial({
        color: parseInt(Math.floor(customRandom() * 16777215).toString(16), 16),
    });

    const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);

    baseScene.add(doorMesh);
}

function addStreetLights() {
    let x = -baseParameters.baseWidth / 2 + 0.1;

    while (x < baseParameters.baseWidth / 2) {
        addStreetLight([x, 1, baseParameters.baseWidth / 2]);
        x += 0.2;
    }
}
