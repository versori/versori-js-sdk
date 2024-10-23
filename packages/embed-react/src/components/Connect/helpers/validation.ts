import { CredentialType } from '@versori/sdk/connect';
import { AuthSchemeConfig, ConnectionCredentialCreate, CredentialCreate } from '@versori/sdk/embedded';
import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import { validate } from '../../../validation/validate';

const credentialCreateSchema: ObjectSchema<CredentialCreate> = yup.object({
    name: yup.string().defined(),
    type: yup.string<CredentialType>().defined(),
    data: yup
        .object()
        .noUnknown()
        .when('type', ([type], schema) => {
            switch (type) {
                case 'none':
                    return schema.shape({});
                case 'string':
                    return schema.shape({
                        value: yup.string().required(),
                    });
                case 'binary':
                    return schema.shape({
                        valueBase64: yup.string().required(),
                    });
                case 'basic-auth':
                    return schema.shape({
                        username: yup.string().required('Username is required'),
                        password: yup.string(),
                    });
                case 'oauth2-client':
                    return schema.shape({
                        clientId: yup.string().required('Client ID is required'),
                        clientSecret: yup.string().required('Client Secret is required'),
                        tokenUrl: yup.string().required('Token URL is required'),
                        scopes: yup.array().of(yup.string().required()).optional(),
                    });
                case 'oauth2-code':
                    // not sure what this credential type is actually meant to be?
                    return schema.shape({
                        code: yup.string().required('Not connected'),
                        state: yup.string().required(),
                    });
                case 'oauth2-password':
                    return schema.shape({
                        username: yup.string().required(),
                        password: yup.string().required(),
                    });
                case 'oauth2-token':
                    return schema.shape({
                        clientId: yup.string().required(),
                        clientSecret: yup.string().required(),
                        authorizeUrl: yup.string().required(),
                        tokenUrl: yup.string().required(),
                        scopes: yup.array().of(yup.string().required()).optional(),
                    });
                case 'custom-function':
                    return schema.shape({
                        functionUrl: yup.string().required(),
                        data: yup.string().defined(),
                    });
                case 'jwt-bearer':
                    return schema.test('jwt-bearer', 'JWT Bearer credentials are not supported', () => false);
                default:
                    // this should never happen, as we have a complete
                    return schema.test('unknown-type', 'Unknown credential type', () => false);
            }
        }),
});

const connectionCredentialSchema: ObjectSchema<ConnectionCredentialCreate> = yup.object({
    // this is not provided by the user, the API will error if this is not valid
    authSchemeConfig: yup.object<AuthSchemeConfig>({}).required() as unknown as ObjectSchema<AuthSchemeConfig>,
    credential: credentialCreateSchema.defined(),
});

// const connectionVariableSchema: ObjectSchema<ConnectionVariable> = yup.object({
//     id: yup.string().required(), // id is not validated as it's auto-assigned
//     name: yup.string().required('name is required').min(1, 'name cannot be empty'),
//     value: yup.string().defined().strict(),
// });
//
// const connectionCreateSchema: ObjectSchema<ConnectionCreate> = yup.object({
//     name: yup.string().required().min(3).max(26),
//     credentials: yup
//         .object({
//             action: yup.array().of(connectionCredentialSchema).required(),
//             trigger: yup.array().of(connectionCredentialSchema).required(),
//         })
//         .test(
//             'credentials',
//             'At least one action or trigger credential is required',
//             ({ action, trigger }) => action.length > 0 || trigger.length > 0
//         ),
//     variables: yup.array().of(connectionVariableSchema).required(),
// });

export function validateConnectionCredentialCreate(values: ConnectionCredentialCreate): yup.ValidationError[] {
    return validate(connectionCredentialSchema, values);
}
