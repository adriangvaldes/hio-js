import { SendHorizonal } from "lucide-react";
import { useChat } from "./hooks/useChat";

function App() {
  const { connectionStatus, messages, sendMessage } = useChat();
  console.log("Use chat", connectionStatus, messages);
  return (
    <div className="h-screen bg-gray-600">
      <div className="absolute bottom-5 right-5 max-w-lg">
        <section className="bg-violet-950 rounded-t-2xl pt-2 px-5">
          <h1 className="text-center font-bold text-white text-2xl">hIO.js</h1>
          <p className="text-white">
            WebSocket server implementation and TypeScript configuration
          </p>
        </section>

        <section className="h-96 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">No messages yet...</p>
        </section>

        <section className="relative">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full bg-white border border-gray-200 p-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <p className="text-gray-200 absolute bottom-1/5 right-5 ">
            <SendHorizonal />
          </p>
        </section>

        <section className="bg-violet-950 pt-1 px-5 rounded-b-2xl">
          <p className="text-white">hIO.js</p>
        </section>
      </div>
    </div>
  );
}

export default App;
