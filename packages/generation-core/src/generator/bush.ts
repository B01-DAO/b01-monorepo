import * as THREE from 'three';

import { baseScene, boundingBoxes, driveBoundingBoxes } from './base';
import { doesCollide } from './helpers/collison';
import { collidesWithLandscape, insideBase } from './helpers/buildable';
import { customRandom } from './helpers/math';
import { baseParameters } from './constants/buildingConstants';
import { getSiteY } from './helpers/siteHelper';
import { environmentStore } from './store/environmentStore';

let material: THREE.MeshToonMaterial = new THREE.MeshToonMaterial({ color: 0x000000 });

export function buildBushGeo(
    radius: number,
    scale: number,
    x: number,
    y: number,
    siteY: number,
    z: number,
) {
    const geometry = new THREE.SphereGeometry(radius, 5, 5);

    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.scale.y = scale;
    sphere.position.set(x, y + siteY, z);
    return sphere;
}

export function buildBush(
    radiusMin: number,
    radiusMax: number,
    width: number,
    depth: number,
    boundingBoxes: THREE.Box3[],
    yHeight = 0,
    onGround = false,
) {
    material ||= new THREE.MeshToonMaterial({
        color: environmentStore.get.currentSeasonParams().bushColor,
    });

    const scale = customRandom() * 2 + 1;
    const scaledMax = radiusMax / scale;
    const scaledMin = radiusMin / scale;
    const radius = customRandom() * (scaledMax - scaledMin) + scaledMin;

    const x = customRandom() * width - width / 2;
    const y = scale * radius * 0.8 + yHeight;
    const z = customRandom() * depth - depth / 2;
    let siteY = 0;
    if (onGround) {
        siteY = getSiteY(x, z);
    }
    const sphere = buildBushGeo(radius, scale, x, y, siteY, z);

    if (collidesWithLandscape(sphere)) return;
    if (doesCollide(boundingBoxes, sphere) || !insideBase(sphere)) return;
    if (doesCollide(driveBoundingBoxes, sphere)) return;

    return sphere;
}

environmentStore.store.subscribe(() =>
    material.color.set(environmentStore.get.currentSeasonParams().bushColor),
);

export function addBush(onGround = false) {
    const bush = buildBush(
        0.02,
        0.04,
        baseParameters.baseWidth,
        baseParameters.baseWidth,
        boundingBoxes,
        0,
        onGround,
    );

    if (bush) baseScene.add(bush);
}
