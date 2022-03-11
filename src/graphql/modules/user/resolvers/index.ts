import { UserModule } from '../generated-types/module-types';

const users: UserModule.User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@test.com',
    password: '123456',
  },
];

export const userResolvers: UserModule.Resolvers = {
  Query: {
    users: () => users,
  },
};
