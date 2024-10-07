import { Label } from '@radix-ui/react-label';
import { Box, Flex, TextField } from '@radix-ui/themes';
import { SyntheticEvent, useCallback } from 'react';
import { FieldError } from '../../form/FieldError';
import { CredentialDataProps } from './types';

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
                ...data,
                clientId: e.currentTarget.value,
            }),
        [data, onDataChange]
    );

    const onClientSecretChange = useCallback(
        (e: SyntheticEvent<HTMLInputElement>) =>
            onDataChange({
                ...data,
                clientSecret: e.currentTarget.value,
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
                        value={data.clientId}
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
                        value={data.clientSecret}
                        onChange={onClientSecretChange}
                    />
                </Flex>
            </Box>
        </Flex>
    );
}
