import { ForbiddenError } from '@casl/ability';
import { Role } from '@prisma/client';
import { doctorAbility } from '~/src/abilities';
import { CreatePrescriptionInput } from '~/src/graphql/generated-types/graphql';
import { db } from '~/src/lib';

export async function createPrescription(
  input: CreatePrescriptionInput,
  userRole: Role[]
) {
  const ability = doctorAbility(userRole);

  if (!ability.can('write', 'Prescription')) {
    throw ForbiddenError.from(ability);
  }

  const prescription = await db.prescription.create({
    data: {
      prescription: input.prescription,
      prescribedById: input.prescribedBy,
      prescribedToId: input.prescribedTo,
    },
    include: {
      prescribedBy: true,
      prescribedTo: true,
    },
  });

  return prescription;
}
