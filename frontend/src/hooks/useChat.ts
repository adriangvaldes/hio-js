import { useEffect, useRef, useState } from 'react';
import { useApi } from '../context/apiContext';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

const WEBSOCKET_URL = 'ws://localhost:8080';

type ConnectionStatus = 'connecting' | 'open' | 'closed';

export const useChat = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('closed');
  const [roomId, setRoomId] = useState<string | null>(null);
  const { bearerToken, userId } = useApi();

  useEffect(() => {
    if (!bearerToken) return;
    const socket = new WebSocket(`${WEBSOCKET_URL}?token=${bearerToken}`);

    socketRef.current = socket;
    setConnectionStatus('connecting');

    socket.onopen = () => {
      setConnectionStatus('open');
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);

      const message: ChatMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.onclose = () => {
      setConnectionStatus('closed');
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('closed');
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [bearerToken]);

  const sendMessage = (text: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageToSend: ChatMessage = {
        id: `msg_${Date.now()}`,
        text,
        sender: 'user',
        timestamp: Date.now(),
      };
      console.log('Sending message:', messageToSend);

      socketRef.current.send(JSON.stringify(messageToSend));
    } else {
      console.error('Cannot send message, WebSocket is not open.');
    }
  };

  return { messages, connectionStatus, sendMessage };
};
