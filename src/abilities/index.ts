import { User, Prescription, UserRole, Role } from '@prisma/client';
import { AbilityClass, AbilityBuilder } from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';

type AppAbility = PrismaAbility<
  [
    string,
    // @ts-ignore
    Subjects<{
      User: User;
      UserRole: UserRole;
      Prescription: Prescription;
    }>
  ]
>;

export const doctorAbility = (userRoles: Role[]) => {
  const Ability = PrismaAbility as AbilityClass<AppAbility>;
  const { can, build } = new AbilityBuilder(Ability);

  if (userRoles.includes(Role.DOCTOR)) {
    can('write', 'Prescription');
  }

  return build();
};

const ab = doctorAbility([Role.DOCTOR]);
ab.can('write', 'Prescription');
