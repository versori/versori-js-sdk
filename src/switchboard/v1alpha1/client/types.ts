import type createClient from 'openapi-fetch';
import type { paths } from '../generated/api.ts';

export type RawClient = ReturnType<typeof createClient<paths>>;
