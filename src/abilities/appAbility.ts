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

export const appAbility = (userRoles: Role[], userId: number) => {
  const Ability = PrismaAbility as AbilityClass<AppAbility>;
  const { can, build } = new AbilityBuilder(Ability);

  if (userRoles.includes(Role.DOCTOR)) {
    can('write', 'Prescription');
    can('read', 'Prescription', {
      prescribedById: userId,
    });
  }

  return build();
};
