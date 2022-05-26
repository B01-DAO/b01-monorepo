import * as THREE from 'three';

import {buildablePosition} from "./helpers/buildable";
import {customRandom} from "./helpers/math";
import {baseScene} from "./base";
import {getRandomColorInTheme} from "./helpers/colorHelper";
import {environmentStore} from "./store/environmentStore";
import {EnvironmentTypes} from "./constants/environmentConstants";

export function addFish() {
    const group = new THREE.Group();
    const fishColor = getRandomColorInTheme();
    const length = 0.02;
    const height = 0.01;
    const width = 0.01;
    const {x, y, z} = buildablePosition(length, width, height, {noOffset: true, fullHeight: true});
    const fishGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const fishMesh = new THREE.Mesh(fishGeometry, new THREE.MeshPhysicalMaterial({ color: fishColor}))
    group.add(fishMesh);

    const fishTailShape = new THREE.Shape([
        new THREE.Vector2(0.5, 0),
        new THREE.Vector2(0.7, 0.5),
        new THREE.Vector2(0.7, -0.5)])
    const extrudeSettings = {depth: 0.1, bevelEnabled: false};
    const tailGeo = new THREE.ExtrudeGeometry(fishTailShape, extrudeSettings);
    const tailMesh = new THREE.Mesh(tailGeo, new THREE.MeshPhysicalMaterial({ color: fishColor}))
    group.add(tailMesh);

    const fishRotation = customRandom();
    group.rotateY(fishRotation);
    if (customRandom() < 0.2) {
        group.scale.set(length * 2, height * 1.5, width);
    } else {
        group.scale.set(length, height, width);
    }
    let offsetY = y;
    if (environmentStore.get.currentEnvironment() === EnvironmentTypes.onWater) {
        offsetY -= 1;
    }

    group.position.set(x, offsetY, z);
    baseScene.add(group);
}
