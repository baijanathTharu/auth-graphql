/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global {}
  }
}

// add prisma to the NodeJS global type
// eslint-disable-next-line no-undef
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

export const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = db;
