import mongoose, { Schema, Model, Document } from 'mongoose';

type UserDocument = Document & {
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  dob: Date;
  mfa: String;
  referredBy: String;
  createdAt: Date;
  updatedAt: Date;
};

type UserInput = {
  firstName: UserDocument['firstName'];
  lastName: UserDocument['lastName'];
  country: UserDocument['country'];
  email: UserDocument['email'];
  dob: UserDocument['dob'];
  mfa: UserDocument['mfa'];
  referredBy: UserDocument['referredBy'];
};

const userSchema = new Schema(
  {
    firstName: {
      type: Schema.Types.String,
      required: true,
    },
    lastName: {
      type: Schema.Types.String,
      required: true,
    },
    country: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    dob: {
      type: Schema.Types.Date,
      required: true,
    },
    mfa: {
      type: Schema.Types.String,
      enum: [null, 'TOTP', 'SMS'],
      default: null,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    collection: 'Users',
    timestamps: true,
  },
);

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);

export { User, UserInput, UserDocument };
