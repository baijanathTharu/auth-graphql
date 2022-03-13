import { db } from '~/src/lib';

export function getUserById(id: number) {
  return db.user.findFirst({
    where: { id },
  });
}
