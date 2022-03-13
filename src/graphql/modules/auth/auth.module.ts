import { createModule } from 'graphql-modules';
import { authResolvers } from './resolvers';
import { authTypedefs } from './typedefs';

export const AuthModule = createModule({
  id: 'auth',
  dirname: __dirname,
  typeDefs: authTypedefs,
  resolvers: authResolvers,
});
