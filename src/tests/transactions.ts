import request from 'supertest';
import app from '../index';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';

describe('Transactions', () => {
  it('should create a debit transaction', async () => {
    const mockingoose = require('mockingoose');
    mockingoose(User).toReturn(
      {
        mfa: null,
        referredBy: null,
        _id: '61b54114679b9a408b360e5c',
        firstName: 'Sydnie',
        lastName: 'Dooley',
        country: 'AR',
        email: 'Cassandre10@gmail.com',
        dob: '1994-06-27T10:05:53.450Z',
        createdAt: '2021-12-12T00:23:48.965Z',
        updatedAt: '2021-12-12T00:23:48.965Z',
        __v: 0,
      },
      'findOne',
    );
    mockingoose(User).toReturn({
      mfa: null,
      referredBy: null,
      _id: '61b54114679b9a408b360e5c',
      firstName: 'Sydnie',
      lastName: 'Dooley',
      country: 'AR',
      email: 'Cassandre10@gmail.com',
      dob: '1994-06-27T10:05:53.450Z',
      createdAt: '2021-12-12T00:23:48.965Z',
      updatedAt: '2021-12-12T00:23:48.965Z',
      __v: 0,
    });
    mockingoose(Transaction).toReturn(
      {
        userEmail: 'Cassandre10@gmail.com',
        amount: 617399533,
        type: 'receive',
        createdAt: '2020-06-10T05:04:07.388Z',
      },
      'create',
    );
    const result = await request(app)
      .post('/Transaction')
      .send({ userEmail: 'Cassandre10@gmail.com', amount: 617399533, type: 'receive' })
      .set('Auth', '12345');
    expect(result.statusCode).toEqual(201);
    const transaction = JSON.parse(result.text);
    expect(transaction.userId).toEqual('61b54114679b9a408b360e5c');
    expect(transaction.amount.$numberDecimal).toEqual('617399533');
    expect(transaction.type).toEqual('receive');
  });

  it('should create a credit transaction', async () => {
    const mockingoose = require('mockingoose');
    mockingoose(User).toReturn(
      {
        mfa: null,
        referredBy: null,
        _id: '61b54114679b9a408b360e5c',
        firstName: 'Sydnie',
        lastName: 'Dooley',
        country: 'AR',
        email: 'Cassandre10@gmail.com',
        dob: '1994-06-27T10:05:53.450Z',
        createdAt: '2021-12-12T00:23:48.965Z',
        updatedAt: '2021-12-12T00:23:48.965Z',
        __v: 0,
      },
      'findOne',
    );
    mockingoose(User).toReturn({
      mfa: null,
      referredBy: null,
      _id: '61b54114679b9a408b360e5c',
      firstName: 'Sydnie',
      lastName: 'Dooley',
      country: 'AR',
      email: 'Cassandre10@gmail.com',
      dob: '1994-06-27T10:05:53.450Z',
      createdAt: '2021-12-12T00:23:48.965Z',
      updatedAt: '2021-12-12T00:23:48.965Z',
      __v: 0,
    });
    mockingoose(Transaction).toReturn(
      {
        userEmail: 'Cassandre10@gmail.com',
        amount: 617399533,
        type: 'send',
        createdAt: '2020-06-10T05:04:07.388Z',
      },
      'create',
    );
    const result = await request(app)
      .post('/Transaction')
      .send({ userEmail: 'Cassandre10@gmail.com', amount: 617399533, type: 'send' })
      .set('Auth', '12345');
    expect(result.statusCode).toEqual(201);
    const transaction = JSON.parse(result.text);
    expect(transaction.userId).toEqual('61b54114679b9a408b360e5c');
    expect(transaction.amount.$numberDecimal).toEqual('617399533');
    expect(transaction.type).toEqual('send');
  });
});
