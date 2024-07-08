import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from './libs/application/context/ContextInterceptor';
import { ExceptionInterceptor } from './libs/application/interceptors/exception.interceptors';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RequestContextModule } from 'nestjs-request-context';
import { SlonikModule } from 'nestjs-slonik';
import { postgresConnectionUri } from './configs/database.config';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RequestContextModule,
    SlonikModule.forRoot({
      connectionUri: postgresConnectionUri,
    }),
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
