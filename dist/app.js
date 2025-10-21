import express from "express";
import cookieParser from "cookie-parser";
import healthRouter from "./routes/healthcheck.routes.js";
import auhtrouter from "./routes/user.routes.js";
import accountrouter from "./routes/account.routes.js";
import cors from "cors";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-type"]
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/healthcheck", healthRouter);
app.use("/api/v1/user", auhtrouter);
app.use("/api/v1/user/account", accountrouter);
export default app;
//# sourceMappingURL=app.js.map