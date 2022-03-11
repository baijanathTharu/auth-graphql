/* eslint-disable import/extensions */
import { createApplication } from 'graphql-modules';
import { UserModule } from './user';

// This is your application, it contains your GraphQL schema and the implementation of it.
const application = createApplication({
  modules: [UserModule],
});

// This is your actual GraphQL schema
export const applicationSchema = application.createSchemaForApollo();
