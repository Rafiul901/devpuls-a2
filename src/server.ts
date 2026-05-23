import app from "./app.js";
import config from "./config";
import { pool } from "./db";
import { dataDB } from "./db/dataDB";


const startServer = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();