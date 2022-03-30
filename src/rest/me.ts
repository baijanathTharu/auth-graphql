import { Request, Response } from 'express';
import {
  isTokenRevoked,
  createToken,
  revokeTokenInDb,
} from '../graphql/modules/auth/services';
import { verifyToken, generateTokens } from '../graphql/modules/auth/utils';

// eslint-disable-next-line consistent-return
export async function getNewTokens(req: Request, res: Response) {
  try {
    // verfify refresh token
    const refreshTokenWithBearer =
      req.cookies['refresh-token'] ||
      (req.headers['refresh-token'] as string) ||
      '';
    const oldToken = refreshTokenWithBearer.split(' ')[1];

    if (!oldToken) {
      return res.status(400).send({
        message: 'No refresh token provided',
      });
    }

    // find if the refresh token is revoked
    const isRevoked = await isTokenRevoked(oldToken);
    if (isRevoked) {
      return res.status(400).send({
        message: 'Refresh token is revoked',
      });
    }

    const decodedRefreshToken = await verifyToken({
      token: oldToken,
    });

    if (!decodedRefreshToken.userId) {
      return res.status(400).send({
        message: 'Invalid refresh token',
      });
    }

    // generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: decodedRefreshToken.userId as number,
    });

    // save new refresh token to db
    const newToken = await createToken({
      userId: decodedRefreshToken.userId as number,
      refreshToken: newRefreshToken,
    });

    // revoken old token
    await revokeTokenInDb({ token: oldToken, isRevokedBy: newToken.id });

    return res.json({
      done: true,
      accessToken,
      // 15 minutes
      accessTokenExpiresIn: new Date().getTime() + 15 * 60 * 1000,
      refreshToken: newRefreshToken,
      // 7 days
      refreshTokenExpiresIn: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
    });
  } catch (e: any) {
    console.log(e);
    res.status(400).send({
      message: e.message,
    });
  }
}
