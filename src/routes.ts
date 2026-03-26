import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { AuthController } from './controllers/AuthController';
import { TransactionController } from './controllers/TransactionController';
import { CategoryController } from './controllers/CategoryController';
import { authMiddleware } from './middlewares/authMiddleware';

const routes = Router();
const userController = new UserController();
const authController = new AuthController();
const transactionController = new TransactionController();
const categoryController = new CategoryController();

routes.post('/auth/register', authController.register);
routes.post('/auth/login', authController.login);

routes.get('/users', authMiddleware, userController.list);

routes.get('/transactions', authMiddleware, transactionController.list);
routes.post('/transactions', authMiddleware, transactionController.create);
routes.delete('/transactions/:id', authMiddleware, transactionController.delete);
routes.put('/transactions/:id', authMiddleware, transactionController.update);

routes.get('/categories', authMiddleware, categoryController.list);
routes.post('/categories', authMiddleware, categoryController.create);

export default routes;
