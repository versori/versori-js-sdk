/**
 * AuthSigningKeyJwt denotes the end-user is authenticated to Versori using a JWT signed by a signing key
 * issued to the Versori organisation.
 *
 * The `sub` claim of the JWT is used to identify the user's external ID.
 */
export type EndUserAuthSigningKeyJwt = {
    type: 'jwt';
    token: string;
};
