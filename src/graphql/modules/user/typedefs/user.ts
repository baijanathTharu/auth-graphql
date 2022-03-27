/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-modules';

export const userTypedefs = gql`
  type User {
    id: Int!
    name: String
    email: String!
    password: String!
  }

  type UserWithoutPassword {
    id: Int!
    name: String
    email: String!
  }

  type Query {
    users: [User!]!
  }
`;
