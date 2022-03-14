import { AuthModule } from '../generated-types/module-types';
import { createUser, loginUser } from '../services';

export const authResolvers: AuthModule.Resolvers = {
  Mutation: {
    signUp: async (_, { signUpInput }) => {
      const created = await createUser(signUpInput);

      if (!created) {
        throw new Error('Something went wrong while saving data');
      }

      return {
        done: true,
      };
    },
    login: async (_, { loginInput }) => {
      await loginUser(loginInput);

      return {
        done: true,
      };
    },
  },
};
