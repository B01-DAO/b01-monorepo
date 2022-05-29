import { JSDOM } from 'jsdom';
import init from '3d-core-raub';
import webgl from 'webgl-raub';
import * as OG_THREE from 'three';

const dom = new JSDOM();

// GL Hacks needed to use more recent versions of three js
(webgl as any).getContextAttributes = () => ({ alpha: true });
const _getExtension = webgl.getExtension;
webgl.getExtension = (name: string) => {
    if (name === 'WEBGL_draw_buffers') {
        return {
            ...(_getExtension('WEBGL_draw_buffers') as Record<string, number>),
            drawBuffersWEBGL: () => {},
        };
    }

    return _getExtension(name);
};

export const { three, document, window, requestAnimationFrame, Screen, canvas } = init({
    three: OG_THREE,
    width: 800,
    height: 800,
    webgl: webgl as any,
});

export const THREE = three as typeof OG_THREE;

export const renderer = new THREE.WebGLRenderer({
    context: webgl as any,
    antialias: true,
    canvas: canvas as any,
    alpha: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
    logarithmicDepthBuffer: true,
});

export const screen = new (Screen as any)({ renderer });

(global as any).self = window;
(global as any).window = window;
global.document = dom.window.document;
global.Blob = dom.window.Blob;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.window.Blob = dom.window.Blob;
global.window.FileReader = dom.window.FileReader;
global.window.Date = Date;
global.window.THREE = THREE;
