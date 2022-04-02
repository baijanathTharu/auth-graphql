/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { PrismaClient, Role, User } from '@prisma/client';

const password = '$2b$08$DS5rroxVQrT0grheCyiR/ueqbS4A.EMMQR9yVeMn4Ty1Vh1q/yj2G'; // hash for password

const users: Array<Pick<User, 'name' | 'email' | 'password'>> = [
  {
    name: 'Ram',
    email: 'ram@test.com',
    password,
  },
  {
    name: 'Syam',
    email: 'shyam@test.com',
    password,
  },
  {
    name: 'Hari',
    email: 'hari@test.com',
    password,
  },
  {
    name: 'Sita',
    email: 'sita@test.com',
    password,
  },
];

const userRoles = [
  {
    email: 'ram@test.com',
    roles: [Role.DOCTOR],
  },
  {
    email: 'shyam@test.com',
    roles: [Role.DOCTOR],
  },
  {
    email: 'hari@test.com',
    roles: [Role.PATIENT],
  },
  {
    email: 'sita@test.com',
    roles: [Role.Nurse],
  },
];

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.createMany({
      data: users,
    });

    // assign roles

    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < userRoles.length; i++) {
      const userRole = userRoles[i];

      const user = await prisma.user.findUnique({
        where: {
          email: userRole.email,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      await prisma.userRole.createMany({
        data: userRole.roles.map((role) => ({
          role,
          userId: user.id,
        })),
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.log('error', error);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
