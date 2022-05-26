import * as THREE from 'three';

import { greenAreaParameters, waterFeatureParameters } from './constants/constants';
import { doesCollide } from './helpers/collison';
import { buildBush } from './bush';
import { addLandscape } from './helpers/landscape';
import { environmentStore } from './store/environmentStore';

let grassMaterial: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000000 });

export function addGrassFeature() {
    grassMaterial ||= new THREE.MeshPhysicalMaterial({
        color: environmentStore.get.currentSeasonParams().grassColor,
    });

    const decoration = (group: THREE.Group, boundingBox: THREE.Box3) => {
        for (let i = 0; i < 10; i++) {
            const bush = buildBush(
                0.01,
                1 / 30,
                waterFeatureParameters.boxWidth * 2,
                waterFeatureParameters.boxWidth * 2,
                [],
            );

            if (!bush) continue;

            if (bush && doesCollide([boundingBox], bush)) group.add(bush);
        }
    };

    addLandscape(greenAreaParameters.soilDepth, grassMaterial, decoration);
}

environmentStore.store.subscribe(() =>
    grassMaterial.color.set(environmentStore.get.currentSeasonParams().grassColor),
);
