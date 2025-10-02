import { SendMessageInput } from './components/SendMessageInput';
import { ListMessages } from './components/ListMessages';
import { ApiProvider } from './context/apiContext';
import { MessageCircle, X } from 'lucide-react';

function App() {
  return (
    <ApiProvider>
      <div className="h-screen bg-gray-600">
        <div className="bg-slate-100 rounded-3xl pb-5 pt-2 px-2 absolute bottom-5 right-5 min-w-md">
          <section className="pt-2 px-5 flex justify-between items-center mb-10">
            <div className="flex items-center gap-2 ">
              <MessageCircle size={20} strokeWidth={2.75} />
              <h1 className=" text-slate-700 text-2xl">Suporte</h1>
            </div>
            <button className="text-slate-700 cursor-pointer hover:text-slate-400 transition-colors h-[24px] w-[24px] flex items-center justify-center">
              <X size={20} />
            </button>
          </section>

          <ListMessages />

          <div className="mt-5">
            <SendMessageInput />
          </div>
        </div>
      </div>
    </ApiProvider>
  );
}

export default App;
