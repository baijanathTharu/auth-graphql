import { gql } from 'graphql-modules';

export const authTypedefs = gql`
  type Mutation {
    signUp(signUpInput: SignUpInput): AuthPayload!
    login(loginInput: LoginInput): AuthPayload!
  }

  input SignUpInput {
    email: String!
    name: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    done: Boolean!
  }
`;
