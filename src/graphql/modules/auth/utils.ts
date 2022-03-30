/* eslint-disable import/no-cycle */
/* eslint-disable prefer-promise-reject-errors */
import 'dotenv/config';
import { compare, genSalt, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { ServerResponse } from 'http';
import { Request, Response } from 'express';
import { createToken, isTokenRevoked, revokeTokenInDb } from './services';

const saltRounds = Number(process.env.SALT_ROUNDS) || 8;
const tokenSecret = process.env.TOKEN_SECRET || 'secret';

export function hashPassword(
  password: string
): Promise<[Error | null, string | null]> {
  return new Promise((resolve, reject) => {
    genSalt(saltRounds, (err, salt) => {
      if (err) {
        reject([err, null]);
      }
      hash(password, salt, (hashErr, hashedPassword) => {
        if (hashErr) {
          reject([hashErr, null]);
        }
        resolve([null, hashedPassword]);
      });
    });
  });
}

export function comparePassword({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}): Promise<[Error | null, boolean]> {
  return new Promise((resolve, reject) => {
    compare(password, hashedPassword, (err, result) => {
      if (err) {
        reject([err, null]);
      }
      resolve([null, result]);
    });
  });
}

export function generateTokens({ userId }: { userId: number }): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = sign({ userId }, tokenSecret, {
    expiresIn: process.env.ACCESS_TOKEN_AGE || '15m',
  });
  const refreshToken = sign({ userId }, tokenSecret, {
    expiresIn: process.env.REFRESH_TOKEN_AGE || '7d',
  });
  return {
    accessToken,
    refreshToken,
  };
}

// verify token
export async function verifyToken({ token }: { token: string }) {
  try {
    const decodedAccessToken = verify(token, tokenSecret) as {
      userId: number;
    };

    return {
      userId: decodedAccessToken.userId,
    };
  } catch (error) {
    console.log(error);
    return { userId: null };
  }
}

export function setCookies({
  res,
  cookieData,
}: {
  res: ServerResponse;
  cookieData: Array<{
    cookieName: string;
    cookieValue: string;
    maxAge: number;
  }>;
}) {
  res.writeHead(200, {
    'Set-Cookie': cookieData.map(
      ({ cookieName, cookieValue, maxAge }) =>
        `${cookieName}: ${cookieValue}; Max-Age=${maxAge}; HttpOnly; SameSite=lax; Secure=${
          process.env.NODE_ENV === 'production'
        };`
    ),
  });
}

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
      console.log('req');
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
    console.log('e', e);
    res.status(400).send({
      message: e.message,
    });
  }
}
