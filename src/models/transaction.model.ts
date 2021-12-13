import mongoose, { Schema, Model, Document } from 'mongoose';

type TransactionDocument = Document & {
  userId: string;
  amount: string;
  type: string;
  createdAt: string;
};

type TransactionInput = {
  userId: TransactionDocument['userId'];
  amount: TransactionDocument['amount'];
  type: TransactionDocument['type'];
};

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      enum: ['send', 'receive'],
      required: true,
    },
  },
  {
    collection: 'Transactions',
    timestamps: true,
  },
);

const Transaction: Model<TransactionDocument> = mongoose.model<TransactionDocument>('Transaction', transactionSchema);

export { Transaction, TransactionInput, TransactionDocument };
