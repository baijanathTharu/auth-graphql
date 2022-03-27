import { gql } from 'graphql-modules';

export const authTypedefs = gql`
  type Mutation {
    signUp(signUpInput: SignUpInput): AuthPayload!
    login(loginInput: LoginInput): AuthPayload!
  }

  type Query {
    me: UserWithoutPassword!
    # rotate refresh token - old token is passed in the header
    newToken: AuthPayload!
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
