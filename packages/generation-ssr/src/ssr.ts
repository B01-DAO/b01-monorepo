import path from 'path';
import child_process from 'child_process';

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
    { name: 'movie', alias: 'm', type: Boolean, defaultValue: true },
]);

startGenerating(
    {
        requestAnimationFrame,
        window: window as any,
        document: document as any,
        renderer: screen.renderer,
        framesToRecord: options.frames,
        captureFrames: true,
        progressHandler: e => {
            if (e.type === 'start') progressBar.start(options.frames, 0);
            else if (e.type === 'inc') {
                progressBar.increment();
                screen.snapshot(`out/${e.frame.toString().padStart(4, '0')}.png`);
            } else if (e.type === 'stop') {
                progressBar.stop();

                if (options.movie) {
                    child_process.execSync(
                        `${path.join(
                            __dirname,
                            '../ffmpeg/ffmpeg',
                        )} -y -framerate 60 -i ${path.join(
                            __dirname,
                            '../out/%04d.png',
                        )} ${path.join(__dirname, '../out/output.webm')}`,
                    );

                    process.exit(); // necessary to prevent weird hangs/segfaults
                }
            }
        },
        isWebApp: false,
    },
    { rawSeed: options.seed },
);
writeModel('out/out.gltf');
