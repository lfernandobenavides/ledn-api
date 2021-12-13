import { Transaction } from '../models/transaction.model';
import request from 'supertest';
import app from '../index';
import { User } from '../models/user.model';

describe('Accounts', () => {
  it('should show 401 if the header auth is not set', async () => {
    const result = await request(app).get('/Accounts');
    expect(result.statusCode).toEqual(401);
  });
  it('should retrieve account data', async () => {
    const mockingoose = require('mockingoose');
    mockingoose(User).toReturn(
      [
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
      ],
      'findOne',
    );
    const result = await request(app).get('/Accounts/61b54114679b9a408b360e5c').set('Auth', '12345');
    expect(result.statusCode).toEqual(200);
    const account = JSON.parse(result.text);
    expect(account.balance).toEqual(0);
    expect(account.user[0].firstName).toEqual('Sydnie');
  });
});
