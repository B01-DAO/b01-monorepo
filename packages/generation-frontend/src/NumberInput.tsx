import React from 'react';

type NumberInputProps = {
    label: string;
    value: number;
    onChange: (value: number) => void;
};

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange }) => {
    return (
        <label>
            {label}
            <input type="number" value={value} onChange={e => onChange(e.target.valueAsNumber)} />
        </label>
    );
};

export default NumberInput;
