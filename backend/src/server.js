const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");

const app = express();

// Enable CORS for all origins (you can restrict it if needed)
app.use(cors());
app.use(express.json());

const redis = new Redis({ host: "localhost", port: 9002 });

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

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
