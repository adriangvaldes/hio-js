export interface UserPayload {
  role: "agent" | "customer";
  userId?: string;
  agentId?: string;
  name: string;
}

export interface ChatWebSocket extends WebSocket {
  user: UserPayload;
}
