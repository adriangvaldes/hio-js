import { WebSocketServer, WebSocket } from "ws";
import { createServer, IncomingMessage } from "http";
import { URL } from "url";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatWebSocket, UserPayload } from "./types";
import { createApiRouter } from "./routes/api";

dotenv.config();

export const JWT_SECRET = process.env.JWT_TOKEN;

export const rooms = new Map<string, Set<ChatWebSocket>>();
const agents = new Set<ChatWebSocket>();

export const app = express();

app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

const apiRouter = createApiRouter(); // Create an instance of the router
app.use("/api", apiRouter);

server.on("upgrade", (request: IncomingMessage, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", function connection(ws: ChatWebSocket, req) {
  try {
    const url = new URL(req.url!, `ws://${req.headers.host}`);
    const token = url.searchParams.get("token");
    if (!token) throw new Error("No token provided.");

    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
    ws.user = payload;

    const { role, userId } = payload;

    if (role === "agent") {
      agents.add(ws);
      console.log(`Agent ${ws.user.name} connected. Total agents: ${agents.size}`);
    } else if (role === "customer" && userId) {
      const roomId = userId;
      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId)!.add(ws);
      console.log(`Customer ${userId} connected to room: ${roomId}`);
    } else {
      throw new Error("Invalid token payload.");
    }
  } catch (error) {
    console.log("WS Auth failed:", (error as Error).message);
    ws.close(1008, "Invalid authentication token");
    return;
  }

  wss.on("message", function message(data) {
    console.log("HERE");

    const messageData = JSON.parse(data.toString());
    const sender = ws.user;

    if (sender.role === "customer" && sender.userId) {
      const roomId = sender.userId;
      const room = rooms.get(roomId);
      room?.forEach((client) => client.send(data.toString()));
      agents.forEach((agent) => {
        const messageForAgent = { ...messageData, roomId };
        agent.send(JSON.stringify(messageForAgent));
      });
      console.log(roomId, room);
    }

    if (sender.role === "agent") {
      const targetRoomId = messageData.targetRoomId;
      const targetRoom = rooms.get(targetRoomId);
      targetRoom?.forEach((client) => client.send(data.toString()));
    }
  });

  wss.on("close", () => {
    const { role, userId } = ws.user;
    if (role === "agent") {
      agents.delete(ws);
      console.log(`Agent disconnected. Total agents: ${agents.size}`);
    } else if (role === "customer" && userId) {
      const roomId = userId;
      const room = rooms.get(roomId);
      if (room) {
        room.delete(ws);
        if (room.size === 0) rooms.delete(roomId);
        console.log(`Customer disconnected from room: ${roomId}`);
      }
    }
  });

  wss.on("error", console.error);
});

// --- 5. Start the server ---
server.listen(8080, () => {
  console.log("Hybrid server (Express API + WebSocket) is running on port 8080");
});
