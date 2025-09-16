import { SendHorizonal } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useState } from "react";

export function SendMessageInput() {
  const { sendMessage } = useChat();

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <section className="relative">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        className="w-full pr-15 bg-white border border-gray-200 p-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
        onChange={(e) => setMessage(e.target.value)}
      />
      <p className="text-gray-200 absolute bottom-1/5 right-5 ">
        <SendHorizonal onClick={handleSendMessage} />
      </p>
    </section>
  );
}
