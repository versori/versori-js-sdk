import { PlatformClient } from '@versori/embed';
import { createContext } from 'react';

export type VersoriEmbeddedDefaults = {
    tileImageSrc: string;
};

export type VersoriEmbeddedContextType = {
    client: PlatformClient;
    defaults: VersoriEmbeddedDefaults;
};

const DEFAULT_TILE_IMG_SRC = 'https://storage.googleapis.com/versori-assets/placeholder/switchboard/default-app-v2.svg';

export const DEFAULTS: VersoriEmbeddedDefaults = {
    tileImageSrc: DEFAULT_TILE_IMG_SRC,
};

export const VersoriEmbeddedContext = createContext<VersoriEmbeddedContextType | undefined>(undefined);
