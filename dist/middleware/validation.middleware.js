import { validationResult } from "express-validator";
import { ApiError } from "../utils/errorhandler.js";
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().forEach((err) => {
        extractedErrors.push(err.msg);
    });
    throw new ApiError(422, "Received data is not valid", extractedErrors);
};
//# sourceMappingURL=validation.middleware.js.map