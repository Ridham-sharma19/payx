import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
/* --------------------------------------------
   🧱 User Schema
-------------------------------------------- */
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
}, { timestamps: true });
/* --------------------------------------------
   🔒 Password Hash Middleware
-------------------------------------------- */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
/* --------------------------------------------
   ⚙️ Instance Methods
-------------------------------------------- */
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret)
        throw new Error("ACCESS_TOKEN_SECRET not set");
    const payload = {
        _id: this._id.toString(),
        email: this.email,
        username: this.username,
    };
    return jwt.sign(payload, secret, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    });
};
userSchema.methods.generateRefreshToken = function () {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret)
        throw new Error("REFRESH_TOKEN_SECRET not set");
    const payload = { _id: this._id.toString() };
    return jwt.sign(payload, secret, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    });
};
/* --------------------------------------------
   🏦 Account Schema
-------------------------------------------- */
const accountSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
/* --------------------------------------------
   📦 Model Exports
-------------------------------------------- */
export const User = mongoose.model("User", userSchema);
export const Account = mongoose.model("Account", accountSchema);
//# sourceMappingURL=user.mode.js.map