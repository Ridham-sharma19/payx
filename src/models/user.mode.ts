import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

/* --------------------------------------------
   Token Payload Interfaces
-------------------------------------------- */
export interface IAccessTokenPayload {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  username: string;
}

export interface IRefreshTokenPayload {
  _id: mongoose.Schema.Types.ObjectId;
}

/* --------------------------------------------
    User Document Interface
-------------------------------------------- */
export interface IUserDocument extends Document {
  username: string;
  fullname?: string;
  email: string;
  password: string;
  refreshtoken?: string;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

/* --------------------------------------------
    User Account Interface
-------------------------------------------- */
export interface IUserAccount extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  balance: number;
}

/* --------------------------------------------
    User Schema
-------------------------------------------- */
const userSchema = new Schema<IUserDocument>(
  {
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
  },
  { timestamps: true }
);

/* --------------------------------------------
    Password Hash Middleware
-------------------------------------------- */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* --------------------------------------------
    Instance Methods
-------------------------------------------- */
userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET not set");

  const payload: IAccessTokenPayload = {
    _id: this._id.toString(),
    email: this.email,
    username: this.username,
  };

  return jwt.sign(payload, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  } as SignOptions);
};

userSchema.methods.generateRefreshToken = function (): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error("REFRESH_TOKEN_SECRET not set");

  const payload: IRefreshTokenPayload = { _id: this._id.toString() };

  return jwt.sign(payload, secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  } as SignOptions);
};

/* --------------------------------------------
   🏦 Account Schema
-------------------------------------------- */
const accountSchema = new Schema<IUserAccount>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* --------------------------------------------
   📦 Model Exports
-------------------------------------------- */
export const User: Model<IUserDocument> = mongoose.model("User", userSchema);
export const Account: Model<IUserAccount> = mongoose.model(
  "Account",
  accountSchema
);
