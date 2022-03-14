import { Prisma } from '@prisma/client';
import { AuthModule } from '../generated-types/module-types';
import { createUser, loginUser } from '../services';

export const authResolvers: AuthModule.Resolvers = {
  Mutation: {
    signUp: async (_, { signUpInput }) => {
      try {
        const created = await createUser(signUpInput);

        if (!created) {
          throw new Error('Something went wrong while saving data');
        }

        return {
          done: true,
        };
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new Error('User already exists');
          }
        }

        throw new Error(e as string);
      }
    },
    login: async (_, { loginInput }) => {
      await loginUser(loginInput);

      return {
        done: true,
      };
    },
  },
};
