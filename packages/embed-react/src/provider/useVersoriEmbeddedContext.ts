import invariant from 'invariant';
import { useContext } from 'react';
import { VersoriEmbeddedContext, VersoriEmbeddedContextType } from './VersoriEmbeddedContext';

export function useVersoriEmbeddedContext(): VersoriEmbeddedContextType {
    const context = useContext(VersoriEmbeddedContext);

    invariant(context, 'useVersoriEmbeddedContext must be used within a VersoriEmbeddedProvider');

    return context;
}
