
import mongoConnection from "./db/index.js";
import dotenv from "dotenv";

import app from "./app.js"

dotenv.config();

const PORT = process.env.PORT || 8000;




mongoConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: string) => {
    console.error("Error while connecting:", err);
    process.exit(1);
  });
