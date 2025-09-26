import { Router } from "express";
import { getRooms } from "./GET/rooms";
import { getToken } from "./GET/token";
import { ChatWebSocket } from "../types";

export const createApiRouter = (rooms: Map<string, Set<ChatWebSocket>>) => {
  const router = Router();

  router.get("/rooms", getRooms(rooms));

  router.post("/token", getToken);

  return router;
};
