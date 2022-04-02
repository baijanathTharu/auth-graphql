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

type CreateTokenInput = {
  userId: number;
  refreshToken: string;
};

export function createToken(createTokenInput: CreateTokenInput) {
  return db.loginToken.create({
    data: {
      userId: createTokenInput.userId,
      refreshToken: createTokenInput.refreshToken,
    },
  });
}

export async function isTokenRevoked(token: string) {
  const loginToken = await db.loginToken.findFirst({
    where: {
      refreshToken: token,
    },
  });

  return !!loginToken?.isRevokedBy;
}

export async function revokeTokenInDb({
  token,
  isRevokedBy,
}: {
  token: string;
  isRevokedBy: number;
}) {
  const loginToken = await db.loginToken.findFirst({
    where: {
      refreshToken: token,
    },
  });

  if (!loginToken) {
    throw new Error('Token not found');
  }

  return db.loginToken.update({
    where: {
      id: loginToken.id,
    },
    data: {
      isRevokedBy,
    },
  });
}

export const getUserRoles = async (userId: number) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const roles = await db.userRole.findMany({
    where: {
      userId,
    },
  });

  return roles.map(({ role }) => role);
};
