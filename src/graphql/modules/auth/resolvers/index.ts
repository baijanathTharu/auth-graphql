import { AuthModule } from '../generated-types/module-types';
import { getUserById } from '../services';

export const authResolvers: AuthModule.Resolvers = {
  Mutation: {
    signUp: async (_, { signUpInput }) => {
      const user = await getUserById(1);
      // eslint-disable-next-line no-console
      console.log('user', user);
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
