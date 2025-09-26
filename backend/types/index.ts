// websocket-server/types.ts

import { WebSocket } from "ws";

// This defines the shape of the data inside the JWT
export interface UserPayload {
  role: "agent" | "customer";
  userId?: string;
  agentId?: string;
  name: string;
}

// This is the main type you asked about.
// It's a standard WebSocket, but it's guaranteed to have a 'user' property.
export interface ChatWebSocket extends WebSocket {
  user: UserPayload;
}
