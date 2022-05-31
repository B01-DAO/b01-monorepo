import * as THREE from 'three';

import { buildablePosition } from './helpers/buildable';
import { landscapeBoundingBoxes } from './base';
import { renderBoundingBox } from './helpers/renders';
import { getSiteY } from './helpers/siteHelper';
import { streetLightParameters } from './constants/lightConstants';
import { getRandomColorInTheme } from './helpers/colorHelper';
import { Group, Material, MeshPhysicalMaterial } from 'three';

const baseoffset = 0.2;
const baseHeight = 2;
const bandHeight = 0.3;
const centerHeight = 2;
const topHeight = 1.5;
const radius = 0.5;

function buildSegments(rocketGroup: Group, rocketMaterial: MeshPhysicalMaterial) {
    let currentHeight = baseoffset;

    function buildSegment(
        bottomRadius: number,
        topRadius: number,
        height: number,
        material: Material,
        type = '',
    ) {
        let segment;
        if (type == 'cone') {
            segment = new THREE.ConeGeometry(bottomRadius, height, 32);
        } else {
            segment = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 32);
        }
        const mesh = new THREE.Mesh(segment, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (type != 'landingPad') {
            mesh.position.setY(currentHeight + height / 2);
            currentHeight += height;
        }

        rocketGroup.add(mesh);
    }

    function buildWindow(x: number, y: number, z: number) {
        const subWindow = new THREE.SphereGeometry(0.2, 32, 32);
        const subWindowMesh = new THREE.Mesh(subWindow, new THREE.MeshNormalMaterial());
        const radiusFactor = 0.7;
        subWindowMesh.position.set(x * radiusFactor, y, z * radiusFactor);
        rocketGroup.add(subWindowMesh);
        console.log('new window');
    }

    buildSegment(radius * 2, radius * 2, 0.1, new THREE.MeshNormalMaterial(), 'landingPad'); // pad
    buildSegment(radius * 0.8, radius, baseHeight, rocketMaterial); // bottom
    buildSegment(
        radius,
        radius,
        bandHeight,
        new THREE.MeshPhysicalMaterial({ color: getRandomColorInTheme() }),
    ); // band
    const windowHeight = currentHeight + centerHeight / 2;
    buildWindow(radius, windowHeight, 0);
    buildWindow(-radius, windowHeight, 0);
    buildWindow(0, windowHeight, -radius);
    buildWindow(0, windowHeight, radius);
    buildSegment(radius, radius, centerHeight, rocketMaterial); // center
    buildSegment(radius, radius, topHeight, rocketMaterial, 'cone'); // top
}

function buildFins(rocketGroup: Group, rocketMaterial: MeshPhysicalMaterial) {
    const finShape = new THREE.Shape([
        new THREE.Vector2(radius * 2, 0.5),
        new THREE.Vector2(radius * 2, 0),
        new THREE.Vector2(0, baseoffset + 0.2),
        new THREE.Vector2(0, baseoffset + 1),
    ]);
    const extrudeSettings = { depth: 0.1, bevelEnabled: false };
    const finGeometry = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
    // const finGeometry = new THREE.ShapeGeometry(finShape);
    const finMesh1 = new THREE.Mesh(finGeometry, rocketMaterial);
    finMesh1.castShadow = true;
    finMesh1.receiveShadow = true;
    const finMesh2 = new THREE.Mesh(finGeometry, rocketMaterial);
    finMesh2.rotateY((3.14 * 2) / 3);
    finMesh2.castShadow = true;
    finMesh2.receiveShadow = true;
    const finMesh3 = new THREE.Mesh(finGeometry, rocketMaterial);
    finMesh3.castShadow = true;
    finMesh3.receiveShadow = true;
    finMesh3.rotateY((3.14 * 4) / 3);
    rocketGroup.add(finMesh1);
    rocketGroup.add(finMesh2);
    rocketGroup.add(finMesh3);
}

function addLights(rocketGroup: Group) {
    const light = new THREE.PointLight(
        streetLightParameters.color,
        streetLightParameters.intensity * 2,
        streetLightParameters.distance,
        1,
    );

    light.position.set(1, 1, 1);

    const light2 = new THREE.PointLight().copy(light);
    light.position.set(-1, 1, -1);

    rocketGroup.add(light);
    rocketGroup.add(light2);
}

function addColumn(rocketGroup: Group, rocketMaterial: MeshPhysicalMaterial, offsetY: number) {
    const column = new THREE.CylinderGeometry(0.15, 0.15, offsetY * 10, 32);
    const columnMesh = new THREE.Mesh(column, rocketMaterial);
    columnMesh.castShadow = true;
    columnMesh.receiveShadow = true;
    columnMesh.position.y = (-offsetY * 10) / 2;
    rocketGroup.add(columnMesh);
}

export function buildRocket() {
    const rocketMaterial = new THREE.MeshPhysicalMaterial({ color: getRandomColorInTheme() });
    const rocketGroup = new THREE.Group();

    const { x, z } = buildablePosition(0.1, 0.2, 0.1);
    const offSetY = getSiteY(x, z) + 0.2;
    buildSegments(rocketGroup, rocketMaterial);
    buildFins(rocketGroup, rocketMaterial);
    addLights(rocketGroup);
    rocketGroup.scale.set(0.1, 0.1, 0.1);
    addColumn(rocketGroup, rocketMaterial, offSetY);
    rocketGroup.position.set(x, offSetY, z);
    const rocketbb = new THREE.Box3().setFromObject(rocketGroup);
    renderBoundingBox(rocketGroup);
    landscapeBoundingBoxes.push(rocketbb);
    return rocketGroup;
}
