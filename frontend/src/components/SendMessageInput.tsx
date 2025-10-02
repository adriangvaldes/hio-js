import { SendHorizonal } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useState } from 'react';

export function SendMessageInput() {
  const { sendMessage } = useChat();

  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="relative mx-5 flex gap-5 justify-between">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        className="w-full rounded-xl pr-15 bg-slate-200 border border-gray-200 p-2 focus:outline-none focus:ring-1 focus:ring-white transition-all"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center justify-center rounded-full w-9 h-9 bg-slate-500">
        <p className="text-slate-100">
          <SendHorizonal onClick={handleSendMessage} />
        </p>
      </div>
    </section>
  );
}
