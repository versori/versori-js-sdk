import { RefObject, useEffect, useRef } from 'react';

export function useIsMounted(): RefObject<boolean> {
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return isMounted;
}
