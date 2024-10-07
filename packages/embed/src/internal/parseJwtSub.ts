export function parseJwtSub(token: string): string {
    const parts = token.split('.');

    if (parts.length !== 3) {
        throw new Error(`Invalid JWT token, expected 3 parts separated by dots but received ${parts.length}`);
    }

    const payload = JSON.parse(atob(parts[1]));

    if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid JWT token, payload is not an object');
    }

    const sub = payload.sub;

    if (typeof sub !== 'string') {
        throw new Error('Invalid JWT token, `sub` claim is not a string');
    }

    return sub;
}
