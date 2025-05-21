import { Button, Flex, TextField } from '@radix-ui/themes';
import { FormEvent, SyntheticEvent, useCallback, useId, useState } from 'react';

export type ExternalIdFormProps = {
    onSubmit: (externalId: string) => void;
};

export function ExternalIdForm({ onSubmit }: ExternalIdFormProps) {
    const [value, setValue] = useState('');
    const inputId = useId();

    const onSubmitInternal = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            onSubmit(value);
        },
        [onSubmit, value]
    );

    const onChangeInternal = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    }, []);

    return (
        <Flex gap="2" align="center" asChild>
            <form onSubmit={onSubmitInternal}>
                <label htmlFor={inputId}>External ID</label>
                <Flex flexGrow="1" asChild>
                    <TextField.Root
                        id={inputId}
                        name="externalId"
                        value={value}
                        onChange={onChangeInternal}
                        data-1p-ignore="true"
                        data-lpignore="true"
                    />
                </Flex>

                <Button type="submit">Save</Button>
            </form>
        </Flex>
    );
}
