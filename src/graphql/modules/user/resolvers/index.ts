const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@test.com',
    password: '123456',
  },
];

export const userResolvers = {
  Query: {
    users: async () => {
      return users;
    },
  },
};
