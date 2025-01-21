import { SetMetadata } from '@nestjs/common';

const SCOPES_KEY = 'scopes';
export const Scopes = (...scopes: string[]) => SetMetadata(SCOPES_KEY, scopes);
