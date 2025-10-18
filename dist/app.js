import express from "express";
import healthRouter from "./routes/healthcheck.routes.js";
const app = express();
//basic configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use("/api/v1/healthcheck", healthRouter);
export default app;
//# sourceMappingURL=app.js.map