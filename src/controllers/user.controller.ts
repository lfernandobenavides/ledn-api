import { Request, Response } from 'express';
import { Transaction, TransactionInput } from '../models/transaction.model';
import { User, UserInput } from '../models/user.model';
import JSONStream from 'JSONStream';

const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, country, email, dob, mfa, referredBy } = req.body;

  if (!firstName || !lastName || !country || !email || !dob) {
    return res.status(422).json({ message: 'firstName, lastName, country, email, dob and are required' });
  }

  const UserInput: UserInput = {
    firstName,
    lastName,
    country,
    email,
    dob,
    mfa,
    referredBy,
  };

  const UserCreated = await User.create(UserInput);

  return res.status(201).json(UserCreated);
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().populate('referredBy').sort('-createdAt').cursor().pipe(JSONStream.stringify()).pipe(res.type('json'));
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).populate('referredBy');

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }

  const transactionsAggregate = await Transaction.aggregate([
    {
      $match: {
        userId: user._id,
      },
    },
    {
      $group: {
        _id: { userId: '$userId', type: '$type' },
        balance: { $sum: '$amount' },
      },
    },
  ]);

  let balance = 0;

  if (transactionsAggregate && transactionsAggregate.length > 0) {
    let balanceValue = Number(transactionsAggregate[0].balance.toString());
    balance += transactionsAggregate[0]._id.type == 'receive' ? balanceValue : -balanceValue;
  }
  if (transactionsAggregate && transactionsAggregate.length > 1) {
    let balanceValue = Number(transactionsAggregate[1].balance.toString());
    balance += transactionsAggregate[1]._id.type == 'receive' ? balanceValue : -balanceValue;
  }

  return res.status(200).json({ ...{ balance }, user });
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, country, dob, mfa, referredBy } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }

  if (!firstName || !lastName || !country || !dob) {
    return res.status(422).json({ message: 'firstName, lastName, country, dob and mfa, are required' });
  }

  await User.updateOne({ _id: id }, { firstName, lastName, country, dob, mfa, referredBy });

  const UserUpdated = await User.findById(id, { firstName, lastName, country, dob, mfa, referredBy });

  return res.status(200).json(UserUpdated);
};

const transferAmount = async (req: Request, res: Response) => {
  const { userEmailFrom, userEmailTo, amount } = req.body;

  if (!userEmailFrom || !userEmailTo || !amount) {
    return res.status(422).json({ message: 'userEmailFrom, userEmailTo, amount are required' });
  }

  if (Number(amount) < 0) {
    return res.status(422).json({ message: 'Amount should be greater that 0' });
  }

  const userFrom = await User.findOne({ email: userEmailFrom });

  if (!userFrom) {
    return res.status(404).json({ message: `User with email "${userEmailFrom}" not found.` });
  }

  const userTo = await User.findOne({ email: userEmailTo });

  if (!userTo) {
    return res.status(404).json({ message: `User with email "${userEmailTo}" not found.` });
  }

  const TransactionInputFrom: TransactionInput = {
    userId: userFrom._id,
    amount,
    type: 'send',
  };

  const TransactionInputTo: TransactionInput = {
    userId: userTo._id,
    amount,
    type: 'receive',
  };

  const TransactionCreatedFrom = await Transaction.create(TransactionInputFrom);
  const TransactionCreatedTo = await Transaction.create(TransactionInputTo);

  return res.status(201).json({ TransactionCreatedFrom, TransactionCreatedTo });
};

export { createUser, getAllUsers, getUser, updateUser, transferAmount };
