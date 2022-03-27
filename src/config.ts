import 'dotenv/config';

export const token = {
  REFRESH_TOKEN_AGE: process.env.REFRESH_TOKEN_AGE || 2 * 60 * 1000, // 2 minutes
  ACCESS_TOKEN_AGE: process.env.ACCESS_TOKEN_AGE || 1 * 60 * 1000, // 1 minute
};
