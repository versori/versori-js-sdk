import { configureConnectSdk, PathPrefix as ConnectApiPathPrefix } from './connect/v1/configureConnectSdk';
import { configureEmbeddedSdk, PathPrefix as EmbeddedApiPathPrefix } from './embedded/v1/configureEmbeddedSdk';
import { Production, SdkConfig } from './util';

export function configureSdk(config: SdkConfig) {
    const { baseUrl = Production, ...rest } = config;

    configureConnectSdk({
        baseUrl: `${baseUrl}${ConnectApiPathPrefix}`,
        ...rest,
    });

    configureEmbeddedSdk({
        baseUrl: `${baseUrl}/${EmbeddedApiPathPrefix}`,
        ...rest,
    });
}
