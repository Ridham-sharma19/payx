import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// 2. Define the schema without the instance methods.
//    Using `UserSchema` for the Schema variable is a common convention.
const userSchema = new Schema({
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
});
// 3. Use Mongoose middleware for password hashing.
userSchema.pre("save", async function (next) {
    // `this` is correctly inferred as `IUserDocument` here.
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// 4. Implement instance methods using Mongoose's `methods` property.
//    Using `this: IUserDocument` clarifies the context for `this`.
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET environment variable is not defined");
    }
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
    };
    const options = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
};
userSchema.methods.generateRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET environment variable is not defined");
    }
    const payload = {
        _id: this._id,
    };
    const options = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, options);
};
// 5. Create and export the User model.
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=user.mode.js.map