import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import backtestRoutes from "./routes/backtestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { startWebSocketServer } from "./websocket/liveFeed.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://algo-trading-simulator.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

connectDB();

app.use("/auth", authRoutes);
app.use("/backtest", backtestRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Algo Trading Simulator API");
});

startWebSocketServer(server);
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
