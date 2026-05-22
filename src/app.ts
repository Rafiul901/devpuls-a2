import express, { type Application } from "express";
import cors from "cors";
import router from "./app/routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("The server is running...");
});
app.use('/api',router)
export default app;