import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { FindUsersQuery } from './find-users.query';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@src/libs/ddd';
import { UserModel, userSchema } from '../../databases/user.repository';
import { UserMapper } from '../../user.mapper';

@QueryHandler(FindUsersQuery)
export class FindUsersService implements IQueryHandler {
  constructor(
    @InjectPool()
    private readonly pool: DatabasePool,
  ) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */
  async execute(
    query: FindUsersQuery,
  ): Promise<Result<Paginated<UserModel>, Error>> {
    /**
     * Constructing a query with Slonik.
     * More info: https://contra.com/p/AqZWWoUB-writing-composable-sql-using-java-script
     */

    const statement = sql.type(userSchema)`
    SELECT *
    FROM users
    WHERE 
     ${query.country ? sql`country = ${query.country}` : true} AND 
     ${query.street ? sql`street = ${query.street}` : true} AND
      ${query.postalCode ? sql`"postalCode" = ${query.postalCode}` : true}
    LIMIT ${query.limit}
    OFFSET ${query.offset}`;

    const records = await this.pool.query(statement);

    return Ok(
      new Paginated({
        data: records.rows,
        count: records.rowCount,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
