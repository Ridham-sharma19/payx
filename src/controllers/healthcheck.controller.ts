import { AsyncHandler } from "../utils/asynhandler.js";

import { ApiResponse } from "../utils/apiresponse.js";


const healthCheck=AsyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,"server is running"))
})

export { healthCheck }