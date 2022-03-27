import { createServer } from '@graphql-yoga/node';
import { applicationSchema } from './modules';

export const graphQLServer = createServer({
  maskedErrors: false,
  schema: applicationSchema,
  context: async (arg) => ({
    request: arg.request,
    req: arg.request,
  }),
});
