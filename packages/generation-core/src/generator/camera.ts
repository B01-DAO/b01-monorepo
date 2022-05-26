import * as THREE from 'three';

export function buildCamera() {
    const cameraScope = 0.7;

    const camera = new THREE.OrthographicCamera(
        -cameraScope,
        cameraScope,
        cameraScope + 0.1,
        -cameraScope + 0.1,
        0.01,
        10,
    );

    camera.position.z = 1;
    camera.position.x = 1;
    camera.position.y = 1;

    return camera;
}
