import { createApplication } from 'graphql-modules';
import { AuthModule } from './auth';
import { PrescriptionModule } from './prescription';
import { UserModule } from './user';

// This is your application, it contains your GraphQL schema and the implementation of it.
const application = createApplication({
  modules: [UserModule, AuthModule, PrescriptionModule],
});

// This is your actual GraphQL schema
export const applicationSchema = application.createSchemaForApollo();
