
import express from "express";
import cors from "cors";
import clientsRouter from "./routes/clients";
import clientFilesRouter from "./routes/clientFilesRouter";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - properly mount the router at the base path
app.use("/api/clients", clientsRouter);
app.use("/api/client-files", clientFilesRouter);

// Base route for API health check
app.get("/api", (_req, res) => {
  res.json({ message: "API is running" });
});

export default app;
