import { Flex, Spinner } from '@radix-ui/themes';
import { EmbedClient, initEmbedded, InitOptions } from '@versori/embed';
import merge from 'lodash/merge';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { LocaleObject, setLocale } from 'yup';
import {
    DEFAULTS,
    VersoriEmbeddedContext,
    VersoriEmbeddedContextType,
    VersoriEmbeddedDefaults,
} from './VersoriEmbeddedContext';

const DEFAULT_LOCALE: LocaleObject = {
    mixed: {
        required: 'Field is required',
    },
};

export type VersoriEmbeddedProviderValidation = {
    locale?: LocaleObject;
};

export type VersoriEmbeddedProviderProps = {
    options: InitOptions;
    children?: ReactNode;
    defaults?: Partial<VersoriEmbeddedDefaults>;
    validation?: VersoriEmbeddedProviderValidation;
};

export function VersoriEmbeddedProvider({
    children,
    defaults = {},
    validation = {},
    options,
}: VersoriEmbeddedProviderProps) {
    const [embeddedClient, setEmbeddedClient] = useState<EmbedClient | undefined>(undefined);

    useEffect(() => {
        initEmbedded(options).then(setEmbeddedClient);
    }, []);

    useEffect(() => {
        setLocale(merge(DEFAULT_LOCALE, validation.locale ?? {}));
    }, []);

    const value = useMemo<VersoriEmbeddedContextType | null>(() => {
        const mergedDefaults = {
            ...DEFAULTS,
            ...defaults,
        };

        if (!embeddedClient) {
            return null;
        }

        return { client: embeddedClient, defaults: mergedDefaults };
    }, [embeddedClient, defaults]);

    if (!value) {
        return (
            <Flex justify="center" align="center" height="100%">
                <Spinner />
            </Flex>
        );
    }

    return <VersoriEmbeddedContext.Provider value={value}>{children}</VersoriEmbeddedContext.Provider>;
}
