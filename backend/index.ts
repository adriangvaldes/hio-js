import { WebSocketServer, WebSocket } from "ws";
import { createServer, IncomingMessage } from "http";
import { URL } from "url";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
interface UserPayload {
  role: "agent" | "customer";
  userId?: string;
  agentId?: string;
  name: string;
}

interface ChatWebSocket extends WebSocket {
  user: UserPayload;
}

const JWT_SECRET = process.env.JWT_TOKEN;

const rooms = new Map<string, Set<ChatWebSocket>>();
const agents = new Set<ChatWebSocket>();

// --- 1. Set up the Express App ---
const app = express();
// Use CORS middleware to allow requests from your frontend
app.use(cors());

// --- 2. Define the API route using Express ---
app.get("/rooms", (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header is missing or invalid." });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;

    if (payload.role !== "agent") {
      return res.status(403).json({ message: "Access denied: Agent role required." });
    }

    const activeRooms = Array.from(rooms.entries()).map(([roomId, clients]) => {
      const firstClient = clients.values().next().value;
      return {
        roomId,
        customerName: firstClient?.user?.name || "Unknown Customer",
        clientCount: clients.size,
      };
    });

    res.status(200).json(activeRooms);
  } catch (error) {
    res.status(401).json({ message: "Authentication failed.", error: (error as Error).message });
  }
});

// --- 3. Create the HTTP server from the Express app ---
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

// --- 4. Handle WebSocket connections on the same server ---
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
      console.log(`Customer ${userId} connected to room.`);
    } else {
      throw new Error("Invalid token payload.");
    }
  } catch (error) {
    console.log("WS Auth failed:", (error as Error).message);
    ws.close(1008, "Invalid authentication token");
    return;
  }

  ws.on("message", function message(data) {
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
    }

    if (sender.role === "agent") {
      const targetRoomId = messageData.targetRoomId;
      const targetRoom = rooms.get(targetRoomId);
      targetRoom?.forEach((client) => client.send(data.toString()));
    }
  });

  ws.on("close", () => {
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

  ws.on("error", console.error);
});

// --- 5. Start the server ---
server.listen(8080, () => {
  console.log("Hybrid server (Express API + WebSocket) is running on port 8080");
});
