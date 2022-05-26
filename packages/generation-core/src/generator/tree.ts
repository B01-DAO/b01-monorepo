import * as THREE from 'three';

import { baseScene } from './base';
import { renderBoundingBox } from './helpers/renders';
import {
    collidesWithBuilding,
    collidesWithLandscape,
    collidesWithLandscapeBB,
    insideBase,
} from './helpers/buildable';
import { customRandom } from './helpers/math';
import { TreeTypes } from './constants/constants';
import { landscapeStore } from './store/landscapeStore';
import { getSiteY } from './helpers/siteHelper';
import { environmentStore } from './store/environmentStore';
import { EnvironmentTypes } from './constants/environmentConstants';

let treeMaterial: THREE.MeshToonMaterial = new THREE.MeshToonMaterial({ color: 0x000000 });
let treeShape: TreeTypes;
let scaleTree: number;

landscapeStore.store.subscribe(({ treeType }) => {
    treeShape = treeType;
});
landscapeStore.store.subscribe(({ treeScale }) => {
    scaleTree = treeScale;
});

export function addTree() {
    const height = (customRandom() / 5 + 0.2) * scaleTree;
    const treeGroup = new THREE.Group();
    let cylinder;
    if (environmentStore.get.currentEnvironment() === EnvironmentTypes.underWater) {
        const curve = new THREE.CatmullRomCurve3(
            [
                new THREE.Vector3(0, -0.5, 0),
                new THREE.Vector3(0.2, 0.2, 0),
                new THREE.Vector3(0, 0.4, 0.2),
                new THREE.Vector3(-0.2, 0.6, 0),
                new THREE.Vector3(0, 0.8, -0.2),
                new THREE.Vector3(0, 1, 0),
            ],
            false,
        );
        const geometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
        // const geometry = new THREE.CylinderGeometry(0.01 * scaleTree, 0.02 * scaleTree, height, 32);
        const material = new THREE.MeshPhysicalMaterial({
            color: environmentStore.get.currentSeasonParams().grassColor,
        });

        cylinder = new THREE.Mesh(geometry, material);
        cylinder.rotateY(customRandom() * 10);
        cylinder.scale.set(0.1, height, 0.1);
    } else {
        const geometry = new THREE.CylinderGeometry(0.01 * scaleTree, 0.02 * scaleTree, height, 32);
        const material = new THREE.MeshPhysicalMaterial({
            color: environmentStore.get.currentSeasonParams().barkColor,
        });

        cylinder = new THREE.Mesh(geometry, material);
    }

    cylinder.castShadow = true;
    cylinder.receiveShadow = true;

    const x = customRandom() - 0.5;
    const y = height / 2;
    const z = customRandom() - 0.5;

    const siteY = getSiteY(x, z);

    cylinder.position.set(x, y + siteY, z);

    treeGroup.add(cylinder);

    if (!insideBase(cylinder)) return;

    if (environmentStore.get.currentEnvironment() !== EnvironmentTypes.underWater) {
        const radius = ((customRandom() / 5 + 0.2) * 0.08 + 0.05) * scaleTree;

        let geometry2: THREE.BufferGeometry = new THREE.SphereGeometry(radius, 32, 32);
        if (treeShape === TreeTypes.Cone) {
            geometry2 = new THREE.ConeGeometry(radius, radius * 4, 32);
        }

        treeMaterial ||= new THREE.MeshToonMaterial({
            color: environmentStore.get.currentSeasonParams().treeColor,
        });

        const treeTop = new THREE.Mesh(geometry2, treeMaterial);
        treeTop.castShadow = true;
        treeTop.receiveShadow = true;

        if (collidesWithLandscape(treeTop)) return;

        const scaleY = (customRandom() * 3 + 1) * scaleTree;
        const sphereHeight = radius * 2 * scaleY;

        treeTop.scale.set(1, scaleY, 1);
        treeTop.position.set(x, height + sphereHeight / 2 + siteY, z);

        if (!insideBase(treeTop)) return;

        treeGroup.add(treeTop);
    }

    const treeBoundingBox = new THREE.Box3().setFromObject(treeGroup);
    renderBoundingBox(treeGroup);

    if (collidesWithBuilding(treeBoundingBox)) return;
    if (collidesWithLandscapeBB(treeBoundingBox)) return;

    baseScene.add(treeGroup);
}

environmentStore.store.subscribe(() =>
    treeMaterial.color.set(environmentStore.get.currentSeasonParams().treeColor),
);
