import express from "express";
import { userRegisterValidator } from "../validators/index.js";
import { registerUser } from "../controllers/user.controller.js";
import { validate } from "../middleware/validation.middleware.js";
const router = express.Router();
router.route("/register").post(userRegisterValidator(), validate, registerUser);
export default router;
//# sourceMappingURL=user.routes.js.map