import { User } from '../entities/users.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmModelFactory } from '../../../../../shared/factories/typeorm-model.factory';

export class UsersFactory extends TypeOrmModelFactory<User> {
  constructor() {
    // @ts-expect-error should work since this will be instanciated for every item created
    super(User);
  }

  protected getAllProperties(): User {
    return {
      id: faker.number.int(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: null,
    } satisfies User;
  }
}
