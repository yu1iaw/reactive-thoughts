import { useEffect, useState } from "react";


export const useDebounce = <S,>(value: S, delay: number): S => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay)

        return () => {
            clearTimeout(timerId);
        }
    }, [value, delay])

    return debouncedValue;
}