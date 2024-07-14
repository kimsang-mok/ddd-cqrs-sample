import { IQueryHandler } from '@nestjs/cqrs';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool } from 'slonik';

export class FindUsersQueryHandler implements IQueryHandler {
  constructor(
    @InjectPool()
    private readonly pool: DatabasePool,
  ) {}
}
