import * as THREE from 'three';

export function doesCollide(boundingBoxes: THREE.Box3[], object: THREE.Mesh) {
    const box = new THREE.Box3().setFromObject(object);

    return boundingBoxes.some(boundingBox => box.intersectsBox(boundingBox));
}
