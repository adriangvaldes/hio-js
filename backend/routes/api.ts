import { Router } from "express";
import { getRooms } from "./GET/rooms";
import { getToken } from "./GET/token";
import { ChatWebSocket } from "../types";

export const createApiRouter = () => {
  const router = Router();

  router.get("/rooms", getRooms);

  router.post("/token", getToken);

  return router;
};
