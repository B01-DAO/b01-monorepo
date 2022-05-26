import * as THREE from 'three';

import { mainStore } from './store/mainStore';

/**
 * Create a renderer
 */
export const getRenderer = ({
    height,
    width,
}: {
    height: number;
    width: number;
}): THREE.WebGLRenderer => {
    const { document, window, renderer } = mainStore.get.state();

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default PCFShadowMap
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    document.getElementById('controls').appendChild(renderer.domElement);

    // SSR Hack
    (document as any).removeAllListeners?.('resize');

    return renderer;
};
