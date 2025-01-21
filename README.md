# @marroquin02/nest-autorization

## Descripción

`@marroquin02/nest-autorization` es un módulo de autorización para aplicaciones desarrolladas con NestJS. Permite gestionar permisos basados en recursos y scopes, proporcionando decoradores, utilidades y guardias de seguridad para controlar el acceso a los endpoints de manera flexible y escalable.

## Características
- Soporte para decoradores personalizados como `@Public`, `@Resources`, y `@Scopes`.
- Exploración automática de recursos y scopes asociados a controladores y métodos.
- Implementación de un guardia de autenticación (`AutenticationGuard`) para validar permisos de usuario.

## Instalación

Ejecuta el siguiente comando para instalar el paquete:

```bash
npm install @marroquin02/nest-autorization
```

## Uso

### Configuración inicial

1. **Importar el módulo en tu aplicación**:

   Agrega el `ResourceScopesModule` a tu módulo principal u otros módulos relevantes:

   ```typescript
   import { Module } from '@nestjs/common';
   import { ResourceScopesModule } from '@marroquin02/nest-autorization';

   @Module({
     imports: [ResourceScopesModule],
   })
   export class AppModule {}
   ```

2. **Configurar el guardia de autenticación**:

   Implementa la clase abstracta `AutenticationGuard` para validar los permisos de los usuarios. Por ejemplo:

   ```typescript
   import { Injectable, ExecutionContext } from '@nestjs/common';
   import { AutenticationGuard } from '@marroquin02/nest-autorization';

   @Injectable()
   export class CustomAuthGuard extends AutenticationGuard {
     async validateUserPermissions(
       context: ExecutionContext,
       resource: string,
       requiredScopes: string[],
     ): Promise<boolean> {
       // Lógica personalizada para validar permisos
       return true;
     }
   }
   ```

3. **Asociar decoradores a tus controladores y métodos**:

   Utiliza los decoradores proporcionados para definir recursos, scopes y endpoints públicos:

   ```typescript
   import { Controller, Get } from '@nestjs/common';
   import { Resources, Scopes, Public } from '@marroquin02/nest-autorization';

   @Controller('example')
   @Resources('example-resource')
   export class ExampleController {
     @Get()
     @Scopes('read')
     getExample() {
       return 'This is a secured endpoint';
     }

     @Get('public')
     @Public()
     getPublicExample() {
       return 'This is a public endpoint';
     }
   }
   ```

## API del módulo

### Decoradores

- `@Public()`: Marca un endpoint como público, ignorando validaciones de autenticación.
- `@Resources(resource: string)`: Asocia un recurso al controlador.
- `@Scopes(...scopes: string[])`: Define los scopes necesarios para acceder a un método.

### Utilidades

- `extractRequest(context: ExecutionContext)`: Extrae la petición y la respuesta del contexto.
- `parseToken(token: string)`: Decodifica un token JWT para obtener su contenido.

### Guardias

- `AutenticationGuard`: Guardia base para manejar validaciones de permisos.

## Licencia

Este paquete utiliza una licencia UNLICENSED.

## Autor

Creado por [@marroquin02](https://npmjs.com/~marroquin02).

## Notas adicionales

Este módulo se encuentra en una versión inicial (0.0.1). Se recomienda realizar pruebas exhaustivas antes de su implementación en producción.

## Consideraciones importantes

### Manejo de excepciones globales

Para capturar y manejar excepciones globales en tu aplicación NestJS, utiliza un filtro de excepciones configurado de la siguiente manera:

```typescript
import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Lógica personalizada para manejar excepciones
  }
}
```

Es importante no especificar un tipo en el decorador `@Catch` para que este filtro pueda manejar cualquier tipo de excepción lanzada en la aplicación.

