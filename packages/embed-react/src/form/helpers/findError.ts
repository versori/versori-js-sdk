import * as yup from 'yup';

export function findError(errors: yup.ValidationError[], path: string): string | undefined {
    return errors.find((error) => error.path === path)?.errors.join('\n');
}
