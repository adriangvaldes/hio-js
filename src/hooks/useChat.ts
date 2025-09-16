import { useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: number;
}

const WEBSOCKET_URL = "ws://localhost:8080";

type ConnectionStatus = "connecting" | "open" | "closed";

export const useChat = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("closed");

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socketRef.current = socket;
    setConnectionStatus("connecting");

    socket.onopen = () => {
      setConnectionStatus("open");
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);

      const message: ChatMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.onclose = () => {
      setConnectionStatus("closed");
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("closed");
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageToSend: ChatMessage = {
        id: `msg_${Date.now()}`,
        text,
        sender: "user",
        timestamp: Date.now(),
      };
      socketRef.current.send(JSON.stringify(messageToSend));
    } else {
      console.error("Cannot send message, WebSocket is not open.");
    }
  };

  return { messages, connectionStatus, sendMessage };
};
