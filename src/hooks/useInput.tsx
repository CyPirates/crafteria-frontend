import { useState } from "react";

export const useInput = () => {
    const [value, setValue] = useState<String>('');

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    return [value, handleOnChange];
}