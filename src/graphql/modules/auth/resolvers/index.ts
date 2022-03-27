import { token } from '~/src/config';
import { AuthModule } from '../generated-types/module-types';
import {
  createToken,
  createUser,
  getUserById,
  isTokenRevoked,
  loginUser,
  revokeTokenInDb,
} from '../services';
import { generateTokens, setCookie, verifyToken } from '../utils';

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

    newToken: async (_, _arg, { req, res }) => {
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

      // set new access token cookie
      setCookie({
        res,
        cookieData: accessToken,
        cookieName: 'access-token',
        maxAge: token.ACCESS_TOKEN_AGE as number,
      });
      // set new refresh token cookie
      setCookie({
        res,
        cookieData: newRefreshToken,
        cookieName: 'refresh-token',
        maxAge: token.REFRESH_TOKEN_AGE as number,
      });

      return {
        done: true,
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
    login: async (_, { loginInput }, { res }) => {
      try {
        const user = await loginUser(loginInput);

        const { accessToken, refreshToken } = generateTokens({
          userId: user.id,
        });

        await createToken({
          userId: user.id,
          refreshToken,
        });

        // set cookie
        setCookie({
          res,
          cookieData: accessToken,
          cookieName: 'access-token',
          maxAge: token.ACCESS_TOKEN_AGE as number,
        });
        setCookie({
          res,
          cookieData: refreshToken,
          cookieName: 'refresh-token',
          maxAge: token.REFRESH_TOKEN_AGE as number,
        });

        return {
          done: true,
        };
      } catch (e) {
        console.log(e);
        throw new Error(e as string);
      }
    },
  },
};
