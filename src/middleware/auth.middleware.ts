import {
  User,
  IUserDocument,
  IAccessTokenPayload,
} from "../models/user.mode.js";
import { ApiError } from "../utils/errorhandler.js";
import { AsyncHandler } from "../utils/asynhandler.js";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export const verifyJwt = AsyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as IAccessTokenPayload;

    const user = await User.findById(decoded._id).select(
      "-password -refreshtoken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});
