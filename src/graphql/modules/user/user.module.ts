import { createModule } from 'graphql-modules';
import { userResolvers } from './resolvers';
import { userTypedefs } from './typedefs';

export const UserModule = createModule({
  id: 'user',
  dirname: __dirname,
  typeDefs: userTypedefs,
  resolvers: userResolvers,
});
