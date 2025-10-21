import mongoose from "mongoose";
import { AsyncHandler } from "../utils/asynhandler.js";
import { Account, User, IUserAccount } from "../models/user.mode.js";
import { ApiError } from "../utils/errorhandler.js";
import { ApiResponse } from "../utils/apiresponse.js";

const balance = AsyncHandler(async (req, res) => {
  const account = await Account.findOne({
    userId: req.user?._id,
  }) as IUserAccount | null;

  if (!account) {
    throw new ApiError(400, "no account found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { balance: account.balance }));
});

const transfer = AsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { to, amount } = req.body;

  const sender = await Account.findOne({
    userId: req.user?._id,
  }).session(session) as IUserAccount | null;
  if (!sender) {
    await session.abortTransaction();
    throw new ApiError(400, "You are not authorised");
  }
  if (sender.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const receiver = await Account.findOne({
    userId: to,
  }).session(session) as IUserAccount | null;
  if (!receiver) {
    await session.abortTransaction();
    throw new ApiError(400, "Receiver account not found");
  }

   await Account.updateOne({ userId: req.user?._id }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    
  await sender.save({ session });
  await receiver.save({ session });

  await session.commitTransaction();

  return res.status(200).json(
    new ApiResponse(200, { message: "Transfer successful" })
  );
});

export { balance, transfer };
