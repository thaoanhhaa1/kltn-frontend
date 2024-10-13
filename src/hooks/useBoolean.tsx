import { useState } from 'react';

const useBoolean = (
    initialValue: boolean,
): { value: boolean; setTrue: () => void; setFalse: () => void; toggle: () => void } => {
    const [value, setValue] = useState<boolean>(initialValue);

    return {
        value,
        setTrue: () => setValue(true),
        setFalse: () => setValue(false),
        toggle: () => setValue((prev) => !prev),
    };
};

export default useBoolean;
