import mongoose, { Document } from "mongoose";
interface IUser extends Document {
    username: string;
    fullname?: string;
    email: string;
    password: string;
    isPasswordCorrect(password: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=user.mode.d.ts.map