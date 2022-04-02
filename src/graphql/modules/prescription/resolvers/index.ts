import { getUserRoles } from '../../auth/services';
import { PrescriptionModule } from '../generated-types/module-types';
import { createPrescription } from '../services';

export const resolvers: PrescriptionModule.Resolvers = {
  Mutation: {
    createPrescription: async (_, { input }, { userId }) => {
      if (!input) {
        throw new Error('Invalid input');
      }

      const roles = await getUserRoles(userId);

      const created = await createPrescription(input, roles);

      return { data: created };
    },
  },
};
