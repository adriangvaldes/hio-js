// websocket-server/index.ts
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("A new client connected! - ");

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);

    // This is the core logic: broadcast the message to all clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.send("Welcome to the chat server!");
});

console.log("WebSocket server is running on ws://localhost:8080");
