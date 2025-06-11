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
    res.status(201).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/get/:key", async (req, res) => {
  try {
    const value = await redis.get(req.params.key);
    res.status(200).json({ key: req.params.key, value });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/getAll", async (req, res) => {
  try {
    const flatPairs = await redis.call("getall");
    const keyValuePairs = [];
    for (let i = 0; i < flatPairs.length; i += 2) {
      const key = flatPairs[i];
      const value = flatPairs[i + 1];
      keyValuePairs.push({ key, value });
    }

    res.status(200).json(keyValuePairs);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.delete("/delete/:taskId", async (req, res) => {
  try {
    await redis.del(req.params.taskId);
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(BACK_PORT, "0.0.0.0", () => {
  console.log("Server ON");
});
