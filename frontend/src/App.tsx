import { SendMessageInput } from './components/SendMessageInput';
import { ListMessages } from './components/ListMessages';
import { ApiProvider } from './context/apiContext';

function App() {
  return (
    <ApiProvider>
      <div className="h-screen bg-gray-600">
        <div className="absolute bottom-5 right-5 max-w-lg">
          <section className="bg-violet-950 rounded-t-2xl pt-2 px-5">
            <h1 className="text-center font-bold text-white text-2xl">hIO.js</h1>
            <p className="text-white">
              WebSocket server implementation and TypeScript configuration
            </p>
          </section>

          <ListMessages />

          <SendMessageInput />

          <section className="bg-violet-950 pt-1 px-5 rounded-b-2xl">
            <p className="text-white">hIO.js</p>
          </section>
        </div>
      </div>
    </ApiProvider>
  );
}

export default App;
