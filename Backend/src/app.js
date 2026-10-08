import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/chat", chatRoutes);

app.use(errorHandler);


export default app;