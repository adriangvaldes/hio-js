import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
// Use CORS middleware to allow requests from your frontend
app.use(cors());
