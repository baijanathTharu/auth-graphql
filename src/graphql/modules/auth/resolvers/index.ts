import { AuthModule } from '../generated-types/module-types';

export const authResolvers: AuthModule.Resolvers = {
  Mutation: {
    signUp: (_, { signUpInput }) => {
      // eslint-disable-next-line no-console
      console.log('signUpInput', signUpInput);
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
