import "dotenv/config";

import { FRONT_PORT, LAN_IP, BACK_PORT, DB_PORT } from "./constants.js";

import express from "express";
import cors from "cors";
import Redis from "ioredis";

const app = express();

const corsOptions = {
  origin: [
    `http://localhost:${FRONT_PORT}`, // For local development
    `http://${LAN_IP}:${FRONT_PORT}`, // Your Mac's LAN IP
    `http://${LAN_IP}:${BACK_PORT}`, // Backend URL (if needed)
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Enable CORS for all origins (you can restrict it if needed)
app.use(cors(corsOptions));
app.use(express.json());

const redis = new Redis({ host: LAN_IP, port: DB_PORT });

app.post("/set", async (req, res) => {
  const { key, value } = req.body;
  try {
    await redis.set(key, value);
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/get/:key", async (req, res) => {
  try {
    const value = await redis.get(req.params.key);
    res.json({ key: req.params.key, value });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(BACK_PORT, "0.0.0.0", () => {
  console.log("Server ON");
});
