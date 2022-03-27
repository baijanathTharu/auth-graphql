/* eslint-disable prefer-promise-reject-errors */
import 'dotenv/config';
import { compare, genSalt, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { ServerResponse } from 'http';

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
    expiresIn: '1m',
  });
  const refreshToken = sign({ userId }, tokenSecret, {
    expiresIn: '2m',
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
