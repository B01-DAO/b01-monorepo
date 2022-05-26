import * as THREE from 'three';

import { site } from '../base';

export function getSiteY(x: number, z: number) {
    if (!site) {
        return 0;
    }
    const raycaster = new THREE.Raycaster(
        new THREE.Vector3(x, 100, z),
        new THREE.Vector3(0, -1, 0),
        0,
        150,
    );
    const intersects = raycaster.intersectObject(site, true);
    return intersects[0].point.y;
}
