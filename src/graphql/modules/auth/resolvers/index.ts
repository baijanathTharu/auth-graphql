import { AuthModule } from '../generated-types/module-types';
import { createUser } from '../services';

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
    login: (_, { loginInput }) => {
      // eslint-disable-next-line no-console
      console.log('loginInput', loginInput);
      return {
        done: true,
      };
    },
  },
};
