import { Label } from '@radix-ui/react-label';
import { Box, Flex, TextField } from '@radix-ui/themes';
import { SyntheticEvent, useCallback } from 'react';
import { FieldError } from '../../form/FieldError';
import { CredentialDataProps } from './types';

export function CredentialDataOAuth2Password({
    id,
    name,
    data,
    onDataChange,
    errors,
}: CredentialDataProps<'oauth2-password'>) {
    const onUserChange = useCallback(
        (e: SyntheticEvent<HTMLInputElement>) =>
            onDataChange({
                oauth2Password: {
                    username: e.currentTarget.value,
                    password: data.oauth2Password.password,
                }
            }),
        [data.oauth2Password, onDataChange]
    );

    const onPasswordChange = useCallback(
        (e: SyntheticEvent<HTMLInputElement>) =>
            onDataChange({
                oauth2Password: {
                    username: data.oauth2Password.username,
                    password: e.currentTarget.value,
                }
            }),
        [data.oauth2Password, onDataChange]
    );

    return (
        <Flex gap="2" wrap={{ initial: 'wrap', xs: 'nowrap' }}>
            <Box flexBasis={{ initial: '100%', xs: '50%' }}>
                <Flex justify="between" align="baseline">
                    <Label htmlFor={`credential-oauth2password-username-${id}`}>Username</Label>
                    <FieldError name={`${name}.username`} errors={errors} />
                </Flex>
                <Flex flexGrow="1" asChild>
                    <TextField.Root
                        id={`credential-oauth2password-username-${id}`}
                        value={data.oauth2Password.username}
                        onChange={onUserChange}
                    />
                </Flex>
            </Box>
            <Box flexBasis={{ initial: '100%', xs: '50%' }}>
                <Flex justify="between" align="baseline">
                    <Label htmlFor={`credential-oauth2password-password-${id}`}>Password</Label>
                    <FieldError name={`${name}.password`} errors={errors} />
                </Flex>
                <Flex flexGrow="1" asChild>
                    <TextField.Root
                        id={`credential-oauth2password-password-${id}`}
                        value={data.oauth2Password.password}
                        onChange={onPasswordChange}
                    />
                </Flex>
            </Box>
        </Flex>
    );
}
