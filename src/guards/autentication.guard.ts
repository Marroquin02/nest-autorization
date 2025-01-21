import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ForbiddenException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, RESOURCES_KEY, SCOPES_KEY } from '../constants';
import { extractRequest, parseToken } from 'src/utils/token.util';

@Injectable()
export abstract class AutenticationGuard implements CanActivate {
  private readonly logger = new Logger(AutenticationGuard.name);
  constructor(private reflector: Reflector) {}

  abstract validateUserPermissions(
    context: ExecutionContext,
    resource: string,
    requiredScopes: string[],
  ): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Verificar si el endpoint es público
      const isPublic = this.reflector.get<boolean>(
        IS_PUBLIC_KEY,
        context.getHandler(),
      );
      if (isPublic) {
        return true;
      }

      // Obtener el recurso (resource) del controlador
      const resource = this.reflector.get<string>(
        RESOURCES_KEY,
        context.getClass(),
      );
      if (!resource) {
        throw new BadRequestException('Recurso no encontrado');
      }

      // Obtener los scopes (scope) del manejador de la ruta
      const requiredScopes =
        this.reflector.get<string[]>(SCOPES_KEY, context.getHandler()) || [];

      if (!requiredScopes.length) {
        throw new BadRequestException('Scopes no encontrados');
      }

      const [request] = extractRequest(context);

      // if is not an HTTP request ignore this guard
      if (!request) {
        return true;
      }

      const jwt = this.extractJwt(request.headers);
      const isJwtEmpty = jwt === null || jwt === undefined;

      if (isJwtEmpty) {
        this.logger.log(`No JWT provided`);
        throw new UnauthorizedException('No JWT provided');
      }

      const isAuthorized = await this.validateUserPermissions(
        context,
        resource,
        requiredScopes,
      );

      if (isAuthorized) {
        return true;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ForbiddenException('Unauthorized access');
    }
  }

  private extractJwt(headers: { [key: string]: string }) {
    if (headers && !headers.authorization) {
      this.logger.log(`No authorization header`);
      return null;
    }

    const auth = headers.authorization.split(' ');

    // We only allow bearer
    if (auth[0].toLowerCase() !== 'bearer') {
      this.logger.log(`No bearer header`);
      return null;
    } else if (auth.length === 1) {
      return auth[0];
    }

    return auth[1];
  }
}
