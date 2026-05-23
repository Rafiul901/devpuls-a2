import express, {} from "express";
import cors from "cors";
import router from "./app/routes";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("The server is running...");
});
app.use('/api', router);
export default app;
//# sourceMappingURL=app.js.map