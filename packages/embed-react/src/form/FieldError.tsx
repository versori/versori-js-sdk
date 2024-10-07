import { Text } from '@radix-ui/themes';
import * as yup from 'yup';
import { findError } from './helpers/findError';
import './FieldError.scss';

export type FieldErrorProps = {
    name: string;
    errors?: yup.ValidationError[];
};

export function FieldError({ name, errors = [] }: FieldErrorProps) {
    const error = findError(errors, name);
    if (!error) {
        return undefined;
    }

    const errorContainsDot = error.includes('.');

    return (
        <Text size="1" color="red" align="right" className="vi-FieldError">
            {errorContainsDot ? error.substring(name.lastIndexOf('.') + 1) : error}
        </Text>
    );
}
