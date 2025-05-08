import { Flex, Spinner } from '@radix-ui/themes';
import cx from 'classnames';
import { useCallback, useEffect } from 'react';
import { useVersoriEmbeddedContext } from '../../provider/useVersoriEmbeddedContext';
import { ConnectSingleTemplate } from './ConnectSingleTemplate';
import { ConnectProps } from './types';
import { ActivationCreate } from '@versori/sdk/platform';

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
    const { endUser, orgId } = client;
    const { project, connectionTemplates, onConnect, className, ...commonProps } = props;

    const onConnectInternal = useCallback(
        (payload: ActivationCreate) => {
            if (!endUser) {
                throw new Error('end user must be loaded before connecting');
            }

            return onConnect({
                ...payload,
                userId: endUser.externalId,
            });
        },
        [endUser]
    );

    if (connectionTemplates.length === 1) {
        return (
            <ConnectSingleTemplate
                {...props}
                orgId={orgId}
                template={connectionTemplates[0]}
                onConnect={onConnectInternal}
            />
        );
    }

    return (
        <Flex className={cx('Connect', className)} {...commonProps}>
            {connectionTemplates.map((template) => (
                <ConnectSingleTemplate
                    {...props}
                    key={template.id}
                    orgId={orgId}
                    template={template}
                    onConnect={onConnectInternal}
                    className={cx('ConnectSingleTemplate', className)}
                />
            ))}
        </Flex>
    );
}
