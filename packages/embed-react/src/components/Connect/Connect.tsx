import { Flex, Spinner } from '@radix-ui/themes';
import { ActivationConnectionCreate, ActivationCreate, HubConnectionTemplate } from '@versori/sdk/embedded';
import cx from 'classnames';
import { useCallback, useEffect } from 'react';
import { useVersoriEmbeddedContext } from '../../provider/useVersoriEmbeddedContext';
import { ConnectSingleTemplate } from './ConnectSingleTemplate';
import { ConnectProps } from './types';

function isNonPrimary(t: HubConnectionTemplate) {
    return !t.isPrimary && t.isUsed;
}

function isPrimary(t: HubConnectionTemplate) {
    return t.isPrimary && t.isUsed;
}

/**
 * Connect to an integration. This component is the entrypoint for connecting to an integration,
 * it determines which flow the user should follow based on the integration's connection templates.
 *
 * For integrations with a single connection template, the `<ConnectSingleTemplate />` component is
 * rendered. Integrations with multiple connection templates are not yet supported by these
 * components.
 */
export function Connect(props: ConnectProps) {
    const { client } = useVersoriEmbeddedContext();
    const { endUser } = client;
    const { integration, onConnect, className, ...commonProps } = props;

    // const primaryTemplate = integration.connectionTemplates.find((template) => template.isPrimary && template.isUsed);
    const nonPrimaryTemplates = integration.connectionTemplates.filter(isNonPrimary);

    const shouldAutoConnect = nonPrimaryTemplates.length === 0;

    const onConnectInternal = useCallback((payload: ActivationCreate) => {
        if (!endUser) {
            throw new Error('end user must be loaded before connecting');
        }

        const primaryTemplate = integration.connectionTemplates.find(isPrimary);

        const nonExternalConnections: ActivationConnectionCreate[] = primaryTemplate ? [{
            templateId: primaryTemplate.id,
            connectionId: endUser.primaryConnection.id,
        }] : [];

        return onConnect({
            ...payload,
            connections: [...nonExternalConnections, ...payload.connections],
        });
    }, [endUser]);

    useEffect(() => {
        if (endUser && shouldAutoConnect) {
            // auto-connect if there are no non-primary templates
            onConnectInternal({
                userId: client.userExternalId,
                connections: [],
                integrationId: integration.id,
                variables: [],
            }).then().catch(err => {
                console.error("Failed to auto-connect", err);
            });

            return;
        }
    }, [endUser, client, shouldAutoConnect, onConnect, integration]);

    if (shouldAutoConnect) {
        return (
            <Flex justify="center">
                <Spinner />
            </Flex>
        );
    }

    if (nonPrimaryTemplates.length === 1) {
        return <ConnectSingleTemplate {...props} template={nonPrimaryTemplates[0]} onConnect={onConnectInternal} />;
    }

    // TODO: support multiple connection templates
    return (
        <div {...commonProps} className={cx(className, 'vi-Connect')}>
            Multiple connection templates not supported
        </div>
    );
}
