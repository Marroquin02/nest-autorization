import {
  Injectable,
  Controller,
  Injectable as InjectableDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResourceScopesExplorer {
  constructor(private reflector: Reflector) {}

  explore(appControllers: any[]): Record<string, string[]> {
    const resourceScopes: Record<string, string[]> = {};

    for (const controller of appControllers) {
      // Obtener el recurso del controlador
      const resource = this.reflector.get<string>('resources', controller);
      if (!resource) continue;

      // Obtener los métodos del controlador
      const methods = Object.getOwnPropertyNames(controller.prototype).filter(
        (methodName) =>
          typeof controller.prototype[methodName] === 'function' &&
          methodName !== 'constructor',
      );

      // Buscar los scopes de cada método
      const scopes: string[] = methods
        .map((method) =>
          this.reflector.get<string[]>('scopes', controller.prototype[method]),
        )
        .filter((scope) => scope) // Eliminar métodos sin scopes
        .flat();

      // Asociar recurso con scopes
      resourceScopes[resource] = Array.from(new Set(scopes));
    }

    return resourceScopes;
  }
}
