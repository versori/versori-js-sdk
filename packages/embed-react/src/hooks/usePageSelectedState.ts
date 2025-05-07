import { useCallback, useState } from 'react';

export type UsePageSelectedStateHookState = {
    method: 'connect' | 'manage';
    projectId: string;
};

export type UsePageSelectedStateHook = {
    state?: UsePageSelectedStateHookState;

    onOpenChange: (open: boolean) => void;
    onConnectClick: (id: string) => void;
    onManageClick: (id: string) => void;
};

export function usePageSelectedState(): UsePageSelectedStateHook {
    const [state, setState] = useState<UsePageSelectedStateHookState | undefined>();

    const onOpenChange = useCallback((open: boolean) => setState((state) => (open ? state : undefined)), []);

    const onConnectClick = useCallback((id: string) => setState({ method: 'connect', projectId: id }), []);

    const onManageClick = useCallback((id: string) => setState({ method: 'manage', projectId: id }), []);

    return {
        state,
        onOpenChange,
        onConnectClick,
        onManageClick,
    };
}
