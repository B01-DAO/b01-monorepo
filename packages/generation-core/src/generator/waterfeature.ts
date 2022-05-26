import * as THREE from 'three';

import { waterFeatureParameters } from './constants/constants';
import { addLandscape } from './helpers/landscape';

export function addWaterFeature() {
    const waterMaterial = new THREE.MeshNormalMaterial({
        color: waterFeatureParameters.color,
    } as any);
    addLandscape(waterFeatureParameters.height, waterMaterial);
}
