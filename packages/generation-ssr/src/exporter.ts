import { baseScene } from '@nouns/generation-core';
import { writeJson } from 'fs-extra';
import { GLTFExporter } from './vendor/GLTFExporter';

export function writeModel(path: string) {
    const exporter = new GLTFExporter();
    // Parse the input and generate the glTF output
    const options = {};
    exporter.parse(
        baseScene,
        // called when the gltf has been generated
        function (result) {
            // const output = JSON.stringify(result, null, 2);
            writeJson(path, result, {}, () => console.log(`Written to ${path}`));
            // saveString( output, 'scene.gltf' );
        },
        // called when there is an error in the generation
        function (error) {
            console.log('An error happened', error);
        },
        options,
    );
}
