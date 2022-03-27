import { Request, Response } from 'express';

export interface ResolverContext {
  req: Request;
  userId: number;
  res: Response;
}
