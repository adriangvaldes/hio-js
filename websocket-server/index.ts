// websocket-server/index.ts
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map<string, Set<ChatWebSocket>>();

interface ChatWebSocket extends WebSocket {
  roomId: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: number;
}

wss.on("connection", function connection(ws: ChatWebSocket, req) {
  const url = new URL(req.url!, `ws://${req.headers.host}`);
  const roomId = url.searchParams.get("roomId");

  if (!roomId) {
    console.log("Connection rejected: No roomId provided.");
    ws.close();
    return;
  }

  ws.roomId = roomId;

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  rooms.get(roomId)!.add(ws);

  console.log(`Client joined room: ${roomId}`);

  ws.on("error", console.error);

  ws.on("message", function message(data: ChatMessage) {
    const room = rooms.get(ws.roomId);
    if (!room) return;

    // This is the core logic: broadcast the message to all clients
    room.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.send("Welcome to the chat server!");

  ws.on("close", () => {
    const room = rooms.get(ws.roomId);
    if (!room) return;

    // 4. Remove the client from the room on disconnection
    room.delete(ws);
    console.log(`Client left room: ${ws.roomId}`);

    // Clean up the room if it's empty
    if (room.size === 0) {
      rooms.delete(ws.roomId);
      console.log(`Room ${ws.roomId} is now empty and has been closed.`);
    }
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
