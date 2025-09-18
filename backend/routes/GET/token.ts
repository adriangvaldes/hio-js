import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
// Use CORS middleware to allow requests from your frontend
app.use(cors());

app.post("/token", (req, res) => {
  res.status(501).json({ message: "Not implemented yet." });
});
