import express from "express";
import { userChangeCurrentPasswordValidator, userLoginValidators, userRegisterValidator } from "../validators/index.js";
import { login, registerUser, updatePassword } from "../controllers/user.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const router = express.Router();
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidators(), validate, login);
router.route("/updatepassword").post(verifyJwt, userChangeCurrentPasswordValidator(), validate, updatePassword);
export default router;
//# sourceMappingURL=user.routes.js.map