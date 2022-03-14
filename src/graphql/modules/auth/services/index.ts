import { InputMaybe, SignUpInput } from '~/src/graphql/generated-types/graphql';
import { db } from '~/src/lib';
import { hashPassword } from '../utils';

export function getUserById(id: number) {
  return db.user.findFirst({
    where: { id },
  });
}

export async function createUser(
  createUserInput: InputMaybe<SignUpInput> | undefined
) {
  if (!createUserInput) {
    throw new Error('createUserInput is required');
  }

  const { name, email, password } = createUserInput;

  const [hashErr, hashedPassword] = await hashPassword(password);
  if (hashErr || !hashedPassword) {
    throw new Error('Something went wrong while saving data');
  }

  return db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
}
