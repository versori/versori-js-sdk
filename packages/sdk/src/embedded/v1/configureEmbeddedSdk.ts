import { configureAuth } from '../../internal/configureAuth';
import { configureErrorHandling } from '../../internal/configureErrorHandling';
import { Production, SdkConfig } from '../../util';
import type { Config } from './generated/client/types.gen';
import { client as globalClient } from './generated/client.gen';

export const PathPrefix = `/embedded/v1`;

const defaults: Config = {
    throwOnError: true,
};

export function configureEmbeddedSdk(config: SdkConfig, client = globalClient) {
    const { baseUrl = `${Production}${PathPrefix}`, auth, ...rest } = config;

    client.setConfig({
        baseUrl,
        ...defaults,
        ...rest,
    });

    if (auth) {
        configureAuth(client, auth);
    }

    configureErrorHandling(client, config.errorHandling);
}
