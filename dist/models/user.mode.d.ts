import { Document, Model } from "mongoose";
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
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}
interface IUserModel extends Model<IUserDocument> {
}
export declare const User: IUserModel;
export {};
//# sourceMappingURL=user.mode.d.ts.map