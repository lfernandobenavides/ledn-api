import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './databaseConnection';
import { userRoute } from './routes/user.route';
import { transactionRoute } from './routes/transaction.route';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoute());
app.use('/', transactionRoute());

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    await connectToDatabase();

    console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
  });
}

export default app;
