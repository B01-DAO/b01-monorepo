import * as THREE from 'three';

import { seedStore } from './store/seedStore';
import { ConvexGeometry } from '../vendor/ConvexGeometry';
import { buildBush } from './bush';
import { greenAreaParameters } from './constants/constants';
import { buildPerson } from './person';
import { buildingRandom } from './helpers/math';
import { buildingStore } from './store/buildingStore';
import { buildingParameters, BuildingShapes } from './constants/buildingConstants';
import { environmentStore } from './store/environmentStore';

let roofMaterial: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000000 });
let pGreenRoof = 0;
let usePitchedRoofs = false;

seedStore.store.subscribe(({ seed }) => (pGreenRoof = seed.greenRooftopP / 255));
buildingStore.store.subscribe(({ hasPitchedRoofs }) => (usePitchedRoofs = hasPitchedRoofs));

export function buildGreenRoof(
    width: number,
    depth: number,
    height: number,
    group: THREE.Group,
    newMaterial: THREE.Material,
    shape: BuildingShapes,
) {
    const greenRoofProbability = pGreenRoof;
    const bushOffset = 0.01;
    const soilDepth = greenAreaParameters.soilDepth;
    const widthWithOffset = width - bushOffset * 2;
    const depthWithOffset = depth - bushOffset * 2;

    roofMaterial ||= new THREE.MeshPhysicalMaterial({
        color: environmentStore.get.currentSeasonParams().grassColor,
    });

    if (usePitchedRoofs) {
        let roofGeometry;
        let roofOffset = 0;
        if (shape === BuildingShapes.box) {
            roofGeometry = new ConvexGeometry([
                new THREE.Vector3(-width / 2, 0, -depth / 2),
                new THREE.Vector3(width / 2, 0, -depth / 2),
                new THREE.Vector3(width / 2, 0, depth / 2),
                new THREE.Vector3(-width / 2, 0, depth / 2),
                new THREE.Vector3(0, width / 3, -depth / 2),
                new THREE.Vector3(0, width / 3, depth / 2),
            ]);
        } else if (shape === BuildingShapes.cylinder) {
            roofGeometry = new THREE.ConeGeometry(
                width / buildingParameters.cylinderRatio,
                width / 2,
                32,
            );
            roofOffset = width / 4;
        }
        if (roofGeometry) {
            const roofMesh = new THREE.Mesh(roofGeometry, newMaterial);
            roofMesh.position.y = height / 2 + roofOffset;
            roofMesh.receiveShadow = true;
            // roofMesh.castShadow = true;
            group.add(roofMesh);
            return;
        }
    }
    if (buildingRandom() < greenRoofProbability) {
        let roofBase: THREE.BufferGeometry;
        switch (shape) {
            case BuildingShapes.cylinder:
                roofBase = new THREE.CylinderGeometry(
                    width / buildingParameters.cylinderRatio,
                    width / buildingParameters.cylinderRatio,
                    soilDepth,
                    36,
                );
                break;
            default:
                roofBase = new THREE.BoxGeometry(width, soilDepth, depth);
        }

        const roofMesh = new THREE.Mesh(roofBase, roofMaterial);

        roofMesh.position.y = height / 2 + soilDepth / 2;
        roofMesh.castShadow = true;
        roofMesh.receiveShadow = true;

        group.add(roofMesh);

        for (let i = 0; i < 10; i++) {
            let bush = buildBush(0.005, 0.02, widthWithOffset, depthWithOffset, [], height / 2);
            if (bush) group.add(bush);
        }

        for (let i = 0; i < 3; i++) {
            const person = buildPerson(
                randomRange(-width / 2, width / 2),
                height / 2 + soilDepth,
                randomRange(-depth / 2, depth / 2),
                buildingRandom(),
            );
            group.add(person);
        }
    }
}

function randomRange(min: number, max: number) {
    return buildingRandom() * (max - min) + min;
}

environmentStore.store.subscribe(() =>
    roofMaterial.color.set(environmentStore.get.currentSeasonParams().grassColor),
);
