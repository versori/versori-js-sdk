import { CheckboxProps } from '@radix-ui/react-checkbox';
import { Label } from '@radix-ui/react-label';
import { Checkbox, Flex, TextField } from '@radix-ui/themes';
import { startTransition, SyntheticEvent, useCallback, useState } from 'react';
import { FieldError } from '../../form/FieldError';
import { CredentialDataProps } from './types';

type CheckedState = CheckboxProps['checked'];

export function CredentialDataBinary({ name, data, onDataChange, errors }: CredentialDataProps<'binary'>) {
    const [isBase64, setBase64] = useState<CheckedState>(false);

    const onBase64Change = useCallback(
        (checked: CheckedState) => {
            if (isBase64 === checked) {
                return;
            }

            startTransition(() => {
                setBase64(checked);
                onDataChange({
                    valueBase64: checked ? btoa(data.valueBase64) : atob(data.valueBase64),
                });
            });
        },
        [data.valueBase64, isBase64, onDataChange]
    );

    const onChange = useCallback(
        (e: SyntheticEvent<HTMLInputElement>) =>
            onDataChange({
                valueBase64: isBase64 ? e.currentTarget.value : btoa(e.currentTarget.value),
            }),
        [onDataChange, isBase64]
    );

    return (
        <Flex align="center" gap="2">
            <TextField.Root value={data.valueBase64} onChange={onChange} aria-label="value" />
            <Label>
                <Checkbox checked={isBase64} onCheckedChange={onBase64Change} />
                Data is base64 encoded
            </Label>
            <FieldError name={`${name}.valueBase64`} errors={errors} />
        </Flex>
    );
}
