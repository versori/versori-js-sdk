import { Config } from '@hey-api/client-fetch';
import { configureAuth } from '../../internal/configureAuth';
import { configureErrorHandling } from '../../internal/configureErrorHandling';
import { Production, SdkConfig } from '../../util';
import { client as globalClient } from './generated';

export const PathPrefix = `/connect/v1`;

const defaults: Config = {
    throwOnError: true,
};

export function configureConnectSdk(config: SdkConfig, client = globalClient) {
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
