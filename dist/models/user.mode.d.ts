import mongoose, { Document, Model } from "mongoose";
export interface IAccessTokenPayload {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    username: string;
}
export interface IRefreshTokenPayload {
    _id: mongoose.Schema.Types.ObjectId;
}
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
export interface IUserAccount extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    balance: number;
}
export declare const User: Model<IUserDocument>;
export declare const Account: Model<IUserAccount>;
//# sourceMappingURL=user.mode.d.ts.map