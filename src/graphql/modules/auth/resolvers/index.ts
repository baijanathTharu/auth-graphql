import { AuthModule } from '../generated-types/module-types';
import {
  createToken,
  createUser,
  getUserById,
  isTokenRevoked,
  loginUser,
  revokeTokenInDb,
} from '../services';
import { generateTokens, verifyToken } from '../utils';

export const authResolvers: AuthModule.Resolvers = {
  Query: {
    me: async (_, arg, { userId }) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const user = await getUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const { password, ...rest } = user;

      return rest;
    },

    newToken: async (_, _arg, { req }) => {
      // verfify refresh token
      const refreshTokenWithBearer =
        req.cookies['refresh-token'] ||
        (req.headers['refresh-token'] as string) ||
        '';
      const oldToken = refreshTokenWithBearer.split(' ')[1];

      // find if the refresh token is revoked
      const isRevoked = await isTokenRevoked(oldToken);
      if (isRevoked) {
        throw new Error('Refresh token is revoked');
      }

      const decodedRefreshToken = await verifyToken({
        token: oldToken,
      });

      if (!decodedRefreshToken.userId) {
        throw new Error('Invalid refresh token');
      }

      // generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens({
        userId: decodedRefreshToken.userId,
      });

      // save new refresh token to db
      const newToken = await createToken({
        userId: decodedRefreshToken.userId,
        refreshToken: newRefreshToken,
      });

      // revoken old token
      await revokeTokenInDb({ token: oldToken, isRevokedBy: newToken.id });

      return {
        done: true,
        accessToken,
        // 15 minutes
        accessTokenExpiresIn: new Date().getTime() + 15 * 60 * 1000,
        refreshToken: newRefreshToken,
        // 7 days
        refreshTokenExpiresIn: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      };
    },
  },
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
        // @ts-ignore
        if (e.code === 'P2002') {
          throw new Error('User already exists');
        }

        throw new Error(e as string);
      }
    },
    login: async (_, { loginInput }) => {
      try {
        const user = await loginUser(loginInput);

        const { accessToken, refreshToken } = generateTokens({
          userId: user.id,
        });

        await createToken({
          userId: user.id,
          refreshToken,
        });

        return {
          done: true,
          accessToken,
          refreshToken,
        };
      } catch (e) {
        console.log(e);
        throw new Error(e as string);
      }
    },
  },
};
