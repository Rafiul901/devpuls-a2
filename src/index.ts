import app from "./app";
import { pool } from "./db";
import { dataDB } from "./db/dataDB";



let dbInitialized = false;

const initializeDB = async () => {
  if (!dbInitialized) {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");
    await dataDB();
    dbInitialized = true;
  }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  await initializeDB();
  next();
});

export default app;