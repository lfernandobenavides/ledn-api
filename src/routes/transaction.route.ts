import { Router } from 'express';
import { createTransaction, getAllTransactions, getTransaction, updateTransaction } from '../controllers/transaction.controller';
import { checkSecurityToken } from './auth';

const transactionRoute = () => {
  const router = Router();

  router.use(checkSecurityToken);
  router.post('/Transaction', createTransaction);

  router.get('/Transactions', getAllTransactions);

  router.get('/Transactions/:id', getTransaction);

  router.put('/Transactions/:id', updateTransaction);

  return router;
};

export { transactionRoute };
