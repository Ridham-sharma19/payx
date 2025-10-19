import express from "express";
import healthRouter from "./routes/healthcheck.routes.js";
import auhtrouter from "./routes/user.routes.js";
const app = express();
//basic configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use("/api/v1/healthcheck", healthRouter);
app.use("/api/v1/user", auhtrouter);
export default app;
//# sourceMappingURL=app.js.map