import React, { useEffect, useState } from 'react';
import Color from 'color';
import * as THREE from 'three';
import { NounSeed } from '@nouns/sdk';
import {
    startGenerating,
    seedStore,
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

import { buildArrayForSelect } from './helpers';

import SeedSettings from './SeedSettings';

const App: React.FC = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSeed = urlParams.get('seed');
    const seedString = seedStore.use.seedString();
    const seedObject = seedStore.use.seed();
    const [localSeedString, setLocalSeedString] = useState(urlSeed ?? seedString);

    const updateSeed = (seed: string) => {
        setLocalSeedString(seed);
        window.history.replaceState(null, window.location.href, `?seed=${seed}`);
        seedStore.set.seedString(seed);
    };

    const generate = (seed?: string) =>
        startGenerating(
            {
                requestAnimationFrame,
                window,
                document,
                renderer: new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }),
                isWebApp: true,
                framesToRecord: 1800,
            },
            { rawSeed: seed },
        );

    // Update URL when seed string changes
    useEffect(() => updateSeed(seedString), [seedString]);

    useEffect(() => generate(urlSeed ?? undefined), []);

    useEffect(() => {
        if (urlSeed) updateSeed(urlSeed);
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
            <div id="controls" style={getFontStyle()}>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        updateSeed(localSeedString);
                    }}
                >
                    <fieldset>
                        <label>
                            Seed String:
                            <input
                                value={localSeedString}
                                onChange={e => setLocalSeedString(e.currentTarget.value)}
                            />
                        </label>

                        <button type="submit">Change Seed String</button>

                        <button
                            type="button"
                            onClick={() => {
                                updateSeed('');
                                generate();
                            }}
                        >
                            Randomize
                        </button>

                        <SeedSettings seed={seedObject} setSeed={seedStore.set.seed} />
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
                                    <option value={value} key={value}>
                                        {label}
                                    </option>
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
                                    <option value={value} key={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button type="button" onClick={() => toggleRotation()}>
                            Toggle Rotation
                        </button>
                        <button type="button" onClick={() => toggleChangeTimeOfDay()}>
                            Toggle Change Lighting
                        </button>
                        <button type="button" onClick={() => toggleChangeSeason()}>
                            Toggle Change Season
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

export default App;
