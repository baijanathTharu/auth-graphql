import { Prescription } from '~/src/graphql/generated-types/graphql';
import { getUserRoles } from '../../auth/services';
import { PrescriptionModule } from '../generated-types/module-types';
import { createPrescription, getPrescription } from '../services';

export const resolvers: PrescriptionModule.Resolvers = {
  Mutation: {
    createPrescription: async (_, { input }, { userId }) => {
      if (!input) {
        throw new Error('Invalid input');
      }

      const roles = await getUserRoles(userId);

      const created = await createPrescription(input, roles, userId);

      return { data: created };
    },
  },

  Query: {
    prescription: async (_, { id }, { userId }) => {
      const roles = await getUserRoles(userId);

      const p = (await getPrescription(id, userId, roles)) as Prescription;

      return p;
    },
  },
};
