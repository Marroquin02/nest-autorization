import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ResourceScopesExplorer } from './utils/resource-scopes.explorer';

@Module({
  providers: [Reflector, ResourceScopesExplorer],
  exports: [ResourceScopesExplorer],
})
export class ResourceScopesModule {}
