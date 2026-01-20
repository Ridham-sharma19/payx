import { AsyncHandler } from "../utils/asynhandler.js";
import { Account, User } from "../models/user.mode.js";
import { ApiError } from "../utils/errorhandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};
const registerUser = AsyncHandler(async (req, res) => {
    const { email, password, fullname, username } = req.body;
    const userExist = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (userExist) {
        throw new ApiError(409, "User with this email or username already exists");
    }
    const user = await User.create({ email, fullname, password, username });
    const userAccount = await Account.create({
        userId: user._id,
        balance: Math.floor(Math.random() * 10000) + 1,
    });
    const createdUser = await User.findById(user._id).select("-password -refreshtoken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    return res.status(201).json(new ApiResponse(201, { user: createdUser }, "User registered successfully with balance: " + userAccount.balance));
});
const login = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "User does not exist");
    }
    const isValid = await user.isPasswordCorrect(password);
    if (!isValid) {
        throw new ApiError(400, "Invalid Credentials");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshtoken");
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});
const updatePassword = AsyncHandler(async (req, res) => {
    const { oldpassword, newpassword } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user)
        throw new ApiError(404, "User not found");
    const isPasswordValid = await user.isPasswordCorrect(oldpassword);
    if (!isPasswordValid)
        throw new ApiError(400, "Invalid old password");
    user.password = newpassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});
const getusers = AsyncHandler(async (req, res) => {
    const filter = req.query.filter?.trim() || "";
    let query = {};
    if (filter) {
        const regex = new RegExp("^" + filter, "i");
        query = {
            $or: [{ username: { $regex: regex } }, { fullname: { $regex: regex } }],
        };
    }
    const users = await User.find(query);
    res.status(200).json({
        success: true,
        data: users.map((user) => ({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
        })),
    });
});
export { registerUser, login, updatePassword, getusers };
//# sourceMappingURL=user.controller.js.map