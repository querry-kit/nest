import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BooksController } from './books.controller.js';
import { BooksService, type DemoAbility } from './books.service.js';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply((req: { ability?: DemoAbility }, _res: unknown, next: () => void) => {
        req.ability = {
          can: (action, subject) => subject === 'Book' && ['read', 'create', 'update', 'delete'].includes(action),
        };
        next();
      })
      .forRoutes('*');
  }
}
