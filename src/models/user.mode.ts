import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

export interface IAccessTokenPayload {
  _id: string;
  email: string;
  username: string;
}

export interface IRefreshTokenPayload {
  _id: string;
}

export interface IUserDocument extends Document {
  username: string;
  fullname?: string;
  email: string;
  password: string;
  refreshtoken: string,
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  fullname: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  refreshtoken: {
    type: String,
  },
});

interface IUserModel extends Model<IUserDocument> {}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (
  this: IUserDocument
): string {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET environment variable is not defined");
  }

  const payload: IAccessTokenPayload = {
    _id: this._id as string,
    email: this.email,
    username: this.username,
  };

  const options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  };

  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    options as SignOptions
  );
};

userSchema.methods.generateRefreshToken = function (
  this: IUserDocument
): string {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET environment variable is not defined");
  }

  const payload: IRefreshTokenPayload = {
    _id: this._id as string,
  };

  const options = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  };

  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    options as SignOptions
  );
};

export const User: IUserModel = mongoose.model<IUserDocument>(
  "User",
  userSchema
);
