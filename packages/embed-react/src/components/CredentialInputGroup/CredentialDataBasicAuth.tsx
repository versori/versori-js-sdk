import { Label } from '@radix-ui/react-label';
import { Box, Flex, TextField } from '@radix-ui/themes';
import { SyntheticEvent, useCallback } from 'react';
import { FieldError } from '../../form/FieldError';
import { CredentialDataProps } from './types';

export function CredentialDataBasicAuth({ id, name, data, onDataChange, errors }: CredentialDataProps<'basic-auth'>) {
    const onUserChange = useCallback(
        (e: SyntheticEvent<HTMLInputElement>) =>
            onDataChange({
                username: e.currentTarget.value,
                password: data.password,
            }),
        [data.password, onDataChange]
    );

    const onPasswordChange = useCallback(
        (e: SyntheticEvent<HTMLInputElement>) =>
            onDataChange({
                username: data.username,
                password: e.currentTarget.value,
            }),
        [data.username, onDataChange]
    );

    return (
        <Flex gap="4" mb="4" wrap={{ initial: 'wrap', xs: 'nowrap' }}>
            <Box flexBasis={{ initial: '100%', xs: '50%' }}>
                <Label htmlFor={`credential-basicAuth-username-${id}`}>Username</Label>
                <Flex flexGrow="1" asChild>
                    <TextField.Root
                        id={`credential-basicAuth-username-${id}`}
                        value={data.username}
                        onChange={onUserChange}
                    />
                </Flex>
                <FieldError name={`${name}.username`} errors={errors} />
            </Box>
            <Box flexBasis={{ initial: '100%', xs: '50%' }}>
                <Label htmlFor={`credential-basicAuth-password-${id}`}>Password</Label>
                <Flex flexGrow="1" asChild>
                    <TextField.Root
                        id={`credential-basicAuth-password-${id}`}
                        value={data.password}
                        onChange={onPasswordChange}
                    />
                </Flex>
                <FieldError name={`${name}.password`} errors={errors} />
            </Box>
        </Flex>
    );
}
