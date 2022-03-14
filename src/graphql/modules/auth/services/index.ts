import {
  InputMaybe,
  LoginInput,
  SignUpInput,
} from '~/src/graphql/generated-types/graphql';
import { db } from '~/src/lib';
import { comparePassword, hashPassword } from '../utils';

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

export async function loginUser(
  loginInput: InputMaybe<LoginInput> | undefined
) {
  if (!loginInput) {
    throw new Error('loginInput is required');
  }

  const { email, password } = loginInput;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const [err, isCorrect] = await comparePassword({
    password,
    hashedPassword: user.password,
  });

  if (err) {
    throw new Error('Something went wrong while logging in');
  }

  if (!isCorrect) {
    throw new Error('Wrong password or email');
  }

  return user;
}
