/* eslint-disable prefer-promise-reject-errors */
import 'dotenv/config';
import { genSalt, hash } from 'bcrypt';

const saltRounds = Number(process.env.SALT_ROUNDS) || 8;

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
