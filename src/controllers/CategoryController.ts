import { Request, Response } from 'express';
import { prisma } from '../app';
import { z } from 'zod';

const categorySchema = z.object({
  nome: z.string(),
  tipo: z.enum(['receita', 'despesa']),
  icone: z.string().default('tag'),
});

export class CategoryController {
  async list(req: Request, res: Response) {
    const categories = await prisma.categoria.findMany({
      where: { userId: req.userId }
    });
    return res.json(categories);
  }

  async create(req: Request, res: Response) {
    try {
      const data = categorySchema.parse(req.body);
      const category = await prisma.categoria.create({
        data: { 
          ...data, 
          tipo: data.tipo.toUpperCase() as any,
          userId: req.userId 
        }
      });
      return res.status(201).json(category);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}
