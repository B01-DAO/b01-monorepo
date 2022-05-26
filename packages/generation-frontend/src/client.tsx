import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Color from 'color';
import * as THREE from 'three';
import {
    startGenerating,
    seedStore,
    buildArrayForSelect,
    lightParameterList,
    seasonList,
    environmentStore,
    hex_to_ascii,
    toggleChangeSeason,
    toggleChangeTimeOfDay,
    toggleRotation,
    addBuilding,
} from '@nouns/generation-core';

import './index.scss';

const App = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSeed = urlParams.get('seed');
    const seedString = seedStore.use.seedString();
    const [localSeedString, setLocalSeedString] = useState(urlSeed ?? seedString);

    useEffect(
        () =>
            startGenerating(
                {
                    requestAnimationFrame,
                    window,
                    document,
                    renderer: new THREE.WebGLRenderer({
                        antialias: true,
                        preserveDrawingBuffer: true,
                    }),
                    isWebApp: true,
                },
                urlSeed ?? undefined,
            ),
        [],
    );

    useEffect(() => {
        if (urlSeed) setLocalSeedString(urlSeed);
    }, [urlSeed]);

    const lights = buildArrayForSelect(lightParameterList);
    const seasons = buildArrayForSelect(seasonList);

    const getBGColor = () => {
        return hex_to_ascii(
            environmentStore.use.currentLightingParams()?.backgroundColor || 0x000000,
        );
    };

    const getFontStyle = () => ({ color: Color(getBGColor()).negate().hex() });

    return (
        <div style={{ backgroundColor: getBGColor(), width: '100%' }}>
            <h1 style={getFontStyle()}>Building_01</h1>
            <div id={'controls'} style={getFontStyle()}>
                <form onSubmit={e => e.preventDefault()}>
                    <fieldset>
                        <label>
                            Seed String:
                            <input
                                value={localSeedString}
                                onChange={e => setLocalSeedString(e.currentTarget.value)}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() =>
                                (window.location.href =
                                    window.location.href.split('?')[0] + '?seed=' + localSeedString)
                            }
                        >
                            Change Seed String
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                (window.location.href = window.location.href.split('?')[0])
                            }
                        >
                            Randomize
                        </button>
                    </fieldset>

                    <fieldset>
                        <label>
                            Lights
                            <select
                                onChange={e =>
                                    environmentStore.set.currentLightingName(e.currentTarget.value)
                                }
                                value={environmentStore.use.currentLightingName()}
                            >
                                {lights.map(({ value, label }) => (
                                    <option value={value}>{label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Season
                            <select
                                onChange={e =>
                                    environmentStore.set.currentSeasonName(e.currentTarget.value)
                                }
                                value={environmentStore.use.currentSeasonName()}
                            >
                                {seasons.map(({ value, label }) => (
                                    <option value={value}>{label}</option>
                                ))}
                            </select>
                        </label>
                        <button type="button" onClick={() => toggleRotation()}>
                            Toggle Rotation
                        </button>
                        <button type="button" onClick={() => toggleChangeTimeOfDay()}>
                            Change Lighting
                        </button>
                        <button type="button" onClick={() => toggleChangeSeason()}>
                            Change Season
                        </button>
                    </fieldset>

                    <fieldset>
                        <label>
                            <button type="button" onClick={() => addBuilding()}>
                                Add Building
                            </button>
                        </label>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

const root = createRoot(document.body as HTMLElement);
root.render(<App />);
