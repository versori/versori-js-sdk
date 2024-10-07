import { Label } from '@radix-ui/react-label';
import { Box, Flex, TextField } from '@radix-ui/themes';
import { AuthSchemeType } from '@versori/sdk/connect';
import { SyntheticEvent, useCallback } from 'react';
import { FieldError } from '../../form/FieldError';
import { CredentialDataProps } from './types';

const LABELS: { [K in AuthSchemeType]?: string } = {
    'api-key': 'API Key',
};

export function CredentialDataString({
    id,
    name,
    data,
    onDataChange,
    errors,
    authSchemeConfig,
}: CredentialDataProps<'string'>) {
    const onChange = useCallback(
        (e: SyntheticEvent<HTMLInputElement>) =>
            onDataChange({
                value: e.currentTarget.value,
            }),
        [onDataChange]
    );

    return (
        <Flex mb="4">
            <Box flexBasis="100%">
                <Label htmlFor={`credential-string-${id}`}>{LABELS[authSchemeConfig.schemeType] ?? 'Value'}</Label>
                <TextField.Root id={`credential-string-${id}`} value={data.value} onChange={onChange} />
                <FieldError name={`${name}.value`} errors={errors} />
            </Box>
        </Flex>
    );
}
