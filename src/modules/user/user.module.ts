import { Logger, Module, Provider } from '@nestjs/common';
import { UserRepository } from './databases/user.repository';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { CreateUserService } from './commands/create-user/create-user.service';
import { UserMapper } from './user.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_REPOSITORY } from './user.di-tokens';
import { DeleteUserService } from './commands/delete-user/delete-user.service';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.http-controller';

const httpControllers = [CreateUserHttpController, DeleteUserHttpController];

const commandHandlers: Provider[] = [CreateUserService, DeleteUserService];

const queryHandlers: Provider[] = [];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    // ...queryHandlers,
    ...mappers,
  ],
})
export class UserModule {}
