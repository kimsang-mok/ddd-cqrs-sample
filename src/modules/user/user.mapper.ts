import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd';
import { UserEntity } from './domain/user.entity';
import { UserModel, userSchema } from './databases/user.repository';
import { UserResponseDto } from './domain/dtos/user.response.dto';
import { Address } from './domain/value-objects/address.value-object';

@Injectable()
export class UserMapper
  implements Mapper<UserEntity, UserModel, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserModel {
    const copy = entity.getProps();

    const { id, createdAt, updatedAt, email, address, role } = copy;
    const record: UserModel = {
      id,
      created_at: createdAt,
      updated_at: updatedAt,
      email,
      country: address.country,
      postal_code: address.postalCode,
      street: address.street,
      role: role,
    };
    return userSchema.parse(record);
  }

  toDomain(record: UserModel): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      props: {
        email: record.email,
        role: record.role,
        address: new Address({
          street: record.street,
          postalCode: record.postal_code,
          country: record.country,
        }),
      },
    });

    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto(entity);
    response.email = props.email;
    response.country = props.address.country;
    response.postalCode = props.address.postalCode;
    response.street = props.address.street;
    return response;
  }

  /* ^ Data returned to the user is whitelisted to avoid leaks.
     If a new property is added, like password or a
     credit card number, it won't be returned
     unless you specifically allow this.
     (avoid blacklisting, which will return everything
      but blacklisted items, which can lead to a data leak).
  */
}
