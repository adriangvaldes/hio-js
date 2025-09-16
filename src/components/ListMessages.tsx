import { useChat } from "../hooks/useChat";

export function ListMessages() {
  const { messages } = useChat();

  return (
    <section className="h-96 bg-gray-100 flex relative px-10 flex-col gap-2 justify-end pb-2">
      {messages.length === 0 && (
        <p className="text-gray-400 top-1/2 absolute left-1/2 -translate-x-1/2">
          No messages yet...
        </p>
      )}

      {messages.length > 0 &&
        messages.map((msg, index) => (
          <div
            key={index}
            className={`px-4 py-3 rounded-3xl ${msg.sender === "user" ? "bg-lime-200 w-fit self-end" : "bg-slate-300 w-fit self-start"}`}
          >
            {msg.text}
          </div>
        ))}
    </section>
  );
}
