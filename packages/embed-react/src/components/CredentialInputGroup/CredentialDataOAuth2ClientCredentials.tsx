import { Label } from '@radix-ui/react-label';
import { Box, Flex, TextField } from '@radix-ui/themes';
import { SyntheticEvent, useCallback } from 'react';
import { FieldError } from '../../form/FieldError';
import { CredentialDataProps } from './types';
import { CredentialDataOAuth2Client } from '../../../../sdk/src/platform';

export function CredentialDataOAuth2ClientCredentials({
    id,
    name,
    data,
    onDataChange,
    errors,
}: CredentialDataProps<'oauth2-client'>) {
    const onClientIdChange = useCallback(
        (e: SyntheticEvent<HTMLInputElement>) =>
            onDataChange({
                oauth2Client: {
                    ...data.oauth2Client,
                    clientId: e.currentTarget.value,
                },
            }),
        [data, onDataChange]
    );

    const onClientSecretChange = useCallback(
        (e: SyntheticEvent<HTMLInputElement>) =>
            onDataChange({
                oauth2Client: {
                    ...data.oauth2Client,
                    clientSecret: e.currentTarget.value,
                },
            }),
        [data, onDataChange]
    );

    return (
        <Flex gap="2" wrap={{ initial: 'wrap', xs: 'nowrap' }}>
            <Box flexBasis={{ initial: '100%', xs: '50%' }}>
                <Flex justify="between" align="baseline">
                    <Label htmlFor={`credential-oauth2client-clientId-${id}`}>Client ID</Label>
                    <FieldError name={`${name}.username`} errors={errors} />
                </Flex>
                <Flex flexGrow="1" asChild>
                    <TextField.Root
                        id={`credential-oauth2client-clientId-${id}`}
                        value={data.oauth2Client.clientId}
                        onChange={onClientIdChange}
                    />
                </Flex>
            </Box>
            <Box flexBasis={{ initial: '100%', xs: '50%' }}>
                <Flex justify="between" align="baseline">
                    <Label htmlFor={`credential-oauth2client-clientSecret-${id}`}>Client Secret</Label>
                    <FieldError name={`${name}.password`} errors={errors} />
                </Flex>
                <Flex flexGrow="1" asChild>
                    <TextField.Root
                        id={`credential-oauth2client-clientSecret-${id}`}
                        value={data.oauth2Client.clientSecret}
                        onChange={onClientSecretChange}
                    />
                </Flex>
            </Box>
        </Flex>
    );
}
