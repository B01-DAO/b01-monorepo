import { createStore } from '@udecode/zustood';
import * as THREE from 'three';

export type ProgressEvent = { type: 'start' } | { type: 'inc'; frame: number } | { type: 'stop' };

export type MainStore = {
    requestAnimationFrame: typeof window.requestAnimationFrame;
    window: typeof window;
    document: typeof document;
    screen?: { snapshot: (path: string) => void };
    renderer: THREE.WebGLRenderer;
    captureFrames?: boolean;
    framesToRecord?: number;
    progressHandler?: (e: ProgressEvent) => void;
    isWebApp: boolean;
};

export const mainStore = createStore('mainStore')({
    requestAnimationFrame: undefined,
    window: undefined,
    document: undefined,
    screen: undefined,
    renderer: undefined,
    captureFrames: undefined,
    framesToRecord: undefined,
    progressHandler: undefined,
    isWebApp: false,
} as MainStore);
