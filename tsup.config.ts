import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    object: 'src/util/object/index.ts',
    fields: 'src/fields/index.ts',
    dto: 'src/dto/index.ts',
    pagination: 'src/pagination/index.ts',
    'query-service': 'src/query-service/index.ts',
    casl: 'src/casl/index.ts',
    decorators: 'src/decorators/index.ts',
    pipes: 'src/pipes/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'node24',
  external: [
    '@casl/ability',
    '@casl/prisma',
    '@nestjs/common',
    '@nestjs/core',
    '@nestjs/swagger',
    'class-transformer',
    'class-validator',
    'reflect-metadata',
    'qs',
  ],
});
