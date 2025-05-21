import { Button, ButtonProps } from '@radix-ui/themes';
import cx from 'classnames';
import { SyntheticEvent } from 'react';
import { CommonComponentProps, extractCommonProps } from '../../types/CommonComponentProps';

export type ConnectButtonProps = Omit<ButtonProps, 'variant'> &
    CommonComponentProps & {
        /**
         * IsDeployed indicates whether the integration is deployed and available to end users. If not deployed, the
         * integration cannot be activated.
         */
        isDeployed: boolean;

        /**
         * IsActivated indicates whether the integration is activated for the end user. If the integration is not
         * activated, the user can activate it from the embedded integration hub.
         */
        isActivated: boolean;

        onClick: (e: SyntheticEvent<HTMLButtonElement>) => void;
    };

export function ConnectButton({ isActivated, isDeployed, onClick, ...rest }: ConnectButtonProps) {
    const { commonProps, ...buttonProps } = extractCommonProps(rest);

    return (
        <Button
            id={commonProps.id}
            className={cx(commonProps.className, 'vi-IntegrationTile__Connect__button', {
                'vi-IntegrationTile__Connect__button--connected': isDeployed && isActivated,
                'vi-IntegrationTile__Connect__button--disconnected': isDeployed && !isActivated,
                'vi-IntegrationTile__Connect__button--disabled': !isDeployed,
            })}
            onClick={onClick}
            {...buttonProps}
            variant={!isDeployed || !isActivated ? 'solid' : 'outline'}
            disabled={!isDeployed}
        >
            {!isDeployed ? 'Coming Soon' : isActivated ? 'Manage' : 'Connect'}
        </Button>
    );
}
