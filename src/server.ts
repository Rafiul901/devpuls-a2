import app from "./app";
import config from "./config";
import { pool } from "./db";
import { dataDB } from "./db/dataDB";


const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");

    await dataDB();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();