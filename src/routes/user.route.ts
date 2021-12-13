import { Router } from 'express';
import { createUser, getAllUsers, getUser, transferAmount, updateUser } from '../controllers/user.controller';
import { checkSecurityToken } from './auth';

const userRoute = () => {
  const router = Router();
  router.use(checkSecurityToken);
  router.post('/Account', createUser);

  router.get('/Accounts', getAllUsers);

  router.get('/Accounts/:id', getUser);

  router.put('/Accounts/:id', updateUser);

  router.post('/Account-transfer', transferAmount);

  return router;
};

export { userRoute };
