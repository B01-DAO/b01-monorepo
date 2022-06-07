import React, { useState, useRef, useEffect } from 'react';
import { NounSeed } from '@nouns/sdk';

import NumberInput from './NumberInput';
import RangeInput from './RangeInput';

type SeedSettingsProps = {
    seed: NounSeed;
    setSeed: (seed: NounSeed) => void;
};

const SeedSettings: React.FC<SeedSettingsProps> = ({ seed, setSeed }) => {
    const dialog = useRef<HTMLDialogElement>(null);
    const [localState, setLocalState] = useState(seed);

    const confirm = () => setSeed(localState);

    const updateSlice = <Key extends keyof NounSeed>(key: Key) => {
        return (value: NounSeed[Key]) => setLocalState(oldState => ({ ...oldState, [key]: value }));
    };

    // @types/react should really update their types 🙃
    const show = () => (dialog.current as any).showModal();
    const hide = () => (dialog.current as any).close();

    // maintain parity between outer state and inner state
    useEffect(() => setLocalState(seed), [seed]);
    

    return (
        <>
            <button type="button" onClick={show}>
                Advanced Seed Settings
            </button>

            <dialog ref={dialog}>
                <fieldset>
                    <RangeInput
                        label="Volume Count"
                        value={localState.volumeCount}
                        onChange={updateSlice('volumeCount')}
                        min={2}
                        max={40}
                    />
                    <RangeInput
                        label="Max Volume Height"
                        value={localState.maxVolumeHeight}
                        onChange={updateSlice('maxVolumeHeight')}
                        min={5}
                        max={8}
                    />
                    <RangeInput
                        label="Water Feature Count"
                        value={localState.waterFeatureCount}
                        onChange={updateSlice('waterFeatureCount')}
                        min={5}
                        max={10}
                    />
                    <RangeInput
                        label="Grass Feature Count"
                        value={localState.grassFeatureCount}
                        onChange={updateSlice('grassFeatureCount')}
                        min={5}
                        max={10}
                    />
                    <RangeInput
                        label="Tree Count"
                        value={localState.treeCount}
                        onChange={updateSlice('treeCount')}
                        min={2}
                        max={20}
                    />
                    <RangeInput
                        label="Bush Count"
                        value={localState.bushCount}
                        onChange={updateSlice('bushCount')}
                        min={0}
                        max={100}
                    />
                    <RangeInput
                        label="People Count"
                        value={localState.peopleCount}
                        onChange={updateSlice('peopleCount')}
                        min={5}
                        max={20}
                    />
                    <RangeInput
                        label="Time of Day"
                        value={localState.timeOfDay}
                        onChange={updateSlice('timeOfDay')}
                        min={0}
                        max={2}
                    />
                    <RangeInput
                        label="Season"
                        value={localState.season}
                        onChange={updateSlice('season')}
                        min={0}
                        max={3}
                    />
                    <RangeInput
                        label="Green Rooftop P"
                        value={localState.greenRooftopP}
                        onChange={updateSlice('greenRooftopP')}
                        min={0}
                        max={255}
                    />
                    <NumberInput
                        label="Site Edge Offset"
                        value={Number(localState.siteEdgeOffset)}
                        onChange={updateSlice('siteEdgeOffset')}
                    />
                    <NumberInput
                        label="Orientation"
                        value={Number(localState.orientation)}
                        onChange={updateSlice('orientation')}
                    />
                </fieldset>

                <fieldset>
                    <button
                        type="button"
                        onClick={() => {
                            confirm();
                            hide();
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            hide();
                            setLocalState(seed);
                        }}
                    >
                        Cancel
                    </button>
                </fieldset>
            </dialog>
        </>
    );
};

export default SeedSettings;
