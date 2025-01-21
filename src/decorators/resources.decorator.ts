import { SetMetadata } from '@nestjs/common';

const RESOURCES_KEY = 'resources';
export const Resources = (resource: string) =>
  SetMetadata(RESOURCES_KEY, resource);
