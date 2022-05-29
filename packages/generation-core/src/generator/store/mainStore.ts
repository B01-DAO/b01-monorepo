import { createStore } from '@udecode/zustood';
import * as THREE from 'three';

export type ProgressEvent = { type: 'start' } | { type: 'inc'; frame: number } | { type: 'stop' };

export type MainStore = {
    requestAnimationFrame: typeof window.requestAnimationFrame;
    window: typeof window;
    document: typeof document;
    renderer: THREE.WebGLRenderer;
    captureFrames?: boolean;
    framesToRecord?: number;
    progressHandler?: (e: ProgressEvent) => void;
    snapshotHandler?: (frame: number) => void;
    isWebApp: boolean;
};

export const mainStore = createStore('mainStore')({
    requestAnimationFrame: undefined,
    window: undefined,
    document: undefined,
    renderer: undefined,
    captureFrames: undefined,
    framesToRecord: undefined,
    progressHandler: undefined,
    snapshotHandler: undefined,
    isWebApp: false,
} as MainStore);
