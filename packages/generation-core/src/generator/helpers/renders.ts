import * as THREE from 'three';

import { baseScene } from '../base';
import { renderParameters } from '../constants/constants';

export function renderBoundingBox(mesh: THREE.Object3D) {
    const helperBox = new THREE.BoxHelper(mesh, 0xffff00);

    if (renderParameters.boundingBoxes) baseScene.add(helperBox);
}
