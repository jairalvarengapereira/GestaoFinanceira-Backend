import { Request, Response } from 'express';
import { prisma } from '../app';
import { z } from 'zod';

const transactionSchema = z.object({
  descricao: z.string(),
  valor: z.number(),
  data: z.string(),
  tipo: z.enum(['receita', 'despesa']),
  categoriaId: z.number().optional(),
  status: z.enum(['pago', 'pendente']).default('pago'),
});

export class TransactionController {
  async list(req: Request, res: Response) {
    try {
      const transactions = await prisma.transacao.findMany({
        where: { userId: req.userId },
        include: { categoria: true },
        orderBy: { data: 'desc' }
      });
      return res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Internal Server Error', details: error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = transactionSchema.parse(req.body);
      const transaction = await prisma.transacao.create({
        data: {
          ...data,
          tipo: data.tipo.toUpperCase() as any,
          status: data.status.toUpperCase() as any,
          data: new Date(data.data),
          userId: req.userId,
        }
      });
      return res.status(201).json(transaction);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transactionId = parseInt(id);
      
      if (isNaN(transactionId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const transaction = await prisma.transacao.findFirst({
        where: { id: transactionId, userId: req.userId }
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      await prisma.transacao.delete({ where: { id: transactionId } });
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return res.status(500).json({ error: 'Erro ao excluir transação' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transactionId = parseInt(id);
      
      if (isNaN(transactionId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const existingTransaction = await prisma.transacao.findFirst({
        where: { id: transactionId, userId: req.userId }
      });

      if (!existingTransaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      const data = transactionSchema.partial().parse(req.body);
      
      const transaction = await prisma.transacao.update({
        where: { id: transactionId },
        data: {
          ...data,
          tipo: data.tipo ? data.tipo.toUpperCase() as any : undefined,
          status: data.status ? data.status.toUpperCase() as any : undefined,
          data: data.data ? new Date(data.data) : undefined,
        }
      });
      
      return res.json(transaction);
    } catch (error) {
      console.error('Error updating transaction:', error);
      return res.status(400).json({ error: 'Erro ao atualizar transação' });
    }
  }
}