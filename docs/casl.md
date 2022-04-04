# [CASL](https://casl.js.org/v5/en)

## Simple authorization model

An example with a health clinic

## Entities

1. Doctors

```ts
interface Doctor {
  id: number;
  name: string;
}
```

2. Nurses

```ts
interface Nurse {
  id: number;
  name: string;
}
```

3. Patients

```ts
interface Patient {
  id: number;
  name: string;
}
```

4. Prescriptions

```ts
interface Prescription {
  id: number;
  prescribedTo: number; // patient id
  prescribedBy: number; // doctor id
  prescription: string;
}
```

## Access Management

### Doctor

1. Doctor can attend patients assigned to him.
2. Doctor can write prescription to a patient if he/she is assigned to him.

### Nurse

1. Nurse cannot write prescription.
2. Nurse can attend patients assigned to him/her.

### Patient

1. Patient cannot attend other patient.
2. Patient cannot write prescriptions.

## Simple CASL Ability for blogging system

```js
import { User, Post, Prisma } from '@prisma/client';
import { AbilityClass, AbilityBuilder, subject } from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';

type AppAbility = PrismaAbility<[string, Subjects<{
  User: User,
  Post: Post
}>]>;
const AppAbility = PrismaAbility as AbilityClass<AppAbility>;
const { can, cannot, build } = new AbilityBuilder(AppAbility);

can('read', 'Post', { authorId: 1 });
cannot('read', 'Post', { title: { startsWith: '[WIP]:' } });

const ability = build();
ability.can('read', 'Post');
ability.can('read', subject('Post', { title: '...', authorId: 1 })));
```

## Ability for doctor

### Define ability

```ts
export const doctorAbility = (userRoles: Role[]) => {
  const Ability = PrismaAbility as AbilityClass<AppAbility>;
  const { can, build } = new AbilityBuilder(Ability);

  if (userRoles.includes(Role.DOCTOR)) {
    can('write', 'Prescription');
  }

  return build();
};
```

### Usage

```ts
export async function createPrescription(
  input: CreatePrescriptionInput,
  userRole: Role[]
) {
  const ability = doctorAbility(userRole);

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
```

## Creating Prescription By doctor

If user has not DOCTOR role, he will be forbidden to create prescription.

```graphql
mutation createPrescription {
  createPrescription(
    input: { prescribedTo: 3, prescribedBy: 4, prescription: "one" }
  ) {
    data {
      id
      prescribedTo {
        id
        name
      }
      prescribedBy {
        id
        name
      }
      prescription
    }
  }
}
```
