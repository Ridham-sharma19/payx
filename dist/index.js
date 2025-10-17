import express from "express";
import mongoConnection from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
mongoConnection()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Error while connecting:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map