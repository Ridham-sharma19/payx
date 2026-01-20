import express from "express";
import {
  userChangeCurrentPasswordValidator,
  userLoginValidators,
  userRegisterValidator,
} from "../validators/index.js";
import {
  login,
  registerUser,
  updatePassword,getusers,
  getCurrentUser,
  logout
} from "../controllers/user.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidators(), validate, login);
router
  .route("/updatepassword")
  .post(
    verifyJwt,
    userChangeCurrentPasswordValidator(),
    validate,
    updatePassword
  );
router.route("/getuser").get(verifyJwt, validate, getusers);
router.route("/me").get(verifyJwt, getCurrentUser);
router.route("/logout").post(logout);


export default router;
