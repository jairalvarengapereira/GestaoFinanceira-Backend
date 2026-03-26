import { Request, Response } from 'express';
import { prisma } from '../app';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const registerSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string(),
});

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha } = registerSchema.parse(req.body);
      
      const userExists = await prisma.usuario.findUnique({ where: { email } });
      if (userExists) return res.status(400).json({ error: 'Usuário já existe' });

      const senhaHash = await bcrypt.hash(senha, 10);
      const user = await prisma.usuario.create({
        data: { nome, email, senhaHash }
      });

      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = loginSchema.parse(req.body);
      
      const user = await prisma.usuario.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(senha, user.senhaHash))) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

      return res.json({ user: { id: user.id, nome: user.nome, email: user.email }, token });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}
