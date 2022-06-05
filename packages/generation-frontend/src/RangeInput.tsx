import React from 'react';

type RangeInputProps = {
    label: string;
    value: number;
    onChange: (value: number) => void;
    max?: number;
    min?: number;
    step?: number;
};

const RangeInput: React.FC<RangeInputProps> = ({
    label,
    value,
    onChange,
    max = 100,
    min = 0,
    step = 1,
}) => {
    return (
        <label>
            {label}

            <section>
                <input
                    type="range"
                    value={value}
                    onChange={e => onChange(e.target.valueAsNumber)}
                    max={max}
                    min={min}
                    step={step}
                />

                <output>{value}</output>
            </section>
        </label>
    );
};

export default RangeInput;
