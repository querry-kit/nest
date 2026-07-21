import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BooksController } from './books/books.controller.js';
import { BooksService, createDemoAbility, type DemoAbility } from './books/books.service.js';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply((req: { ability?: DemoAbility }, _res: unknown, next: () => void) => {
        req.ability = createDemoAbility();
        next();
      })
      .forRoutes('*');
  }
}
