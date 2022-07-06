import path from 'path';
import child_process from 'child_process';
import fs from 'fs/promises';

import rimraf from 'rimraf';
import { NounSeed } from '@nouns/sdk';
import { startGenerating } from '@nouns/generation-core';

import { requestAnimationFrame, window, document, screen } from './init';
import { writeModel } from './exporter';

export const generateAssets = async ({
    seed = {} as Partial<NounSeed>,
    rawSeed = '',
    frames = 1800,
} = {}) => {
    // don't yeet unknown directories
    const outDir = path.join(__dirname, '../out');

    // ensure empty outDir
    rimraf.sync(outDir);
    // await fs.rm(outDir, { recursive: true, force: true });
    await fs.mkdir(outDir, { recursive: true });

    await new Promise<void>(res => {
        startGenerating(
            {
                requestAnimationFrame,
                window: window as any,
                document: document as any,
                renderer: screen.renderer,
                framesToRecord: frames,
                captureFrames: true,
                progressHandler: e => {
                    if (e.type === 'inc') {
                        screen.snapshot(`${outDir}/${e.frame.toString().padStart(4, '0')}.png`);
                    } else if (e.type === 'stop') res();
                },
                isWebApp: false,
            },
            { seed, rawSeed },
        );
        writeModel(`${outDir}/out.gltf`);
    });

    console.log('Image generation finished!');
    console.log('Generating webm via ffmpeg...');

    child_process.execSync(
        `${path.join(
            __dirname,
            '../ffmpeg/ffmpeg',
        )} -y -framerate 60 -i ${outDir}/%04d.png ${outDir}/output.webm`,
    );

    const [image, gltf, webm] = await Promise.all([
        fs.readFile(`${outDir}/0001.png`),
        fs.readFile(`${outDir}/out.gltf`),
        fs.readFile(`${outDir}/output.webm`),
    ]);

    return { image, gltf, webm };
};

export default generateAssets;
