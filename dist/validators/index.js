import { body } from "express-validator";
const userRegisterValidator = () => {
    return [
        body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
        body("username").trim().notEmpty().withMessage("Username is required").isLowercase().withMessage("username should be in lowercase").isLength({ min: 3 }).withMessage("username must be at least 3 character long"),
        body("password").trim().notEmpty().withMessage("Password is required"),
        body("fullname").trim().optional()
    ];
};
export { userRegisterValidator };
//# sourceMappingURL=index.js.map