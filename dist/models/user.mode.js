import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    refreshtoken: {
        type: String,
    },
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
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
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=user.mode.js.map