import * as yup from 'yup';

function expandValidationError(error: yup.ValidationError): yup.ValidationError[] {
    if (error.inner.length === 0) {
        return [error];
    }

    return error.inner.flatMap((inner) => expandValidationError(inner));
}

export function validate<T>(schema: yup.Schema, value: T): yup.ValidationError[] {
    try {
        schema.validateSync(value, { abortEarly: false });
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return expandValidationError(err);
        }

        throw err;
    }

    return [];
}
