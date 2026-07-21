/**
 * Constructor type accepted by DTO schema helpers.
 */
export type DtoClass = { new (...args: any[]): unknown };

/**
 * Reflect shape when reflect-metadata has patched metadata accessors onto it.
 */
export type ReflectWithMetadata = typeof Reflect & {
  getMetadata?: (metadataKey: string, target: object, propertyKey?: string | symbol) => unknown;
};

/**
 * Swagger property metadata used by @nestjs/swagger decorators.
 */
export type SwaggerPropertyMetadata = {
  type?: unknown;
};
