/* eslint-disable prefer-promise-reject-errors */
import 'dotenv/config';
import { compare, genSalt, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { Response } from 'express';

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

export function setCookie({
  res,
  cookieData,
  cookieName,
  maxAge = 15 * 60 * 1000, // 15 minutes
}: {
  res: Response;
  cookieData: string;
  cookieName: string;
  maxAge?: number;
}) {
  res.cookie(cookieName, `Bearer ${cookieData}`, {
    httpOnly: true,
    maxAge,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}
