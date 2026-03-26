import { Request, Response } from 'express';
import { prisma } from '../app';

export class UserController {
  async list(req: Request, res: Response) {
    const users = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, criadoEm: true }
    });
    return res.json(users);
  }
}
