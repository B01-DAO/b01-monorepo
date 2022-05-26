import commandLineArgs from 'command-line-args';
import CLIProgress from 'cli-progress';
import { startGenerating } from '@nouns/generation-core';

import { requestAnimationFrame, window, document, screen } from './init';
import { writeModel } from './exporter';

const progressBar = new CLIProgress.SingleBar({
    format: 'Capturing | {bar} | {percentage}% || {value}/{total} frames',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
});

const options = commandLineArgs([
    { name: 'seed', alias: 's', type: String, defaultOption: true, defaultValue: '' },
    { name: 'frames', alias: 'f', type: Number, defaultValue: 1800 },
]);

startGenerating(
    {
        requestAnimationFrame,
        window: window as any,
        document: document as any,
        screen,
        renderer: screen.renderer,
        framesToRecord: options.frames,
        captureFrames: true,
        progressHandler: e => {
            if (e.type === 'start') progressBar.start(options.frames, 0);
            else if (e.type === 'inc') progressBar.increment();
            else if (e.type === 'stop') progressBar.stop();
        },
        isWebApp: false,
    },
    options.seed,
);
writeModel('out/out.gltf');
