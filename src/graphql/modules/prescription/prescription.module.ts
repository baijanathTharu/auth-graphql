import { createModule } from 'graphql-modules';
import { resolvers } from './resolvers';
import { typedefs } from './typedefs';

export const PrescriptionModule = createModule({
  id: 'prescription',
  dirname: __dirname,
  typeDefs: typedefs,
  resolvers,
});
