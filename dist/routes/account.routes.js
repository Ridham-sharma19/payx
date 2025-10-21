import express from "express";
import { transaction } from "../validators/index.js";
import { validate } from "../middleware/validation.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { balance, transfer } from "../controllers/accounts.controller.js";
const router = express.Router();
router.route("/balance").get(verifyJwt, validate, balance);
router.route("/transaction").post(verifyJwt, transaction(), validate, transfer);
export default router;
//# sourceMappingURL=account.routes.js.map