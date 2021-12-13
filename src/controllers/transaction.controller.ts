import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Transaction, TransactionInput } from '../models/transaction.model';
import JSONStream from 'JSONStream';

const createTransaction = async (req: Request, res: Response) => {
  const { userEmail, amount, type } = req.body;

  if (!userEmail || !amount || !type) {
    return res.status(422).json({ message: 'userEmail, amount, type are required' });
  }

  if (type !== 'send' && type !== 'receive') {
    return res.status(422).json({ message: `The operation ${type} is not allowed` });
  }

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ message: `User with email "${userEmail}" not found.` });
  }
  const TransactionInput: TransactionInput = {
    userId: user._id,
    amount,
    type,
  };

  const TransactionCreated = await Transaction.create(TransactionInput);

  return res.status(201).json( TransactionCreated);
};

const getAllTransactions = async (req: Request, res: Response) => {
  Transaction.find().populate('userId').sort('-createdAt').cursor().pipe(JSONStream.stringify()).pipe(res.type('json'));
};

const getTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  const transaction = await Transaction.findOne({ _id: id }).populate('userId');

  if (!transaction) {
    return res.status(404).json({ message: `Transaction with id "${id}" not found.` });
  }

  return res.status(200).json(transaction);
};

const updateTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, amount, type } = req.body;

  const transaction = await Transaction.findOne({ _id: id });

  if (!transaction) {
    return res.status(404).json({ message: `Transaction with id "${id}" not found.` });
  }

  if (!userId || !amount || !type) {
    return res.status(422).json({ message: 'userId, amount, type are required' });
  }

  await Transaction.updateOne({ _id: id }, { userId, amount, type });

  const TransactionUpdated = await Transaction.findById(id, { userId, amount, type });

  return res.status(200).json( TransactionUpdated);
};
export { createTransaction, getAllTransactions, getTransaction, updateTransaction };
