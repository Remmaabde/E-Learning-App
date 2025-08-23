import { useState } from "react";
import { Trash2, Search, Send, AlertTriangle } from "lucide-react";

export default function ChatLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleDelete = () => {
    setMessages([]);
    alert("All chats deleted!");
  };

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-4 gap-6 w-full max-w-7xl h-[90vh] mx-auto">
    
      <div className="col-span-1 flex flex-col h-full">
        <div className="bg-[#A46FCC] rounded-md p-4 flex-1 flex flex-col">
          <div className="bg-white text-black text-base font-[Montserrat] rounded p-2">
            Recent Chats
          </div>
          <ul className="mt-4 text-white text-base space-y-1 overflow-y-auto flex-1">
            {messages.length > 0 ? (
              messages.map((msg, i) => <li key={i}>• {msg}</li>)
            ) : (
              <li>No chats yet...</li>
            )}
          </ul>
        </div>
      </div>

      
      <div className="col-span-3 flex flex-col h-full">
    
        <div className="w-full flex justify-end items-center gap-4">
          <AlertTriangle className="text-red-500 w-7 h-7" />
          <button onClick={handleDelete}>
            <Trash2 className="w-7 h-7 hover:text-red-700" style={{ color: "#082567" }} />
          </button>
          <div className="flex items-center bg-[#A46FCC] rounded-md px-3 py-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent placeholder-white text-white focus:outline-none"
            />
            <button onClick={handleSearch}>
              <Search className="text-white w-6 h-6" />
            </button>
          </div>
        </div>

    
        <div className="flex-1 overflow-y-auto border p-6 rounded-lg mt-2">
          {messages.length > 0 ? (
            messages.map((msg, i) => (
              <div key={i} className="text-[#424242] mb-2 text-base">
                {msg}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-base">No messages yet</p>
          )}
        </div>

        
        <div className="flex items-center mt-4 border-2 border-[#A46FCC] rounded p-2">
          <textarea
            placeholder="Type a new message here"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 resize-none outline-none text-[#424242] p-2 rounded text-base"
            rows={1}
          />
          <button onClick={handleSend}>
            <Send className="text-[#A46FCC] w-7 h-7 ml-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
