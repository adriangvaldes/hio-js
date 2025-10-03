import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_TOKEN;

export const getToken = async (req, res) => {
  const requestBody = req.body;

  const payload = requestBody;

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "10h" });

  res.status(200).json({
    token: token,
    expiresIn: 100 * 24 * 60 * 60, // 100 days in seconds
  });
};
