import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import routes from './routes';

export const prisma = new PrismaClient();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', routes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Gestão Financeira API', version: '1.0.0' });
});

export default app;
