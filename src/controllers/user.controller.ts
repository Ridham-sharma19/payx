import { AsyncHandler } from "../utils/asynhandler.js";
import { User } from "../models/user.mode.js";
import { ApiError } from "../utils/errorhandler.js";
import { ApiResponse } from "../utils/apiresponse.js";




const registerUser=AsyncHandler(async(req,res)=>{
    const { email ,password, fullname, username}=req.body;

    const userExist=await User.findOne({
        $or: [{username},{email}]
    })
    if(userExist){
       throw new  ApiError(409,"User with this email or username already present",[])
    }
    const user=await User.create({
    email,
    fullname,
    password,
    username,
    })
    await user.save({validateBeforeSave:false})
     const createdUser = await User.findById(user._id).select(
    " -password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Some thing went wrong while registering the user ",
    );
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "user registered successfully",
      ),
    );
})

export {
    registerUser
}