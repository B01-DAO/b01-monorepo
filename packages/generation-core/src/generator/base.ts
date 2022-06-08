import * as THREE from 'three';

import { OrbitControls } from '../vendor/OrbitControls';
import { mainStore } from './store/mainStore';
import { buildCamera } from './camera';
import { renderParameters, sceneParameters } from './constants/constants';
import { lightParameterList } from './constants/lightConstants';
import { baseParameters } from './constants/buildingConstants';
import { getRenderer } from './renderer';
import { seedStore } from './store/seedStore';
import { buildSite, rainbowMaterials } from './site';
import { environmentStore } from './store/environmentStore';
import { seasonList } from './constants/seasons';

export let camera: THREE.OrthographicCamera;
export let baseScene: THREE.Scene;
export let buildableBoundingBox: THREE.Box3 = new THREE.Box3();
export let baseBoundingBox: THREE.Box3;
export let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
export let boundingBoxes: THREE.Box3[] = [];
export let driveBoundingBoxes: THREE.Box3[] = [];
export let landscapeBoundingBoxes: THREE.Box3[] = [];
export let craftBoundingBoxes: THREE.Box3[] = [];
export let site: THREE.Group = new THREE.Group();
export const rainbow: THREE.Group = new THREE.Group();
const width = renderParameters.width;
const height = renderParameters.height;
let frames = 0;
let changeTimeOfDay = true;
let changeSeason = true;
let autoRotate = true;

let maxFloors = 5;
seedStore.store.subscribe(({ seed }) => (maxFloors = seed.maxVolumeHeight));

export function initBaseScene() {
    reset();
    baseScene = new THREE.Scene();
}

export function initScene() {
    const { captureFrames, progressHandler } = mainStore.get.state();

    site = buildSite();
    baseScene.add(site);
    camera ||= buildCamera();
    const buildableWidth = baseParameters.baseWidth - baseParameters.siteOffset * 2;

    buildableBoundingBox = new THREE.Box3(
        new THREE.Vector3(-buildableWidth / 2, -1, -buildableWidth / 2),
        new THREE.Vector3(buildableWidth / 2, maxFloors, buildableWidth / 2),
    );

    if (!baseBoundingBox) {
        baseBoundingBox = new THREE.Box3(
            new THREE.Vector3(-baseParameters.baseWidth / 2, -1, -baseParameters.baseWidth / 2),
            new THREE.Vector3(
                baseParameters.baseWidth / 2,
                maxFloors,
                baseParameters.baseWidth / 2,
            ),
        );
    }

    buildRenderer();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0.2, 0);
    controls.autoRotate = autoRotate; // new URLSearchParams(window.location.search).has('rotate');
    controls.update();

    if (captureFrames) progressHandler({ type: 'start' });
}

export function reset() {
    boundingBoxes = [];
    buildableBoundingBox = null;
    driveBoundingBoxes = [];
    landscapeBoundingBoxes = [];
    craftBoundingBoxes = [];
    renderer?.domElement?.remove?.();
}

export function toggleRotation() {
    autoRotate = !autoRotate;
    controls.autoRotate = autoRotate;
}

export function toggleChangeTimeOfDay() {
    changeTimeOfDay = !changeTimeOfDay;
}

export function toggleChangeSeason() {
    changeSeason = !changeSeason;
}

function buildRenderer() {
    renderer = getRenderer({ height, width });
    renderer.domElement.id = sceneParameters.canvasId;
    animation();
    return renderer;
}

function animation() {
    const { framesToRecord, captureFrames, requestAnimationFrame, isWebApp } =
        mainStore.get.state();

    if (isWebApp || frames <= framesToRecord) requestAnimationFrame(animation);

    rainbow.lookAt(camera.position);
    rainbowMaterials.forEach(material =>
        material.setValues({ opacity: controls?.getPolarAngle() * 2 - 0.8 || 1 }),
    );

    controls?.update();
    renderer.render(baseScene, camera);

    frames += 1;

    if (captureFrames) captureFramesIfNeeded();
    if (changeTimeOfDay) changeTimeOfDayIfNeeded();
    if (changeSeason) changeSeasonIfNeeded();
}

function changeTimeOfDayIfNeeded() {
    const { framesToRecord } = mainStore.get.state();

    const lightFrameLength = Math.floor(framesToRecord / lightParameterList.length / 2);

    if (frames % lightFrameLength === 0) {
        const i = Math.floor(frames / lightFrameLength) % lightParameterList.length;

        environmentStore.set.currentLightingName(lightParameterList[i].name);
    }
}

function changeSeasonIfNeeded() {
    const { framesToRecord } = mainStore.get.state();

    const lightFrameLength = Math.floor(framesToRecord / seasonList.length / 2);

    if (frames % lightFrameLength === 0) {
        const i = Math.floor(frames / lightFrameLength) % seasonList.length;

        environmentStore.set.currentSeasonName(seasonList[i].name);
    }
}

function captureFramesIfNeeded() {
    const { framesToRecord, progressHandler } = mainStore.get.state();

    if (frames <= framesToRecord) progressHandler({ type: 'inc', frame: frames });
    else progressHandler({ type: 'stop' });
}
