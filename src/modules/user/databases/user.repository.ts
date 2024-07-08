import { Injectable, Logger } from '@nestjs/common';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()),
  email: z.string().email(),
  country: z.string().min(1).max(20),
  postalCode: z.string().min(1).max(20),
  street: z.string().min(1).max(255),
  role: z.nativeEnum(UserRoles),
});

export type UserModel = z.TypeOf<typeof userSchema>;

@Injectable()
export class UserRepository
  extends SqlRepositoryBase<UserEntity, UserModel>
  implements UserRepositoryPort
{
  protected tableName = 'users';
}
