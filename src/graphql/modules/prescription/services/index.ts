import { Role } from '@prisma/client';
import { appAbility } from '~/src/abilities';
import { CreatePrescriptionInput } from '~/src/graphql/generated-types/graphql';
import { db } from '~/src/lib';

export async function createPrescription(
  input: CreatePrescriptionInput,
  userRole: Role[],
  userId: number
) {
  const ability = appAbility(userRole, userId);

  if (!ability.can('write', 'Prescription')) {
    throw new Error('You are not allowed to create a prescription');
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

export async function getPrescription(
  id: number,
  userId: number,
  userRole: Role[]
) {
  const ability = appAbility(userRole, userId);

  if (!ability.can('write', 'Prescription')) {
    throw new Error('Not found');
  }

  const prescription = await db.prescription.findFirst({
    where: {
      id,
    },
    include: {
      prescribedBy: true,
      prescribedTo: true,
    },
  });

  return prescription;
}
