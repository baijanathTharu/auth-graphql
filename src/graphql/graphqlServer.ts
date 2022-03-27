import { createServer } from '@graphql-yoga/node';
import { applicationSchema } from './modules';
import { verifyToken } from './modules/auth/utils';

export const graphQLServer = createServer({
  maskedErrors: false,
  schema: applicationSchema,
  context: async ({ req, res }) => {
    const accessToken =
      // @ts-ignore
      req.cookies['access-token'] ||
      (req.headers['access-token'] as string) ||
      '';

    const { userId } = await verifyToken({
      token: accessToken.split(' ')[1],
    });
    return {
      req,
      res,
      userId,
    };
  },
});
