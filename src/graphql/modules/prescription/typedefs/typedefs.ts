import { gql } from 'graphql-modules';

export const typedefs = gql`
  type Mutation {
    createPrescription(
      input: CreatePrescriptionInput
    ): CreatePrescriptionPayload!
  }

  type Query {
    prescription(id: Int!): Prescription!
  }

  type Prescription {
    id: Int!
    prescribedTo: User!
    prescribedBy: User!
    prescription: String!
  }

  type CreatePrescriptionPayload {
    data: Prescription!
  }

  input CreatePrescriptionInput {
    prescribedTo: Int!
    prescribedBy: Int!
    prescription: String!
  }
`;
