import { AggregateID, AggregateRoot } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { CreateUserProps, UserProps, UserRoles } from '../user.type';
import { UserCreatedDomainEvent } from './events/user-created.domain-event';

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateUserProps): UserEntity {
    const id = randomUUID();
    /* Setting a default role since we are not accepting it during creation. */
    const props: UserProps = { ...create, role: UserRoles.guest };

    const user = new UserEntity({ id, props });

    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        email: props.email,
        ...props.address.unpack(),
      }),
    );
    return user;
  }

  private changeRole(newRole: UserRoles): void {
    this.props.role = newRole;
  }

  makeAdmin(): void {
    this.changeRole(UserRoles.admin);
  }

  makeModerator(): void {
    this.changeRole(UserRoles.moderator);
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
