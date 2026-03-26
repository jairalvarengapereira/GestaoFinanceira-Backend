import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    const { id } = data as TokenPayload;

    // Adiciona o ID do usuário ao request para uso posterior
    req.userId = id;

    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
