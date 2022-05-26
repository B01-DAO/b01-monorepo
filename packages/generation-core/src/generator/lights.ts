import * as THREE from 'three';

import { drivewayParameters } from './constants/constants';
import { baseScene } from './base';
import { LightParameters, streetLightParameters } from './constants/lightConstants';
import { environmentStore } from './store/environmentStore';

let hemLight: THREE.HemisphereLight;
let sun: THREE.DirectionalLight;

environmentStore.store.subscribe(() => {
    const currentLightingParams = environmentStore.get.currentLightingParams();

    changeLighting(currentLightingParams);
});

function buildHemLight(currentLightParameters: LightParameters) {
    return new THREE.HemisphereLight(
        currentLightParameters.hemLightColorSky,
        currentLightParameters.hemLightColorGround,
        currentLightParameters.hemLightIntensity,
    );
}

function buildSunLight(currentLightParameters: LightParameters) {
    const newSun = new THREE.DirectionalLight(
        currentLightParameters.DirectionalLightColor,
        currentLightParameters.DirectionalLightIntensity,
    );
    newSun.position.set(...currentLightParameters.DirectionalLightPosition);

    // shadows
    newSun.castShadow = true;
    newSun.shadow.mapSize.width = 5120; // default
    newSun.shadow.mapSize.height = 5120; // default
    newSun.shadow.camera.near = 0.5; // default
    newSun.shadow.camera.far = 500; // default
    return newSun;
}

export function changeLighting(currentLightingParams: LightParameters) {
    if (!hemLight) {
        hemLight = new THREE.HemisphereLight();
        baseScene.add(hemLight);
    }
    if (!sun) {
        sun = new THREE.DirectionalLight();
        baseScene.add(sun);
    }

    hemLight.copy(buildHemLight(currentLightingParams));
    sun.copy(buildSunLight(currentLightingParams));

    baseScene.background = new THREE.Color(currentLightingParams.backgroundColor);
}

export function addStreetLight(position: [number, number, number]) {
    const group = new THREE.Group();

    const light = new THREE.PointLight(
        streetLightParameters.color,
        streetLightParameters.intensity,
        streetLightParameters.distance,
        streetLightParameters.decay,
    );

    const lightSphere = new THREE.SphereGeometry(0.003);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lightMesh = new THREE.Mesh(lightSphere, lightMaterial);

    const post = new THREE.CylinderGeometry(0.001, 0.001, 0.1);
    const material = new THREE.MeshPhysicalMaterial({ color: drivewayParameters.color });
    const postMesh = new THREE.Mesh(post, material);

    postMesh.position.y = -0.05;

    group.add(postMesh);
    group.add(light);
    group.add(lightMesh);

    group.position.set(...position);
    group.position.y = 0.1;

    baseScene.add(group);
}
