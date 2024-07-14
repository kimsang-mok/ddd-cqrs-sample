import { Body, Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { UserPaginatedResponseDto } from '../../domain/dtos/user.paginated.response.dto';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindUsersRequestDto } from './find-users.request.dto';
import { Paginated } from '@src/libs/ddd';
import { PaginatedQueryRequestDto } from '@src/libs/api/paginated-query.request.dto';
import { FindUsersQuery } from './find-users.query';
import { Result } from 'oxide.ts';
import { ResponseBase } from '@src/libs/api/response.base';
import { UserEntity } from '../../domain/user.entity';

@Controller(routesV1.version)
export class FindUserHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(routesV1.user.root)
  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPaginatedResponseDto,
  })
  async findUsers(
    @Body() request: FindUsersRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UserPaginatedResponseDto> {
    const query = new FindUsersQuery({
      ...request,
      limit: queryParams?.limit,
      page: queryParams?.page,
    });
    const result: Result<
      Paginated<UserEntity>,
      Error
    > = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new UserPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map((record) => {
        const user = record.getProps();
        return {
          ...new ResponseBase(record),
          email: user.email,
          country: user.address.country,
          street: user.address.street,
          postalCode: user.address.postalCode,
        };
      }),
    });
  }
}
